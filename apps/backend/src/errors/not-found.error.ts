/**
 * Not found error.
 *
 * Represents a missing resource.
 */
import AppError from "./app.error";

class NotFoundError extends AppError {
	constructor(message = "Not found", code = "NOT_FOUND") {
		super(false, {
			code,
			message,
			statusCode: 404,
		});
		this.name = "NotFoundError";
	}
}

export default NotFoundError;
