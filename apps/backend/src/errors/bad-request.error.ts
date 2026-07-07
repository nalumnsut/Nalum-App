/**
 * Bad request error.
 *
 * Represents invalid client input.
 */
import AppError from "./app.error";

class BadRequestError extends AppError {
	constructor(message = "Bad request", code = "BAD_REQUEST") {
		super(false, {
			code,
			message,
			statusCode: 400,
		});
		this.name = "BadRequestError";
	}
}

export default BadRequestError;
