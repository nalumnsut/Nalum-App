/**
 * auth Controller
 *
 * Responsibilities:
 * - Parse incoming requests.
 * - Delegate work to the service layer.
 * - Return HTTP responses.
 *
 * Do NOT:
 * - Contain business logic.
 * - Access the database.
 * - Perform validation.
 */
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../config/env.config";
import {
	ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_PATH,
} from "./auth.constants";
import type { GoogleUserInfo } from "./auth.types";
import type { LoginBody, RegisterBody, VerifyEmailOtpBody } from "./auth.schema";
import type { AuthService } from "./auth.service";
import type { AccessTokenPayload, AuthSession } from "./auth.types";

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	register = async (
		request: FastifyRequest<{ Body: RegisterBody }>,
		reply: FastifyReply,
	) => {
		const session = await this.authService.register(request.body);
		return this.sendAuthSession(reply, session, "Registered successfully", 201);
	};

	login = async (
		request: FastifyRequest<{ Body: LoginBody }>,
		reply: FastifyReply,
	) => {
		const session = await this.authService.login(request.body);
		return this.sendAuthSession(reply, session, "Logged in successfully");
	};

	refresh = async (request: FastifyRequest, reply: FastifyReply) => {
		const session = await this.authService.refresh(
			request.cookies[REFRESH_TOKEN_COOKIE_NAME],
		);
		return this.sendAuthSession(reply, session, "Token refreshed");
	};

	logout = async (request: FastifyRequest, reply: FastifyReply) => {
		await this.authService.logout(request.cookies[REFRESH_TOKEN_COOKIE_NAME]);

		this.clearRefreshCookie(reply);
		return reply.success(null, "Logged out successfully");
	};

	sendEmailVerificationOtp = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		await this.authService.sendEmailVerificationOtp(request.currentUser!);
		return reply.success(null, "Email verification OTP sent");
	};

	verifyEmailOtp = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const body = request.body as VerifyEmailOtpBody;
		await this.authService.verifyEmailOtp(
			request.currentUser!,
			body.otp,
		);
		return reply.success(null, "Email verified successfully");
	};

	googleCallback = async (request: FastifyRequest, reply: FastifyReply) => {
		const { token } = await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
			request,
			reply,
		);

		const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${token.access_token}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch Google profile");
		}

		const profile = (await response.json()) as GoogleUserInfo;
		const session = await this.authService.loginWithGoogle(profile);
		return this.sendAuthSession(reply, session, "Logged in with Google");
	};

	private async sendAuthSession(
		reply: FastifyReply,
		session: AuthSession,
		message: string,
		statusCode = 200,
	) {
		this.setRefreshCookie(
			reply,
			session.refreshToken,
			session.refreshTokenExpiresAt,
		);

		const accessToken = await reply.jwtSign(
			session.accessTokenPayload satisfies AccessTokenPayload,
			{
				sign: {
					expiresIn: ACCESS_TOKEN_EXPIRY,
				},
			},
		);

		return reply.success(
			{
				accessToken,
				user: session.user,
			},
			message,
			statusCode,
		);
	}

	private setRefreshCookie(
		reply: FastifyReply,
		refreshToken: string,
		expiresAt: Date,
	) {
		reply.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
			expires: expiresAt,
			httpOnly: true,
			path: REFRESH_TOKEN_COOKIE_PATH,
			sameSite: "lax",
			secure: env.NODE_ENV === "production",
			signed: false,
		});
	}

	private clearRefreshCookie(reply: FastifyReply) {
		reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
			httpOnly: true,
			path: REFRESH_TOKEN_COOKIE_PATH,
			sameSite: "lax",
			secure: env.NODE_ENV === "production",
			signed: false,
		});
	}
}
