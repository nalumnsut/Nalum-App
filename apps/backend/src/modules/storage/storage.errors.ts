import AppError from "../../errors/app.error";
import BadRequestError from "../../errors/bad-request.error";
import NotFoundError from "../../errors/not-found.error";

export class StorageBucketNotFoundError extends AppError {
	constructor() {
		super(false, {
			code: "STORAGE_BUCKET_NOT_FOUND",
			message: "Storage bucket not found",
			statusCode: 500,
		});
		this.name = "StorageBucketNotFoundError";
	}
}

export class StorageInvalidCredentialsError extends AppError {
	constructor() {
		super(false, {
			code: "STORAGE_INVALID_CREDENTIALS",
			message: "Storage credentials are invalid",
			statusCode: 500,
		});
		this.name = "StorageInvalidCredentialsError";
	}
}

export class StorageUploadFailedError extends AppError {
	constructor() {
		super(false, {
			code: "STORAGE_UPLOAD_FAILED",
			message: "Failed to upload file",
			statusCode: 500,
		});
		this.name = "StorageUploadFailedError";
	}
}

export class StorageObjectNotFoundError extends NotFoundError {
	constructor() {
		super("Storage object not found", "STORAGE_OBJECT_NOT_FOUND");
		this.name = "StorageObjectNotFoundError";
	}
}

export class UnsupportedStorageObjectKeyError extends BadRequestError {
	constructor() {
		super(
			"Storage object key is not allowed",
			"STORAGE_OBJECT_KEY_NOT_ALLOWED",
		);
		this.name = "UnsupportedStorageObjectKeyError";
	}
}
