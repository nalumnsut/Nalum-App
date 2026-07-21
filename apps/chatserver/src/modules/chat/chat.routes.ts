import type { FastifyInstance, FastifyRequest } from "fastify";
import { ChatService } from "./chat.service";
import {
	addMemberSchema,
	conversationParamsSchema,
	cursorQuerySchema,
	directConversationSchema,
	groupConversationSchema,
	memberParamsSchema,
	roleSchema,
} from "./chat.schema";

type Authenticate = (request: FastifyRequest) => Promise<void>;

export const registerChatRoutes = async (app: FastifyInstance, service: ChatService, authenticate: Authenticate) => {
	app.post("/api/conversations/direct", { preValidation: authenticate }, async (request) => {
		const input = directConversationSchema.parse(request.body);
		return service.createDirectConversation(request.chatUserId!, input.recipientUserId);
	});

	app.get("/api/conversations", { preValidation: authenticate }, async (request) => {
		const query = cursorQuerySchema.parse(request.query);
		return service.getConversations(request.chatUserId!, query.cursor, query.limit);
	});

	app.get("/api/conversations/:conversationId/messages", { preValidation: authenticate }, async (request) => {
		const { conversationId } = conversationParamsSchema.parse(request.params);
		const query = cursorQuerySchema.parse(request.query);
		return service.getMessages(request.chatUserId!, conversationId, query.cursor, query.limit);
	});

	app.post("/api/conversations/groups", { preValidation: authenticate }, async (request) => {
		const input = groupConversationSchema.parse(request.body);
		return service.createGroup(request.chatUserId!, input.name, input.memberIds);
	});

	app.post("/api/conversations/:conversationId/members", { preValidation: authenticate }, async (request) => {
		const { conversationId } = conversationParamsSchema.parse(request.params);
		const { userId } = addMemberSchema.parse(request.body);
		return service.addMember(request.chatUserId!, conversationId, userId);
	});

	app.delete("/api/conversations/:conversationId/members/:userId", { preValidation: authenticate }, async (request) => {
		const { conversationId, userId } = memberParamsSchema.parse(request.params);
		await service.removeMember(request.chatUserId!, conversationId, userId);
		return { success: true };
	});

	app.patch("/api/conversations/:conversationId/members/:userId/role", { preValidation: authenticate }, async (request) => {
		const { conversationId, userId } = memberParamsSchema.parse(request.params);
		const { role } = roleSchema.parse(request.body);
		return service.updateMemberRole(request.chatUserId!, conversationId, userId, role);
	});
};
