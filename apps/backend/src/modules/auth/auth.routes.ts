/**
 * auth Routes
 *
 * Responsibilities:
 * - Register endpoints.
 * - Attach middleware.
 * - Attach schemas.
 */

import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthController } from "./auth.controller";
import AuthRepository from "./auth.repository";
import * as schema from "./auth.schema";
import { AuthService } from "./auth.service";
import oauthPlugin from "../../plugins/oauth.plugin";



const authRoutes: FastifyPluginAsync = async (fastify) => {
	const repository = new AuthRepository(fastify.prisma);
	const service = new AuthService(repository);
	const controller = new AuthController(service);
	const app = fastify.withTypeProvider<ZodTypeProvider>();

	await fastify.register(oauthPlugin);

	app.post(
		"/register",
		{
			schema: {
				body: schema.registerSchemaRequest,
				response: {
					201: schema.authResponseSchema,
				},
			},
		},
		controller.register,
	);

	app.post(
		"/login",
		{
			schema: {
				body: schema.loginSchemaRequest,
				response: {
					200: schema.authResponseSchema,
				},
			},
		},
		controller.login,
	);

	app.post(
		"/refresh",
		{
			schema: {
				response: {
					200: schema.authResponseSchema,
				},
			},
		},
		controller.refresh,
	);

	app.post(
		"/logout",
		{
			schema: {
				response: {
					200: schema.logoutResponseSchema,
				},
			},
		},
		controller.logout,
	);

	app.get(
		"/google/callback",
		{
			schema: {
				response: {
					200: schema.authResponseSchema,
				},
			},
		},
		controller.googleCallback,
	);
};

export default authRoutes;
