import { hash } from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	EmailAlreadyExistsError,
	InvalidCredentialsError,
	InvalidRefreshTokenError,
} from "./auth.errors";
import { type AuthRepositoryContract, AuthService } from "./auth.service";
import type { UserWithPassword } from "./auth.types";

const now = new Date();

const user: UserWithPassword = {
	id: "018f6b4f-4580-7000-8000-000000000001",
	firstName: "Test",
	lastName: "User",
	email: "test@example.com",
	passwordHash: "",
	googleId: null,
	role: "STUDENT",
	emailVerified: false,
	profileCompleted: false,
	createdAt: now,
	updatedAt: now,
};

type MockAuthRepository = AuthRepositoryContract & {
	[Key in keyof AuthRepositoryContract]: ReturnType<typeof vi.fn>;
};

const createRepository = (): MockAuthRepository =>
	({
		findUserByEmail: vi.fn(),
		findUserByGoogleId: vi.fn(),
		createUser: vi.fn(),
		updateUserGoogleId: vi.fn(),
		createRefreshToken: vi.fn(),
		findRefreshTokenByHash: vi.fn(),
		rotateRefreshToken: vi.fn(),
		revokeRefreshTokenByHash: vi.fn(),
	}) as MockAuthRepository;

describe("AuthService", () => {
	let repository: ReturnType<typeof createRepository>;
	let service: AuthService;

	beforeEach(() => {
		repository = createRepository();
		service = new AuthService(repository);
	});

	it("rejects duplicate registration emails", async () => {
		repository.findUserByEmail.mockResolvedValue(user);

		await expect(
			service.register({
				firstName: "Test",
				lastName: "User",
				email: user.email,
				password: "password123",
				role: "STUDENT",
			}),
		).rejects.toBeInstanceOf(EmailAlreadyExistsError);
	});

	it("rejects invalid login credentials", async () => {
		repository.findUserByEmail.mockResolvedValue({
			...user,
			passwordHash: await hash("correct-password", 12),
		});

		await expect(
			service.login({
				email: user.email,
				password: "wrong-password",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("rotates a valid refresh token", async () => {
		const expiresAt = new Date(Date.now() + 60_000);

		repository.findRefreshTokenByHash.mockResolvedValue({
			id: "018f6b4f-4580-7000-8000-000000000002",
			userId: user.id,
			tokenHash: "stored-token-hash",
			expiresAt,
			revokedAt: null,
			user,
		});

		const session = await service.refresh("raw-refresh-token");

		expect(repository.rotateRefreshToken).toHaveBeenCalledOnce();
		expect(session.refreshToken).not.toBe("raw-refresh-token");
		expect(session.accessTokenPayload.sub).toBe(user.id);
	});

	it("rejects revoked refresh tokens", async () => {
		repository.findRefreshTokenByHash.mockResolvedValue({
			id: "018f6b4f-4580-7000-8000-000000000003",
			userId: user.id,
			tokenHash: "stored-token-hash",
			expiresAt: new Date(Date.now() + 60_000),
			revokedAt: new Date(),
			user,
		});

		await expect(service.refresh("raw-refresh-token")).rejects.toBeInstanceOf(
			InvalidRefreshTokenError,
		);
	});

	it("creates a session for a new google user", async () => {
		repository.findUserByGoogleId.mockResolvedValue(null);
		repository.findUserByEmail.mockResolvedValue(null);
		repository.createUser.mockResolvedValue({
			...user,
			email: "google@example.com",
			passwordHash: null,
			googleId: "google-subject",
		});

		const session = await service.loginWithGoogle({
			sub: "google-subject",
			email: "google@example.com",
			given_name: "Google",
			family_name: "User",
		});

		expect(repository.createUser).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "google@example.com",
				googleId: "google-subject",
				passwordHash: null,
				role: "STUDENT",
			}),
		);
		expect(session.user.email).toBe("google@example.com");
		expect(session.accessTokenPayload.sub).toBe(user.id);
	});

	it("revokes refresh token hashes on logout", async () => {
		await service.logout("raw-refresh-token");

		expect(repository.revokeRefreshTokenByHash).toHaveBeenCalledWith(
			expect.stringMatching(/^[a-f0-9]{64}$/),
		);
	});
});
