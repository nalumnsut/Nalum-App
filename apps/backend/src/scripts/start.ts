import { spawn } from "node:child_process";

const schemaPath = "src/database/prisma/schema.prisma";
const migrationArg = process.argv.find((argument) =>
	argument.startsWith("--migrate="),
);
const migrationMode = (
	migrationArg?.slice("--migrate=".length) ??
	process.env.PRISMA_MIGRATION_MODE ??
	"deploy"
).trim();

const run = (command: string, args: string[]) => {
	return new Promise<void>((resolve, reject) => {
		const childProcess = spawn(command, args, { stdio: "inherit" });

		childProcess.once("error", reject);
		childProcess.once("exit", (exitCode, signal) => {
			if (exitCode === 0) {
				resolve();
				return;
			}

			reject(
				new Error(
					`${command} ${args.join(" ")} exited with ${exitCode ?? signal ?? "unknown"}`,
				),
			);
		});
	});
};

const main = async () => {
	if (migrationMode === "deploy") {
		await run("bunx", ["prisma", "migrate", "deploy", "--schema", schemaPath]);
	} else if (migrationMode === "reset") {
		await run("bunx", [
			"prisma",
			"migrate",
			"reset",
			"--force",
			"--schema",
			schemaPath,
		]);
	} else if (migrationMode !== "skip") {
		throw new Error(
			`Unsupported migration mode ${migrationMode}. Use deploy, skip, or reset.`,
		);
	}

	const serverProcess = spawn("bun", ["src/server.ts"], { stdio: "inherit" });

	const forwardSignal = (signal: NodeJS.Signals) => {
		serverProcess.kill(signal);
	};

	process.once("SIGINT", () => forwardSignal("SIGINT"));
	process.once("SIGTERM", () => forwardSignal("SIGTERM"));

	await new Promise<void>((resolve, reject) => {
		serverProcess.once("error", reject);
		serverProcess.once("exit", (exitCode, signal) => {
			if (exitCode === 0) {
				resolve();
				return;
			}

			reject(
				new Error(
					`bun src/server.ts exited with ${exitCode ?? signal ?? "unknown"}`,
				),
			);
		});
	});
};

void main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
