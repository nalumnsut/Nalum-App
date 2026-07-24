import type { Job } from "bullmq";
import nodemailer from "nodemailer";
import { env } from "../config/env.config";
import type { EmailJobPayload } from "../queues/email.queue";
import { renderOtpEmail } from "../templates/otp.template";

export class MailSender {
	private _transporter: nodemailer.Transporter | null = null;

	private get transporter() {
		if (!this._transporter) {
			this._transporter = nodemailer.createTransport({
				host: env.BREVO_SMTP_HOST,
				port: env.BREVO_SMTP_PORT,
				secure: false,
				auth: {
					user: env.BREVO_SMTP_USER,
					pass: env.BREVO_SMTP_PASS,
				},
			});
		}
		return this._transporter;
	}

	async sendMail(input: {
		to: string;
		subject: string;
		text: string;
		html: string;
	}) {
		if (env.NODE_ENV === "development") {
			const otpMatch = input.text.match(/\b\d{6}\b/);
			const otp = otpMatch ? otpMatch[0] : "";
			console.log(
				[
					"",
					"┌─────────────────────────────────────────────┐",
					"│        📧  DEV — Email Verification OTP        │",
					"├─────────────────────────────────────────────┤",
					`│  To       : ${input.to.padEnd(32)}│`,
					`│  OTP      : ${otp.padEnd(32)}│`,
					"│  Expires  : 10 minutes                      │",
					"└─────────────────────────────────────────────┘",
					"",
				].join("\n"),
			);
			return;
		}

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
			subject: input.subject,
			text: input.text,
			html: input.html,
		});
	}

	close() {
		if (this._transporter) {
			this._transporter.close();
			this._transporter = null;
		}
	}
}

export const mailSender = new MailSender();

export async function emailProcessor(
	job: Job<EmailJobPayload["payload"], void, string>,
) {
	const { to, firstName, otp } = job.data;

	if (job.name !== "email-verification-otp") {
		throw new Error(`Unsupported email template: ${job.name}`);
	}

	const rendered = renderOtpEmail({ firstName, otp });

	await mailSender.sendMail({
		to,
		subject: rendered.subject,
		text: rendered.text,
		html: rendered.html,
	});
}
