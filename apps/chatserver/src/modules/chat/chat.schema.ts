import { z } from "zod/v4";

export const directConversationSchema = z.object({ recipientUserId: z.uuid() });
export const groupConversationSchema = z.object({
	name: z.string().trim().min(1).max(120),
	memberIds: z.array(z.uuid()).min(1).max(250),
});
export const messageSendSchema = z.object({
	conversationId: z.uuid(),
	clientMessageId: z.uuid(),
	text: z.string().trim().min(1).max(4000),
});
export const typingStartSchema = z.object({ conversationId: z.uuid() });
export const cursorQuerySchema = z.object({
	cursor: z.string().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(100).default(50),
});
export const addMemberSchema = z.object({ userId: z.uuid() });
export const memberParamsSchema = z.object({
	conversationId: z.uuid(),
	userId: z.uuid(),
});
export const roleSchema = z.object({ role: z.enum(["ADMIN", "MEMBER"]) });
export const conversationParamsSchema = z.object({ conversationId: z.uuid() });

export type MessageSendInput = z.infer<typeof messageSendSchema>;
