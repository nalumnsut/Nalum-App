import type { ConversationParticipantRole } from "../../../../../apps/backend/src/database/prisma/generated/enums";
import { ChatError } from "./chat.errors";
import { ChatRepository } from "./chat.repository";
import type { MessageSendInput } from "./chat.schema";

type Cursor = { createdAt?: Date; lastMessageAt?: Date; id: string };

export class ChatService {
	constructor(private readonly repository: ChatRepository) {}

	async createDirectConversation(userId: string, recipientUserId: string) {
		if (userId === recipientUserId) {
			throw new ChatError("You cannot create a conversation with yourself", 400, "CHAT_SELF_DIRECT");
		}
		const recipient = await this.repository.findUserById(recipientUserId);
		if (!recipient) throw new ChatError("Recipient not found", 404, "CHAT_RECIPIENT_NOT_FOUND");
		const userIds = [userId, recipientUserId].sort() as [string, string];
		const directPairKey = userIds.join(":");
		const existing = await this.repository.findDirectConversation(directPairKey);
		if (existing) return existing;
		try {
			return await this.repository.createDirectConversation(directPairKey, userIds);
		} catch (error) {
			const racedConversation = await this.repository.findDirectConversation(directPairKey);
			if (racedConversation) return racedConversation;
			throw error;
		}
	}

	async sendMessage(userId: string, input: MessageSendInput) {
		await this.requireActiveParticipant(input.conversationId, userId);
		return this.repository.createMessage({ ...input, senderId: userId });
	}

	async getMessages(userId: string, conversationId: string, cursorValue: string | undefined, limit: number) {
		await this.requireActiveParticipant(conversationId, userId);
		const cursor = this.decodeCursor(cursorValue, "message") as (Cursor & { createdAt: Date }) | null;
		const rows = await this.repository.findMessages(conversationId, cursor, limit);
		const hasMore = rows.length > limit;
		const messages = hasMore ? rows.slice(0, limit) : rows;
		const lastMessage = messages.at(-1);
		return {
			messages,
			nextCursor: hasMore && lastMessage ? this.encodeCursor({ createdAt: lastMessage.createdAt, id: lastMessage.id }) : null,
		};
	}

	async getConversations(userId: string, cursorValue: string | undefined, limit: number) {
		const cursor = this.decodeCursor(cursorValue, "conversation") as (Cursor & { lastMessageAt: Date }) | null;
		const rows = await this.repository.findConversations(userId, cursor, limit);
		const hasMore = rows.length > limit;
		const conversations = hasMore ? rows.slice(0, limit) : rows;
		const lastConversation = conversations.at(-1);
		return {
			conversations,
			nextCursor:
				hasMore && lastConversation
					? this.encodeCursor({ lastMessageAt: lastConversation.lastMessageAt, id: lastConversation.id })
					: null,
		};
	}

	async createGroup(userId: string, name: string, initialMemberIds: string[]) {
		const memberIds = [...new Set([userId, ...initialMemberIds])];
		const users = await this.repository.findUsersByIds(memberIds);
		if (users.length !== memberIds.length) throw new ChatError("One or more members do not exist", 404, "CHAT_MEMBER_NOT_FOUND");
		return this.repository.createGroup(name, userId, memberIds);
	}

	async addMember(actorId: string, conversationId: string, userId: string) {
		await this.requireGroupAuthority(conversationId, actorId, ["OWNER", "ADMIN"]);
		if (!(await this.repository.findUserById(userId))) throw new ChatError("Member not found", 404, "CHAT_MEMBER_NOT_FOUND");
		return this.repository.upsertMember(conversationId, userId);
	}

	async removeMember(actorId: string, conversationId: string, userId: string) {
		await this.requireGroupAuthority(conversationId, actorId, ["OWNER", "ADMIN"]);
		const member = await this.repository.findParticipant(conversationId, userId);
		if (!member || member.leftAt) throw new ChatError("Member is not active", 404, "CHAT_MEMBER_NOT_ACTIVE");
		if (member.role === "OWNER") throw new ChatError("Transfer ownership before removing the owner", 409, "CHAT_OWNER_REMOVAL");
		return this.repository.removeMember(conversationId, userId);
	}

	async updateMemberRole(actorId: string, conversationId: string, userId: string, role: "ADMIN" | "MEMBER") {
		await this.requireGroupAuthority(conversationId, actorId, ["OWNER"]);
		const member = await this.repository.findParticipant(conversationId, userId);
		if (!member || member.leftAt) throw new ChatError("Member is not active", 404, "CHAT_MEMBER_NOT_ACTIVE");
		if (member.role === "OWNER") throw new ChatError("Owner role cannot be changed", 409, "CHAT_OWNER_ROLE");
		return this.repository.updateMemberRole(conversationId, userId, role);
	}

	async getParticipantUserIds(conversationId: string) {
		return (await this.repository.findActiveParticipantUserIds(conversationId)).map(({ userId }) => userId);
	}

	async getPresenceAudienceUserIds(userId: string) {
		return (await this.repository.findPresenceAudienceUserIds(userId))
			.map(({ userId: audienceUserId }) => audienceUserId)
			.filter((audienceUserId) => audienceUserId !== userId);
	}

	updateLastSeenAt(userId: string, lastSeenAt: Date) {
		return this.repository.updateLastSeenAt(userId, lastSeenAt);
	}

	async requireActiveParticipant(conversationId: string, userId: string) {
		const participant = await this.repository.findParticipant(conversationId, userId);
		if (!participant?.conversation || participant.leftAt) {
			throw new ChatError("You are not a participant in this conversation", 403, "CHAT_NOT_PARTICIPANT");
		}
		return participant;
	}

	private async requireGroupAuthority(
		conversationId: string,
		userId: string,
		allowedRoles: ConversationParticipantRole[],
	) {
		const participant = await this.requireActiveParticipant(conversationId, userId);
		if (participant.conversation.type !== "GROUP") {
			throw new ChatError("This action requires a group conversation", 409, "CHAT_NOT_GROUP");
		}
		if (!allowedRoles.includes(participant.role)) {
			throw new ChatError("You do not have permission for this group action", 403, "CHAT_GROUP_FORBIDDEN");
		}
		return participant;
	}

	private encodeCursor(cursor: Record<string, Date | string>) {
		return Buffer.from(
			JSON.stringify(Object.fromEntries(Object.entries(cursor).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]))),
		).toString("base64url");
	}

	private decodeCursor(value: string | undefined, kind: "message" | "conversation") {
		if (!value) return null;
		try {
			const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Record<string, string>;
			const timestampKey = kind === "message" ? "createdAt" : "lastMessageAt";
			const timestamp = new Date(parsed[timestampKey] ?? "");
			if (!parsed.id || Number.isNaN(timestamp.getTime())) throw new Error("invalid cursor");
			return { id: parsed.id, [timestampKey]: timestamp };
		} catch {
			throw new ChatError("Invalid cursor", 400, "CHAT_INVALID_CURSOR");
		}
	}
}
