import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileService } from "./profile.service";
import type { ProfileRepository } from "./profile.repository";
import { ProfileAlreadyExistsError, ProfileNotFoundError } from "./profile.errors";
import type { Profile, Branch, Campus } from "../../database/prisma/generated/client";

const now = new Date();

const sampleProfile: Profile = {
	userId: "018f6b4f-4580-7000-8000-000000000001",
	batch: 2026,
	branch: "CSE" as Branch,
	campus: "MAIN" as Campus,
	city: "New Delhi",
	country: "India",
	latitude: null,
	longitude: null,
	currentCompany: null,
	currentRole: null,
	profilePicture: null,
	createdAt: now,
	updatedAt: now,
};

type MockProfileRepository = {
	[Key in keyof ProfileRepository]: ReturnType<typeof vi.fn>;
};

const createRepository = (): MockProfileRepository =>
	({
		findProfileByUserId: vi.fn(),
		createProfile: vi.fn(),
		updateProfile: vi.fn(),
	}) as unknown as MockProfileRepository;

describe("ProfileService", () => {
	let repository: MockProfileRepository;
	let service: ProfileService;

	beforeEach(() => {
		repository = createRepository();
		service = new ProfileService(repository as unknown as ProfileRepository);
	});

	describe("getProfile", () => {
		it("returns profile when it exists", async () => {
			repository.findProfileByUserId.mockResolvedValue(sampleProfile);

			const result = await service.getProfile(sampleProfile.userId);

			expect(repository.findProfileByUserId).toHaveBeenCalledWith(sampleProfile.userId);
			expect(result).toEqual(sampleProfile);
		});

		it("throws ProfileNotFoundError when profile does not exist", async () => {
			repository.findProfileByUserId.mockResolvedValue(null);

			await expect(service.getProfile(sampleProfile.userId)).rejects.toBeInstanceOf(
				ProfileNotFoundError
			);
		});
	});

	describe("createProfile", () => {
		it("creates a new profile when one does not exist", async () => {
			repository.findProfileByUserId.mockResolvedValue(null);
			repository.createProfile.mockResolvedValue(sampleProfile);

			const createData = {
				batch: 2026,
				branch: "CSE" as Branch,
				campus: "MAIN" as Campus,
			};

			const result = await service.createProfile(sampleProfile.userId, createData);

			expect(repository.findProfileByUserId).toHaveBeenCalledWith(sampleProfile.userId);
			expect(repository.createProfile).toHaveBeenCalledWith(sampleProfile.userId, createData);
			expect(result).toEqual(sampleProfile);
		});

		it("throws ProfileAlreadyExistsError when profile already exists", async () => {
			repository.findProfileByUserId.mockResolvedValue(sampleProfile);

			const createData = {
				batch: 2026,
				branch: "CSE" as Branch,
				campus: "MAIN" as Campus,
			};

			await expect(
				service.createProfile(sampleProfile.userId, createData)
			).rejects.toBeInstanceOf(ProfileAlreadyExistsError);
		});
	});

	describe("editProfile", () => {
		it("updates existing profile successfully", async () => {
			repository.findProfileByUserId.mockResolvedValue(sampleProfile);
			const updatedProfile = { ...sampleProfile, city: "Bengaluru" };
			repository.updateProfile.mockResolvedValue(updatedProfile);

			const result = await service.editProfile(sampleProfile.userId, { city: "Bengaluru" });

			expect(repository.findProfileByUserId).toHaveBeenCalledWith(sampleProfile.userId);
			expect(repository.updateProfile).toHaveBeenCalledWith(sampleProfile.userId, {
				city: "Bengaluru",
			});
			expect(result.city).toBe("Bengaluru");
		});

		it("throws ProfileNotFoundError when profile to update does not exist", async () => {
			repository.findProfileByUserId.mockResolvedValue(null);

			await expect(
				service.editProfile(sampleProfile.userId, { city: "Bengaluru" })
			).rejects.toBeInstanceOf(ProfileNotFoundError);
		});
	});
});
