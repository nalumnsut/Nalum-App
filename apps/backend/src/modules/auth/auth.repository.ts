/**
 * auth Repository
 *
 * Responsibilities:
 * - Database access.
 * - Transactions.
 * - Data persistence.
 *
 * Do NOT:
 * - Implement business logic.
 */
import type { PrismaClient } from "../../database/prisma/generated/client";
import type {
	CreateRefreshTokenInput,
	CreateUserInput,
	UserWithPassword,
} from "./auth.types";

export default class AuthRepository {
	constructor(private readonly prisma: PrismaClient) {}

	findUserByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	findUserByGoogleId(googleId: string) {
		return this.prisma
			.$queryRaw<UserWithPassword[]>`SELECT * FROM "User" WHERE "googleId" = ${googleId} LIMIT 1`
			.then((users) => users[0] ?? null);
	}

	findUserById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	createUser(input: CreateUserInput) {
		return this.prisma.user.create({
			data: input,
		});
	}

	updateUserGoogleId(userId: string, googleId: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				googleId,
			},
		});
	}

	createRefreshToken(input: CreateRefreshTokenInput) {
		return this.prisma.refreshToken.create({
			data: input,
		});
	}

	findRefreshTokenByHash(tokenHash: string) {
		return this.prisma.refreshToken.findUnique({
			where: { tokenHash },
			include: {
				user: true,
			},
		});
	}

	rotateRefreshToken(
		currentTokenId: string,
		nextToken: CreateRefreshTokenInput,
	) {
		return this.prisma.$transaction(async (tx) => {
			await tx.refreshToken.update({
				where: { id: currentTokenId },
				data: { revokedAt: new Date() },
			});

			return tx.refreshToken.create({
				data: nextToken,
			});
		});
	}

	async revokeRefreshTokenByHash(tokenHash: string) {
		const token = await this.prisma.refreshToken.findUnique({
			where: { tokenHash },
		});

		if (!token || token.revokedAt) {
			return null;
		}

		return this.prisma.refreshToken.update({
			where: { id: token.id },
			data: { revokedAt: new Date() },
		});
	}
}
