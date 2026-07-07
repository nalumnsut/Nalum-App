/**
 * Logger
 *
 * Global logger configuration for the application.
 *
 * Responsibilities:
 * Configure and export a logger instance for use throughout the application.
 *  Ensure consistent logging format and levels across different modules.
 */
import type { FastifyServerOptions } from "fastify";
import { env } from "./env.config";

// Define different configurations based on the environment
const loggerConfig: Record<
	"development" | "production" | "test",
	FastifyServerOptions["logger"]
> = {
	development: {
		level: "debug",
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				singleLine: false,
				translateTime: "SYS:standard",
				ignore: "pid,hostname",
			},
		},
	},
	production: {
		level: "info",
		// No pino-pretty in production!
		serializers: {
			req(request) {
				return {
					method: request.method,
					url: request.url,
					hostname: request.hostname,
					remoteAddress: request.ip,
				};
			},
		},
	},
	test: false, // Turn off logging during tests to keep console clean
};

// Export the configuration based on current environment
export const loggerOptions = loggerConfig[env.NODE_ENV];
