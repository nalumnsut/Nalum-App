/**
 * admin Service
 *
 * Responsibilities:
 * - Business logic.
 * - Authorization.
 * - Coordinate repositories.
 *
 * Do NOT:
 * - Access req/res.
 * - Return HTTP responses.
 * - Query the database directly.
 */
import type { AdminRepository } from "./admin.repository";

export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}
}
