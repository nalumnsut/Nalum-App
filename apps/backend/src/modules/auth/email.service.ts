import nodemailer from "nodemailer";
import { env } from "../../config/env.config";

export interface IEmailService {
	sendEmailVerificationOtp(input: {
		to: string;
		firstName: string;
		otp: string;
	}): Promise<void>;
}

export class EmailService implements IEmailService {
	/**
	 * Build the transporter only when it is first needed so that the service
	 * can be instantiated in development even without SMTP credentials.
	 */
	private get transporter() {
		return nodemailer.createTransport({
			host: env.BREVO_SMTP_HOST,
			port: env.BREVO_SMTP_PORT,
			secure: false,
			auth: {
				user: env.BREVO_SMTP_USER,
				pass: env.BREVO_SMTP_PASS,
			},
		});
	}

	async sendEmailVerificationOtp(input: {
		to: string;
		firstName: string;
		otp: string;
	}) {
		// In development, print the OTP directly to the terminal and skip SMTP.
		if (env.NODE_ENV !== "production") {
			console.log(
				[
					"",
					"┌─────────────────────────────────────────────┐",
					"│        📧  DEV — Email Verification OTP        │",
					"├─────────────────────────────────────────────┤",
					`│  To       : ${input.to.padEnd(32)}│`,
					`│  Name     : ${input.firstName.padEnd(32)}│`,
					`│  OTP      : ${input.otp.padEnd(32)}│`,
					"│  Expires  : 10 minutes                      │",
					"└─────────────────────────────────────────────┘",
					"",
				].join("\n"),
			);
			return;
		}

		// Production path — requires SMTP credentials.
		if (
			!env.BREVO_SMTP_HOST ||
			!env.BREVO_SMTP_PORT ||
			!env.BREVO_SMTP_USER ||
			!env.BREVO_SMTP_PASS
		) {
			throw new Error(
				"SMTP credentials are not configured. Set BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, and BREVO_SMTP_PASS.",
			);
		}

		await this.transporter.sendMail({
			from: {
				address: env.BREVO_FROM_EMAIL ?? env.BREVO_SMTP_USER,
				name: env.BREVO_FROM_NAME,
			},
			to: input.to,
			subject: "Verify your Nalum email",
			text: `Hi ${input.firstName}, your Nalum email verification OTP is ${input.otp}. It expires in 10 minutes.`,
			html: `
				<p>Hi ${input.firstName},</p>
				<p>Your Nalum email verification OTP is <strong>${input.otp}</strong>.</p>
				<p>This code expires in 10 minutes.</p>
			`,
		});
	}
}
