import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env.config";

let redisConnection: IORedis | null = null;

export function getRedisConnection(): IORedis {
	if (!redisConnection) {
		redisConnection = new IORedis(env.REDIS_URL, {
			maxRetriesPerRequest: env.EMAIL_MAX_RETRIES, // BullMQ requirement
		});
	}
	return redisConnection;
}

export type EmailJobPayload = {
	template: "email-verification-otp";
	payload: {
		to: string;
		firstName: string;
		otp: string;
	};
};

export const EMAIL_QUEUE_NAME = env.EMAIL_QUEUE_NAME;

let emailQueue: Queue | null = null;

export function getEmailQueue(): Queue {
	if (!emailQueue) {
		emailQueue = new Queue(EMAIL_QUEUE_NAME, {
			connection: getRedisConnection() as any,
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 5000,
				},
			},
		});
	}
	return emailQueue!;
}

export async function enqueueEmail<T extends EmailJobPayload["template"]>(
	template: T,
	payload: Extract<EmailJobPayload, { template: T }>["payload"],
): Promise<void> {
	const queue = getEmailQueue();
	await queue.add(template, payload);
}

export async function closeEmailQueue(): Promise<void> {
	if (emailQueue) {
		await emailQueue.close();
		emailQueue = null;
	}
	if (redisConnection) {
		await redisConnection.quit();
		redisConnection = null;
	}
}
