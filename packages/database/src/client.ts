import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../apps/backend/src/database/prisma/generated/client";

export { PrismaClient } from "../../../apps/backend/src/database/prisma/generated/client";
export type { User } from "../../../apps/backend/src/database/prisma/generated/client";

export const createPrismaClient = (connectionString: string) =>
	new PrismaClient({
		adapter: new PrismaPg({ connectionString }),
		errorFormat: "pretty",
	});
