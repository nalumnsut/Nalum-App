/**
 * auth Service
 *
 * Responsibilities:
 * - Business logic.
 * - Authorization.
 * - Coordinate repositories.
 *
 * Do NOT:
 * - Access req/res.
 * - Return HTTP responses.
 * - Query the database directly.
 */
import { createHash, randomBytes, randomInt } from "node:crypto";
import { compare, hash } from "bcrypt";
import { REFRESH_TOKEN_TTL_DAYS } from "./auth.constants";
import {
	EmailAlreadyExistsError,
	InvalidCredentialsError,
	InvalidRefreshTokenError,
	MissingRefreshTokenError,
	InvalidEmailError,
	EmailAlreadyVerifiedError,
	InvalidEmailOtpError,
} from "./auth.errors";
import type { IEmailService } from "./email.service";
import type { LoginBody, RegisterBody } from "./auth.schema";
import type {
	AccessTokenPayload,
	AuthSession,
	AuthUser,
	GoogleUserInfo,
	CreateRefreshTokenInput,
	EmailOtpRecord,
	RefreshTokenRecord,
	UserWithPassword,
} from "./auth.types";

export class AuthService {
	constructor(
		private readonly repository: AuthRepositoryContract,
		private readonly emailService: IEmailService,
	) {}

	async register(input: RegisterBody): Promise<AuthSession> {
		if (!input.email.endsWith("@nsut.ac.in") && input.role === "STUDENT") {
			throw new InvalidEmailError();
		}
		const existingUser = await this.repository.findUserByEmail(input.email);

		if (existingUser) {
			throw new EmailAlreadyExistsError();
		}

		const passwordHash = await hash(input.password, 12);
		const user = await this.repository.createUser({
			firstName: input.firstName,
			lastName: input.lastName,
			email: input.email,
			passwordHash,
			role: input.role,
		});

		return this.createSession(user);
	}

	async login(input: LoginBody): Promise<AuthSession> {
		const user = await this.repository.findUserByEmail(input.email);

		if (!user || !user.passwordHash) {
			throw new InvalidCredentialsError();
		}

		const passwordMatches = await compare(input.password, user.passwordHash);

		if (!passwordMatches) {
			throw new InvalidCredentialsError();
		}
		return this.createSession(user);
	}

	async loginWithGoogle(profile: GoogleUserInfo): Promise<AuthSession> {
		const userByGoogleId = await this.repository.findUserByGoogleId(profile.sub);

		if (userByGoogleId) {
			return this.createSession(userByGoogleId);
		}

		const userByEmail = await this.repository.findUserByEmail(profile.email);

		if (userByEmail) {
			const linkedUser = await this.repository.updateUserGoogleId(
				userByEmail.id,
				profile.sub,
			);

			return this.createSession(linkedUser);
		}
		const Role = profile.email.endsWith("@nsut.ac.in") ? "STUDENT" : "ALUMNI"; 
		const user = await this.repository.createUser({
			firstName: this.getGoogleFirstName(profile),
			lastName: this.getGoogleLastName(profile),
			email: profile.email,
			passwordHash: null,
			googleId: profile.sub,
			role: Role,
			emailVerified: true,
			emailVerifiedAt: new Date(),
		});

		return this.createSession(user);
	}

	async sendEmailVerificationOtp(user: AuthUser) {
		if (user.emailVerified) {
			throw new EmailAlreadyVerifiedError();
		}

		const otp = this.generateEmailOtp();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

		await this.repository.createEmailOtp({
			userId: user.id,
			otpHash: this.hashEmailOtp(otp),
			expiresAt,
		});

		await this.emailService.sendEmailVerificationOtp({
			to: user.email,
			firstName: user.firstName,
			otp,
		});
	}

	async verifyEmailOtp(user: AuthUser, otp: string) {
		if (user.emailVerified) {
			throw new EmailAlreadyVerifiedError();
		}

		const emailOtp = await this.repository.findLatestEmailOtp(user.id);

		if (!emailOtp || !this.isUsableEmailOtp(emailOtp, otp)) {
			throw new InvalidEmailOtpError();
		}

		await this.repository.consumeEmailOtp(emailOtp.id);
		await this.repository.updateUserEmailVerified(user.id);
	}

