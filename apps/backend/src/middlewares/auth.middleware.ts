import type { FastifyReply, FastifyRequest } from "fastify";
import UnauthorizedError from "../errors/unauthorized.error";
import type { AccessTokenPayload } from "../modules/auth/auth.types";

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: AccessTokenPayload;
		user: AccessTokenPayload;
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
