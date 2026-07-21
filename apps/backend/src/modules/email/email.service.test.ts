import { beforeEach, describe, expect, it, vi } from "vitest";
import * as emailQueue from "../../queues/email.queue";
import { EmailService } from "./email.service";

vi.mock("../../queues/email.queue", () => ({
	enqueueEmail: vi.fn(),
}));

describe("EmailService", () => {
	let emailService: EmailService;

	beforeEach(() => {
		emailService = new EmailService();
		vi.clearAllMocks();
	});

	it("enqueues the expected OTP job payload", async () => {
		const payload = {
			to: "test@nsut.ac.in",
			firstName: "John",
			otp: "654321",
		};

		await emailService.sendEmailVerificationOtp(payload);

		expect(emailQueue.enqueueEmail).toHaveBeenCalledWith(
			"email-verification-otp",
			payload,
		);
	});
});
