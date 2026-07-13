export const PROFILE_PICTURE_UPLOAD_PREFIX = "profilepicture";

export const toStorageObjectUrl = (key: string | null | undefined) => {
	if (!key) return null;
	if (key.startsWith("/api/storage/objects/")) return key;

	return `/api/storage/objects/${key
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/")}`;
};

export const isAllowedStorageObjectKey = (key: string) => {
	if (!key || key.startsWith("/") || key.includes("..")) return false;
	return key.startsWith(`${PROFILE_PICTURE_UPLOAD_PREFIX}/`);
};
