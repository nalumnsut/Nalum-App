/**
 * admin Routes
 *
 * Responsibilities:
 * - Register endpoints.
 * - Attach middleware.
 * - Attach schemas.
 */

import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new AdminRepository(fastify.prisma);
  const service = new AdminService(repository);
  const controller = new AdminController(service);
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  void app;
  void controller;
};

export default adminRoutes;
