import type {
	Branch,
	Campus,
	Experience,
	Profile,
	SocialMedia,
	User,
	UserRole,
} from "../../database/prisma/generated/client";

export type UserDetailsRecord = User & {
	profile: Profile | null;
	socialMedia: SocialMedia | null;
	experiences: Experience[];
};

export type PublicUserDetails = Omit<
	User,
	"passwordHash" | "googleId"
> & {
	profile: Profile | null;
	socialMedia: SocialMedia | null;
	experiences: Experience[];
};

export type SearchUsersFilters = {
	q?: string;
	role?: UserRole;
	campus?: Campus;
	branch?: Branch;
	batch?: number;
	company?: string;
	city?: string;
	country?: string;
	emailVerified?: boolean;
	profileCompleted?: boolean;
	limit: number;
	offset: number;
};
