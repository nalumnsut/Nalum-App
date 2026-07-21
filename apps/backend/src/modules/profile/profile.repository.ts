import type {
	Branch,
	Campus,
	Experience,
	PrismaClient,
	Profile,
	SocialMedia,
} from "../../database/prisma/generated/client";

type ProfileUpdateData = Partial<
	Omit<Profile, "userId" | "createdAt" | "updatedAt">
>;
type SocialMediaUpdateData = Partial<Omit<SocialMedia, "userId">>;
type ExperienceUpdateData = Omit<Experience, "id" | "userId" | "createdAt">;

export class ProfileRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findProfileByUserId(userId: string): Promise<Profile | null> {
		return this.prisma.profile.findUnique({
			where: { userId },
		});
	}

	async createProfile(
		userId: string,
		data: { batch: number; branch: Branch; campus: Campus },
	): Promise<Profile> {
		return this.prisma.$transaction(async (tx) => {
			const profile = await tx.profile.create({
				data: {
					userId,
					batch: data.batch,
					branch: data.branch,
					campus: data.campus,
				},
			});

			await tx.user.update({
				where: { id: userId },
				data: { profileCompleted: true },
			});

			return profile;
		});
	}

	async updateProfile(
		userId: string,
		data: ProfileUpdateData,
		nested?: {
			socialMedia?: SocialMediaUpdateData;
			experiences?: ExperienceUpdateData[];
		},
	): Promise<Profile> {
		return this.prisma.$transaction(async (tx) => {
			const profile = await tx.profile.update({
				where: { userId },
				data,
			});

			if (nested?.socialMedia) {
				await tx.socialMedia.upsert({
					where: { userId },
					create: {
						userId,
						...nested.socialMedia,
					},
					update: nested.socialMedia,
				});
			}

			if (nested?.experiences) {
				await tx.experience.deleteMany({
					where: { userId },
				});

				if (nested.experiences.length > 0) {
					await tx.experience.createMany({
						data: nested.experiences.map((experience) => ({
							userId,
							...experience,
						})),
					});
				}
			}

			return profile;
		});
	}
}
