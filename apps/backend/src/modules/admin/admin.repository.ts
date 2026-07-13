/**
 * admin Repository
 *
 * Responsibilities:
 * - Database access.
 * - Transactions.
 * - Data persistence.
 *
 * Do NOT:
 * - Implement business logic.
 */
import type { PrismaClient } from "../../database/prisma/generated/client";

export class AdminRepository {
  constructor(private readonly prisma: PrismaClient) {}
}
