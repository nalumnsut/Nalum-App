/**
 * Error mapper.
 *
 * Converts unknown thrown values into the shared AppError shape.
 */

import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
} from "fastify-type-provider-zod";
import { ZodError } from "zod/v4";
import AppError, { type AppErrorDetails } from "./app.error";
import BadRequestError from "./bad-request.error";
import ConflictError from "./conflict.error";
import ForbiddenError from "./forbidden.error";
import NotFoundError from "./not-found.error";
import UnauthorizedError from "./unauthorized.error";
import ValidationError from "./validation.error";

const internalServerError: AppErrorDetails = {
	code: "INTERNAL_SERVER_ERROR",
	message: "Internal server error",
	statusCode: 500,
};

const normalizeMessage = (message: unknown, fallback: string) =>
	typeof message === "string" && message.trim().length > 0 ? message : fallback;

export const mapError = (error: unknown): AppError => {
	// Handle already-normalized application errors.
	if (error instanceof AppError) {
		return error;
	}

	if (error instanceof ZodError) {
		return new ValidationError(formatZodIssues(error.issues));
	}

	if (hasZodFastifySchemaValidationErrors(error)) {
		return new ValidationError(
			formatFastifyValidation(error.validation),
			"VALIDATION_ERROR",
			400,
		);
	}

	if (isResponseSerializationError(error)) {
		return new AppError(false, internalServerError);
	}

	// Handle thrown objects with error-like fields.
	if (error && typeof error === "object") {
		const typedError = error as Record<string, unknown>;
		const prismaError = mapPrismaError(typedError);

		if (prismaError) {
			return prismaError;
		}

		if (Array.isArray(typedError.validation)) {
			return new ValidationError(
				formatFastifyValidation(typedError.validation),
				"VALIDATION_ERROR",
				400,
			);
		}

		if (typedError.code === "FST_REQ_FILE_TOO_LARGE") {
			return new BadRequestError("File is too large", "FILE_TOO_LARGE");
		}

		const message = normalizeMessage(
			typedError.message,
			internalServerError.message,
		);
		const code =
			typeof typedError.code === "string"
				? typedError.code
				: internalServerError.code;
		const statusCode =
			typeof typedError.statusCode === "number" &&
			typedError.statusCode >= 400 &&
			typedError.statusCode < 600
				? typedError.statusCode
				: internalServerError.statusCode;

		// Route common HTTP status codes to dedicated error classes.
		switch (statusCode) {
			case 400:
				return code === "VALIDATION_ERROR"
					? new ValidationError(message, code, 400)
					: new BadRequestError(message, code);
			case 401:
				return new UnauthorizedError(message, code);
			case 403:
				return new ForbiddenError(message, code);
			case 404:
				return new NotFoundError(message, code);
			case 409:
				return new ConflictError(message, code);
			case 422:
				return new ValidationError(message, code);
			default:
				return new AppError(false, {
					code,
					message,
					statusCode,
				});
		}
	}

	// Fallback for non-object values.
	return new AppError(false, internalServerError);
};

const formatZodIssues = (
	issues: Array<{ path: PropertyKey[]; message: string }>,
) => {
	if (issues.length === 0) {
		return "Validation failed";
	}

	return issues
		.map((issue) => {
			const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
			return `${path}${issue.message}`;
		})
		.join("; ");
};

const formatFastifyValidation = (validation: unknown[]) => {
	if (validation.length === 0) {
		return "Validation failed";
	}

	return validation
		.map((issue) => {
			if (!issue || typeof issue !== "object") {
				return "Validation failed";
			}

			const typedIssue = issue as Record<string, unknown>;
			const instancePath =
				typeof typedIssue.instancePath === "string"
					? typedIssue.instancePath.replace(/^\//, "").replaceAll("/", ".")
					: "";
			const message = normalizeMessage(typedIssue.message, "Validation failed");

			return instancePath ? `${instancePath}: ${message}` : message;
		})
		.join("; ");
};

const mapPrismaError = (error: Record<string, unknown>) => {
	if (error.code === "P2002") {
		return new ConflictError(
			"Resource already exists",
			"DATABASE_UNIQUE_CONSTRAINT",
		);
	}

	if (error.code === "P2025") {
		return new NotFoundError("Resource not found", "DATABASE_RECORD_NOT_FOUND");
	}

	return null;
};

export default mapError;
