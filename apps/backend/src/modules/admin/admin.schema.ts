/**
 * admin Schemas
 *
 * Define request and response schemas using Zod.
 */

import { z } from "zod/v4";

export const adminResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.unknown().nullable(),
});

export type AdminResponse = z.infer<typeof adminResponseSchema>;
