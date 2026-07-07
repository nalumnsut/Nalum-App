/**
 * prisma.plugin.ts
 *
 * Responsibilities:
 * Create Prisma client instance
 *  Register Prisma client as a Fastify plugin
 */

import { PrismaPg } from "@prisma/adapter-pg";
import fastifyPrisma from "@zrosenbauer/fastify-prisma";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { env } from "../config/env.config";
import { PrismaClient } from "../database/prisma/generated/client";

// Module augmentation to strictly type the prisma decorator on the Fastify instance
declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
	// Register the fastify-prisma plugin with your custom generated PrismaClient
	await fastify.register(fastifyPrisma, {
		client: new PrismaClient({
			adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
			errorFormat: "pretty",
		}),
	});
};

export default fp(prismaPlugin);
