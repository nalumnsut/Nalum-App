import type { FastifyPluginAsync } from "fastify";
import authRoutes from "./auth/auth.routes";
import profileRoutes from "./profile/profile.routes";
import storageRoutes from "./storage/storage.routes";
import userRoutes from "./user/user.routes";

export const registerModules: FastifyPluginAsync = async (fastify) => {
	await fastify.register(authRoutes, { prefix: "/api/auth" });
	await fastify.register(profileRoutes, { prefix: "/api/profile" });
	await fastify.register(storageRoutes, { prefix: "/api/storage" });
	await fastify.register(userRoutes, { prefix: "/api/users" });
};
