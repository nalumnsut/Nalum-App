import ConflictError from "../../errors/conflict.error";
import NotFoundError from "../../errors/not-found.error";

export class ProfileAlreadyExistsError extends ConflictError {
	constructor() {
		super("Profile already exists for this user", "PROFILE_ALREADY_EXISTS");
		this.name = "ProfileAlreadyExistsError";
	}
}

export class ProfileNotFoundError extends NotFoundError {
	constructor() {
		super("Profile not found", "PROFILE_NOT_FOUND");
		this.name = "ProfileNotFoundError";
	}
}