/**
 * Forbidden error.
 *
 * Represents a request that is not allowed.
 */
import AppError from "./app.error";

class ForbiddenError extends AppError {
	constructor(message = "Forbidden", code = "FORBIDDEN") {
		super(false, {
			code,
			message,
			statusCode: 403,
		});
		this.name = "ForbiddenError";
	}
}

export default ForbiddenError;
