import type { FastifyPluginAsync } from "fastify";
import authRoutes from "./auth/auth.routes";
export const registerModules: FastifyPluginAsync = async (fastify) => {
	await fastify.register(authRoutes, { prefix: "/api/auth" });
};
