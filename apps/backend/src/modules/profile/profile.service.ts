import type {
	Branch,
	Campus,
	Experience,
	Profile,
	SocialMedia,
} from "../../database/prisma/generated/client";
import {
	ProfileAlreadyExistsError,
	ProfileNotFoundError,
} from "./profile.errors";
import type { ProfileRepository } from "./profile.repository";

type ProfileUpdateData = Partial<
	Omit<Profile, "userId" | "createdAt" | "updatedAt">
>;
type SocialMediaUpdateData = Partial<Omit<SocialMedia, "userId">>;
type ExperienceUpdateData = Omit<Experience, "id" | "userId" | "createdAt">;

export class ProfileService {
	constructor(private readonly profileRepository: ProfileRepository) {}

	async getProfile(userId: string): Promise<Profile> {
		const profile = await this.profileRepository.findProfileByUserId(userId);
		if (!profile) {
			throw new ProfileNotFoundError();
		}
		return profile;
	}

	async createProfile(
		userId: string,
		data: { batch: number; branch: Branch; campus: Campus },
	): Promise<Profile> {
		const existingProfile =
			await this.profileRepository.findProfileByUserId(userId);
		if (existingProfile) {
			throw new ProfileAlreadyExistsError();
		}

		return this.profileRepository.createProfile(userId, data);
	}

	async editProfile(
		userId: string,
		data: ProfileUpdateData,
		nested?: {
			socialMedia?: SocialMediaUpdateData;
			experiences?: ExperienceUpdateData[];
		},
	): Promise<Profile> {
		const existingProfile =
			await this.profileRepository.findProfileByUserId(userId);
		if (!existingProfile) {
			throw new ProfileNotFoundError();
		}

		if (nested === undefined) {
			return this.profileRepository.updateProfile(userId, data);
		}

		return this.profileRepository.updateProfile(userId, data, nested);
	}
}
