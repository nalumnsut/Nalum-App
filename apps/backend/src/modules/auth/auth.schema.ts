/**
 * auth Schemas
 *
 * Define request and response schemas using Zod.
 */

import { z } from "zod/v4";

const registerSchemaRequest = z.object({
	role: z.enum(["STUDENT", "ALUMNI", "ADMIN", "PROFESSOR"]),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.email(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchemaRequest = z.object({
	email: z.email(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

const userResponseSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.email(),
	role: z.enum(["STUDENT", "ALUMNI", "ADMIN", "PROFESSOR"]),
	emailVerified: z.boolean(),
	profileCompleted: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const authDataSchema = z.object({
	accessToken: z.string(),
	user: userResponseSchema,
});

const authResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	data: authDataSchema,
});

const logoutResponseSchema = z.object({
	success: z.literal(true),
	message: z.string(),
	data: z.null(),
});

export {
	authDataSchema,
	authResponseSchema,
	loginSchemaRequest,
	logoutResponseSchema,
	registerSchemaRequest,
	userResponseSchema,
};

export type RegisterBody = z.infer<typeof registerSchemaRequest>;
export type LoginBody = z.infer<typeof loginSchemaRequest>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthData = z.infer<typeof authDataSchema>;
export type AuthResponseSchema = z.infer<typeof authResponseSchema>;
