/**
 * Validation error.
 *
 * Represents request data that failed schema checks.
 */
import AppError from "./app.error";

class ValidationError extends AppError {
	constructor(
		message = "Validation failed",
		code = "VALIDATION_ERROR",
		statusCode = 422,
	) {
		super(false, {
			code,
			message,
			statusCode,
		});
		this.name = "ValidationError";
	}
}

export default ValidationError;
