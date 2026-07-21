FROM oven/bun:1.3.11-slim

WORKDIR /app

COPY . .

RUN bun install
RUN bun apps/backend/node_modules/prisma/build/index.js generate --schema apps/backend/src/database/prisma/schema.prisma

WORKDIR /app/apps/chatserver

EXPOSE 3001

CMD ["bun", "src/server.ts"]
