import type { PrismaClient } from "../../database/prisma/generated/client";
import { Prisma } from "../../database/prisma/generated/client";
import type { SearchUsersFilters, UserDetailsRecord } from "./user.types";

const userDetailsInclude = {
	profile: true,
	socialMedia: true,
	experiences: {
		orderBy: {
			startDate: "desc",
		},
	},
} as const;

export class UserRepository {
	constructor(private readonly prisma: PrismaClient) {}

	findUserDetailsById(userId: string): Promise<UserDetailsRecord | null> {
		return this.prisma.user.findUnique({
			where: { id: userId },
			include: userDetailsInclude,
		});
	}

	async searchUsers(filters: SearchUsersFilters) {
		const where = this.buildSearchWhere(filters);

		const [users, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				include: userDetailsInclude,
				orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
				take: filters.limit,
				skip: filters.offset,
			}),
			this.prisma.user.count({ where }),
		]);

		return { users, total };
	}

	private buildSearchWhere(filters: SearchUsersFilters): Prisma.UserWhereInput {
		const and: Prisma.UserWhereInput[] = [];

		if (filters.q) {
			and.push({
				OR: [
					{ firstName: { contains: filters.q } },
					{ lastName: { contains: filters.q } },
					{ email: { contains: filters.q } },
					{ profile: { is: { currentCompany: { contains: filters.q } } } },
					{ profile: { is: { currentRole: { contains: filters.q } } } },
				],
			});
		}

		if (filters.role) and.push({ role: filters.role });
		if (filters.emailVerified !== undefined) {
			and.push({ emailVerified: filters.emailVerified });
		}
		if (filters.profileCompleted !== undefined) {
			and.push({ profileCompleted: filters.profileCompleted });
		}
		if (filters.campus) and.push({ profile: { is: { campus: filters.campus } } });
		if (filters.branch) and.push({ profile: { is: { branch: filters.branch } } });
		if (filters.batch) and.push({ profile: { is: { batch: filters.batch } } });
		if (filters.city) {
			and.push({ profile: { is: { city: { contains: filters.city } } } });
		}
		if (filters.country) {
			and.push({ profile: { is: { country: { contains: filters.country } } } });
		}
		if (filters.company) {
			and.push({
				OR: [
					{
						profile: {
							is: { currentCompany: { contains: filters.company } },
						},
					},
					{
						experiences: {
							some: { company: { contains: filters.company } },
						},
					},
				],
			});
		}

		return and.length ? { AND: and } : {};
	}
}
