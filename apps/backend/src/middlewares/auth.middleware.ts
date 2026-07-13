import type { FastifyReply, FastifyRequest } from "fastify";
import UnauthorizedError from "../errors/unauthorized.error";
import type { AccessTokenPayload } from "../modules/auth/auth.types";
import type { User } from "../database/prisma/generated/client";

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: AccessTokenPayload;
		user: AccessTokenPayload;
	}
}

declare module "fastify" {
	interface FastifyRequest {
		currentUser?: User;
	}
}

export const authenticate = async (
	request: FastifyRequest,
	_reply: FastifyReply,
) => {
	try {
		const user = await request.jwtVerify<AccessTokenPayload>();

		if (user.tokenType !== "access") {
			throw new UnauthorizedError(
				"Invalid token type",
				"AUTH_INVALID_TOKEN_TYPE",
			);
		}
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			throw error;
		}

		throw new UnauthorizedError("Authentication required", "AUTH_REQUIRED");
	}
};

export const protect = async (
	request: FastifyRequest,
	_reply: FastifyReply,
) => {
	await authenticate(request, _reply);

	const userId = request.user.sub;
	const user = await request.server.prisma.user.findUnique({
		where: { id: userId },
		include: {
			bans: {
				where: {
					revokedAt: null,
					OR: [
						{ expiresAt: null },
						{ expiresAt: { gt: new Date() } }
					]
				}
			}
		}
	});

	if (!user) {
		throw new UnauthorizedError("User not found or deleted", "USER_NOT_FOUND");
	}

	if (user.bans.length > 0) {
		throw new UnauthorizedError("User has been banned from the platform", "USER_BANNED");
	}

	request.currentUser = user;
};

