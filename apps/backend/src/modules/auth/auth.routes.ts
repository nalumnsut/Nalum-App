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
				summary: "Register a local account",
				description:
					"Creates a password-based account and returns access and refresh tokens.",
				tags: ["Auth"],
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
				summary: "Log in with email and password",
				description:
					"Authenticates an existing password-based account and issues a new session.",
				tags: ["Auth"],
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
				summary: "Refresh the access token",
				description:
					"Uses the refresh-token cookie to rotate the session and mint a new access token.",
				tags: ["Auth"],
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
				summary: "Log out the current session",
				description:
					"Revokes the refresh token cookie and ends the current session.",
				tags: ["Auth"],
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
				summary: "Complete Google sign-in",
				description:
					"Handles the Google OAuth callback, links or creates the account, and returns a session.",
				tags: ["Auth", "Google"],
				response: {
					200: schema.authResponseSchema,
				},
			},
		},
		controller.googleCallback,
	);
};

export default authRoutes;
