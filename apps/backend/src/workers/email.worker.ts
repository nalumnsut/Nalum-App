import { Worker } from "bullmq";
import pino from "pino";
import { loggerOptions } from "../config/logger.config";
import { EMAIL_QUEUE_NAME, getRedisConnection } from "../queues/email.queue";
import { emailProcessor, mailSender } from "./email.processor";

const logger = pino(
	typeof loggerOptions === "object" && loggerOptions
		? (loggerOptions as any)
		: undefined,
);

logger.info("Starting Email Worker...");

const worker = new Worker(EMAIL_QUEUE_NAME, emailProcessor, {
	connection: getRedisConnection() as any,
	concurrency: 5,
});

worker.on("completed", (job) => {
	logger.info(
		{ jobId: job.id, template: job.name },
		"Email job completed successfully",
	);
});

worker.on("failed", (job, err) => {
	logger.error(
		{ jobId: job?.id, template: job?.name, error: err.message },
		"Email job failed",
	);
});

async function shutdown() {
	logger.info("Gracefully shutting down email worker...");

	try {
		// Close the worker
		await worker.close();
		logger.info("BullMQ Worker closed");

		// Close SMTP connection
		mailSender.close();
		logger.info("SMTP transporter closed");

		// Close Redis connection
		const connection = getRedisConnection();
		await connection.quit();
		logger.info("Redis connection closed");

		process.exit(0);
	} catch (error) {
		logger.error(error, "Error during graceful shutdown");
		process.exit(1);
	}
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
