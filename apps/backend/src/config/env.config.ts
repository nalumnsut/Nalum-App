/**
 * env
 * This file is responsible for loading and validating environment variables using the zod library. It ensures that all required environment variables are present and correctly formatted before the application starts. If any required variable is missing or invalid, it will throw an error and prevent the application from running.
 */

import dotenv from "dotenv";
import z from "zod/v4";

dotenv.config();

// Define and validate all required environment variables.

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(5000),
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string().min(32),
	JWT_EXPIRES_IN: z.string().default("1h"),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_CALLBACK_URL: z.url(),
	GOOGLE_REDIRECT_URL: z.url(),
});

// Validate once during application startup.

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
	console.error(
		"Invalid environment variables:",
		z.treeifyError(parseResult.error),
	);
	process.exit(1);
}

export const env = parseResult.data;

export type env = z.infer<typeof envSchema>;
