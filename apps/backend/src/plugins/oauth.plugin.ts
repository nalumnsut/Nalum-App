import type { OAuth2Namespace } from "@fastify/oauth2";
import fastifyoauth2 from "@fastify/oauth2";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { env } from "../config/env.config";

declare module "fastify" {
    interface FastifyInstance {
        googleOAuth2: OAuth2Namespace;
    }
}

const oauthPlugin: FastifyPluginAsync = async (fastify) => {
    const prefix = fastify.prefix || "";
    const redirectPath = new URL(env.GOOGLE_REDIRECT_URL).pathname;
    const startRedirectPath = redirectPath.startsWith(prefix)
        ? redirectPath.slice(prefix.length)
        : redirectPath;

    await fastify.register(fastifyoauth2, {
        name: "googleOAuth2",
        scope: ["openid", "profile", "email"],
        credentials: {
            client: {
                id: env.GOOGLE_CLIENT_ID,
                secret: env.GOOGLE_CLIENT_SECRET,
            },
            auth: fastifyoauth2.GOOGLE_CONFIGURATION,
        },
        callbackUri: env.GOOGLE_CALLBACK_URL,
        callbackUriParams: {
            access_type: "offline",
            prompt: "consent",
        },
        pkce: "S256",
        startRedirectPath,
        cookie: {
            path: "/",
            secure: env.NODE_ENV === "production",
        },
    });
};

export default fp(oauthPlugin);