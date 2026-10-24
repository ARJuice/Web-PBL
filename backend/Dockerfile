# ==============================================================================
# MATCH@SAHRDAYA - Backend Multi-Stage Dockerfile (NestJS + Prisma)
# ==============================================================================

# Stage 1: Build NestJS application and generate Prisma client
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY src ./src
RUN npm run build
RUN npm prune --omit=dev

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER nestjs

EXPOSE 4000

CMD ["node", "dist/main"]