	async refresh(rawRefreshToken?: string): Promise<AuthSession> {
		if (!rawRefreshToken) {
			throw new MissingRefreshTokenError();
		}

		const currentToken = await this.repository.findRefreshTokenByHash(
			this.hashRefreshToken(rawRefreshToken),
		);

		if (!this.isUsableRefreshToken(currentToken)) {
			throw new InvalidRefreshTokenError();
		}

		const nextRefreshToken = this.generateRefreshToken();
		const nextRefreshTokenExpiresAt = this.getRefreshTokenExpiry();

		await this.repository.rotateRefreshToken(currentToken.id, {
			userId: currentToken.userId,
			tokenHash: this.hashRefreshToken(nextRefreshToken),
			expiresAt: nextRefreshTokenExpiresAt,
		});

		return {
			accessTokenPayload: this.createAccessTokenPayload(currentToken.user),
			refreshToken: nextRefreshToken,
			refreshTokenExpiresAt: nextRefreshTokenExpiresAt,
			user: this.toAuthUser(currentToken.user),
		};
	}

	async logout(rawRefreshToken?: string) {
		if (!rawRefreshToken) {
			throw new MissingRefreshTokenError();
		}

		await this.repository.revokeRefreshTokenByHash(
			this.hashRefreshToken(rawRefreshToken),
		);
	}

	private async createSession(user: UserWithPassword): Promise<AuthSession> {
		const refreshToken = this.generateRefreshToken();
		const refreshTokenExpiresAt = this.getRefreshTokenExpiry();

		await this.repository.createRefreshToken({
			userId: user.id,
			tokenHash: this.hashRefreshToken(refreshToken),
			expiresAt: refreshTokenExpiresAt,
		});

		return {
			accessTokenPayload: this.createAccessTokenPayload(user),
			refreshToken,
			refreshTokenExpiresAt,
			user: this.toAuthUser(user),
		};
	}

	private createAccessTokenPayload(user: AuthUser): AccessTokenPayload {
		return {
			sub: user.id,
			email: user.email,
			role: user.role,
			tokenType: "access",
		};
	}

	private generateRefreshToken() {
		return randomBytes(64).toString("base64url");
	}

	private generateEmailOtp() {
		return String(randomInt(100000, 1000000));
	}

	private hashRefreshToken(refreshToken: string) {
		return createHash("sha256").update(refreshToken).digest("hex");
	}

	private hashEmailOtp(otp: string) {
		return createHash("sha256").update(otp).digest("hex");
	}

	private getRefreshTokenExpiry(rememberMe: boolean = false) {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + (rememberMe ? REFRESH_TOKEN_TTL_DAYS : 1));
		return expiresAt;
	}

	private isUsableRefreshToken(
		token: RefreshTokenRecord | null,
	): token is RefreshTokenRecord {
		return Boolean(
			token && !token.revokedAt && token.expiresAt.getTime() > Date.now(),
		);
	}

	private isUsableEmailOtp(token: EmailOtpRecord, otp: string) {
		return (
			token.consumedAt === null &&
			token.expiresAt.getTime() > Date.now() &&
			token.otpHash === this.hashEmailOtp(otp)
		);
	}

	private toAuthUser(user: UserWithPassword): AuthUser {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
			emailVerified: user.emailVerified,
			profileCompleted: user.profileCompleted,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	private getGoogleFirstName(profile: GoogleUserInfo) {
		const emailPrefix = profile.email.split("@")[0] ?? "Google";
		return profile.given_name ?? profile.name?.split(" ")[0] ?? emailPrefix;
	}

	private getGoogleLastName(profile: GoogleUserInfo) {
		return profile.family_name ?? profile.name?.split(" ").slice(1).join(" ") ?? "User";
	}
}

export interface AuthRepositoryContract {
	findUserByEmail(email: string): Promise<UserWithPassword | null>;
	findUserByGoogleId(googleId: string): Promise<UserWithPassword | null>;
	createUser(input: {
		firstName: string;
		lastName: string;
		email: string;
		passwordHash: string | null;
		googleId?: string | null;
		role: RegisterBody["role"];
		emailVerified?: boolean;
		emailVerifiedAt?: Date | null;
	}): Promise<UserWithPassword>;
	updateUserGoogleId(userId: string, googleId: string): Promise<UserWithPassword>;
	updateUserEmailVerified(userId: string): Promise<UserWithPassword>;
	createRefreshToken(input: CreateRefreshTokenInput): Promise<unknown>;
	findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
	rotateRefreshToken(
		currentTokenId: string,
		nextToken: CreateRefreshTokenInput,
	): Promise<unknown>;
	revokeRefreshTokenByHash(tokenHash: string): Promise<unknown>;
	createEmailOtp(input: {
		userId: string;
		otpHash: string;
		expiresAt: Date;
	}): Promise<EmailOtpRecord>;
	findLatestEmailOtp(userId: string): Promise<EmailOtpRecord | null>;
	consumeEmailOtp(id: string): Promise<EmailOtpRecord>;
}
