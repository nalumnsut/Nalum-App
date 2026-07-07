/**
 * Response plugin.
 *
 * Adds shared reply helpers for success payloads.
 */

import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyReply {
		success: (
			data?: unknown,
			message?: string,
			statusCode?: number,
		) => FastifyReply;
	}
}

const responsePlugin: FastifyPluginAsync = async (fastify) => {
	fastify.decorateReply(
		"success",
		function (data = null, message = "Success", statusCode = 200) {
			return this.status(statusCode).send({
				success: true,
				message,
				data,
			});
		},
	);
};

export default fp(responsePlugin);
