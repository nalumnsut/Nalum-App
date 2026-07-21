import { describe, expect, it } from "vitest";
import { renderOtpEmail } from "./otp.template";

describe("renderOtpEmail", () => {
	it("renders the email structure with correct variables", () => {
		const result = renderOtpEmail({
			firstName: "Alice",
			otp: "123456",
		});

		// Check subject
		expect(result.subject).toBe("Verify your Nalum email");

		// Check recipient name is present
		expect(result.text).toContain("Alice");
		expect(result.html).toContain("Alice");

		// Check OTP is present
		expect(result.text).toContain("123456");
		expect(result.html).toContain("123456");

		// Check expiry copy is present
		expect(result.text).toContain("10 minutes");
		expect(result.html).toContain("10 minutes");
	});
});
