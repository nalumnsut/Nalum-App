import { enqueueEmail } from "../../queues/email.queue";

export interface IEmailService {
	sendEmailVerificationOtp(input: {
		to: string;
		firstName: string;
		otp: string;
	}): Promise<void>;
}

export class EmailService implements IEmailService {
	async sendEmailVerificationOtp(input: {
		to: string;
		firstName: string;
		otp: string;
	}) {
		await enqueueEmail("email-verification-otp", input);
	}
}
