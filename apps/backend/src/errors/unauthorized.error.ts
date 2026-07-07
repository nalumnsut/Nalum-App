/**
 * Unauthorized error.
 *
 * Represents a request that needs valid authentication.
 */
import AppError from "./app.error";

class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
		super(false, {
			code,
			message,
			statusCode: 401,
		});
		this.name = "UnauthorizedError";
	}
}

export default UnauthorizedError;
