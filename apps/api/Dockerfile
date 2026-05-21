# ─── Stage 1: install all deps + generate Prisma client ─────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate

# ─── Stage 2: compile TypeScript ─────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
# package.json must be present so tsc resolves "type":"module" correctly
# and emits ESM output (with "module":"node16" in tsconfig).
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npx tsc

# ─── Stage 3: production runtime ─────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

# Install production deps only + regenerate Prisma client
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 3002

# Apply pending migrations then start the server.
# Uses prisma migrate deploy (not dev) — safe for containers.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
