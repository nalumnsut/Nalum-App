import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { protect } from "../../middlewares/auth.middleware";
import { UnsupportedStorageObjectKeyError } from "./storage.errors";
import { isAllowedStorageObjectKey, toStorageObjectUrl } from "./storage.keys";

type StorageObjectParams = {
	"*": string;
};

const storageRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{ Params: StorageObjectParams }>(
		"/objects/*",
		{
			preHandler: protect,
			schema: {
				summary: "Read protected storage object",
				description:
					"Streams an authenticated object from private S3-compatible storage.",
				tags: ["Storage"],
				security: [{ bearerAuth: [] }],
			},
		},
		streamStorageObject,
	);

	async function streamStorageObject(
		request: FastifyRequest<{ Params: StorageObjectParams }>,
		reply: FastifyReply,
	) {
		const key = request.params["*"];
		if (!isAllowedStorageObjectKey(key)) {
			throw new UnsupportedStorageObjectKeyError();
		}

		const object = await request.server.storage.getObjectStream(key);

		if (object.contentType) {
			reply.header("content-type", object.contentType);
		}
		reply.header("cache-control", "private, max-age=300");

		return reply.send(object.body);
	}
};

export { toStorageObjectUrl };
export default storageRoutes;
