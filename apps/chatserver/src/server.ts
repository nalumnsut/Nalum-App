import { buildApp } from "./app";
import { env } from "./config/env.config";

const bootstrap = async () => {
	const app = await buildApp();
	try {
		await app.listen({ host: "0.0.0.0", port: env.CHAT_PORT });
	} catch (error) {
		app.log.fatal(error);
		process.exit(1);
	}

	const close = async () => {
		await app.close();
		process.exit(0);
	};
	process.once("SIGINT", close);
	process.once("SIGTERM", close);
};

bootstrap();
