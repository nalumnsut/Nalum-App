/**
 * Conflict error.
 *
 * Represents a request that conflicts with the current resource state.
 */
import AppError from "./app.error";

class ConflictError extends AppError {
	constructor(message = "Conflict", code = "CONFLICT") {
		super(false, {
			code,
			message,
			statusCode: 409,
		});
		this.name = "ConflictError";
	}
}

export default ConflictError;
