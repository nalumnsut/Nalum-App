/**
 * admin Controller
 *
 * Responsibilities:
 * - Parse incoming requests.
 * - Delegate work to the service layer.
 * - Return HTTP responses.
 *
 * Do NOT:
 * - Contain business logic.
 * - Access the database.
 * - Perform validation.
 */
import type { AdminService } from "./admin.service";

export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
