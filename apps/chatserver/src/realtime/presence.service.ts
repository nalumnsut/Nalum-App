import Redis from "ioredis";

const PRESENCE_TTL_MS = 75_000;
const SWEEP_INTERVAL_MS = 30_000;
const PRESENCE_USERS_KEY = "chat:presence:users";
const TYPING_KEYS_KEY = "chat:typing:keys";

export class PresenceService {
	private readonly redis: Redis;
	private sweepTimer: ReturnType<typeof setInterval> | null = null;

	constructor(redisUrl: string) {
		this.redis = new Redis(redisUrl, { lazyConnect: true });
	}

	async connect(onOffline: (userId: string, lastSeenAt: Date) => Promise<void>, onTypingExpired: (conversationId: string, userId: string) => Promise<void>) {
		await this.redis.connect();
		this.sweepTimer = setInterval(() => {
			void this.sweep(onOffline, onTypingExpired);
		}, SWEEP_INTERVAL_MS);
	}

	async heartbeat(userId: string, connectionId: string) {
		const key = this.presenceKey(userId);
		const now = Date.now();
		const expiresAt = now + PRESENCE_TTL_MS;
		const becameOnline = await this.redis.eval(
			"redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1]); local count = redis.call('ZCARD', KEYS[1]); redis.call('ZADD', KEYS[1], ARGV[2], ARGV[3]); redis.call('PEXPIRE', KEYS[1], ARGV[4]); redis.call('SADD', KEYS[2], ARGV[5]); return count == 0 and 1 or 0",
			2,
			key,
			PRESENCE_USERS_KEY,
			now,
			expiresAt,
			connectionId,
			PRESENCE_TTL_MS * 2,
			userId,
		);
		return becameOnline === 1;
	}

	async disconnect(userId: string, connectionId: string) {
		const key = this.presenceKey(userId);
		const remaining = await this.redis.eval(
			"redis.call('ZREM', KEYS[1], ARGV[1]); local count = redis.call('ZCARD', KEYS[1]); if count == 0 then redis.call('DEL', KEYS[1]); redis.call('SREM', KEYS[2], ARGV[2]); end; return count",
			2,
			key,
			PRESENCE_USERS_KEY,
			connectionId,
			userId,
		);
		return remaining === 0;
	}

	async startTyping(conversationId: string, userId: string) {
		const key = this.typingKey(conversationId, userId);
		await this.redis.multi().set(key, "1", "PX", 5_000).sadd(TYPING_KEYS_KEY, key).exec();
	}

	async close() {
		if (this.sweepTimer) clearInterval(this.sweepTimer);
		await this.redis.quit();
	}

	private async sweep(onOffline: (userId: string, lastSeenAt: Date) => Promise<void>, onTypingExpired: (conversationId: string, userId: string) => Promise<void>) {
		for (const userId of await this.redis.smembers(PRESENCE_USERS_KEY)) {
			const key = this.presenceKey(userId);
			const now = Date.now();
			const result = await this.redis.eval(
				"local expired = redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1]); local count = redis.call('ZCARD', KEYS[1]); if count == 0 then redis.call('DEL', KEYS[1]); redis.call('SREM', KEYS[2], ARGV[2]); end; return {expired, count}",
				2,
				key,
				PRESENCE_USERS_KEY,
				now,
				userId,
			) as [number, number];
			if (result[0] > 0 && result[1] === 0) await onOffline(userId, new Date(now));
		}

		for (const key of await this.redis.smembers(TYPING_KEYS_KEY)) {
			if ((await this.redis.exists(key)) === 1) continue;
			await this.redis.srem(TYPING_KEYS_KEY, key);
			const [, , conversationId, userId] = key.split(":");
			if (conversationId && userId) await onTypingExpired(conversationId, userId);
		}
	}

	private presenceKey(userId: string) {
		return `chat:presence:${userId}`;
	}

	private typingKey(conversationId: string, userId: string) {
		return `chat:typing:${conversationId}:${userId}`;
	}
}
