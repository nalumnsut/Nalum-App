import Redis from "ioredis";
import { ConnectionRegistry } from "./connection.registry";

const CHANNEL = "chat:fanout";

type FanoutEvent = {
	userId: string;
	message: unknown;
};

export class RedisFanout {
	private readonly publisher: Redis;
	private readonly subscriber: Redis;

	constructor(redisUrl: string, registry: ConnectionRegistry) {
		this.publisher = new Redis(redisUrl, { lazyConnect: true });
		this.subscriber = new Redis(redisUrl, { lazyConnect: true });
		this.subscriber.on("message", (channel, rawEvent) => {
			if (channel !== CHANNEL) return;
			try {
				const event = JSON.parse(rawEvent) as FanoutEvent;
				registry.deliver(event.userId, event.message);
			} catch {
				// Invalid Redis messages are discarded; they never originate from clients.
			}
		});
	}

	async connect() {
		await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
		await this.subscriber.subscribe(CHANNEL);
	}

	publish(event: FanoutEvent) {
		return this.publisher.publish(CHANNEL, JSON.stringify(event));
	}

	async close() {
		await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
	}
}
