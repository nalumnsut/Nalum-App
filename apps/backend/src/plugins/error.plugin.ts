/**
 * Error plugin.
 *
 * Registers the shared backend error handler.
 */
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import errorHandler from "../errors/error-handler";

const errorPlugin: FastifyPluginAsync = async (app) => {
	// Attach the shared error handler.
	app.setErrorHandler(errorHandler);
};

export default fp(errorPlugin);
