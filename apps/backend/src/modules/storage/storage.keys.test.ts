import { describe, expect, it } from "vitest";
import { isAllowedStorageObjectKey, toStorageObjectUrl } from "./storage.keys";

describe("storage keys", () => {
	it("converts object keys to protected API URLs", () => {
		expect(toStorageObjectUrl("profilepicture/user-id/avatar.webp")).toBe(
			"/api/storage/objects/profilepicture/user-id/avatar.webp",
		);
	});

	it("allows only profile picture object keys", () => {
		expect(
			isAllowedStorageObjectKey("profilepicture/user-id/avatar.webp"),
		).toBe(true);
		expect(isAllowedStorageObjectKey("events/event-id/banner.webp")).toBe(
			false,
		);
		expect(isAllowedStorageObjectKey("../profilepicture/avatar.webp")).toBe(
			false,
		);
	});
});
