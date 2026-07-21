export interface OtpEmailInput {
	firstName: string;
	otp: string;
}

export interface RenderedEmail {
	subject: string;
	text: string;
	html: string;
}

export function renderOtpEmail(input: OtpEmailInput): RenderedEmail {
	return {
		subject: "Verify your Nalum email",
		text: `Hi ${input.firstName}, your Nalum email verification OTP is ${input.otp}. It expires in 10 minutes.`,
		html: `
			<p>Hi ${input.firstName},</p>
			<p>Your Nalum email verification OTP is <strong>${input.otp}</strong>.</p>
			<p>This code expires in 10 minutes.</p>
		`.trim(),
	};
}
