# -----------------------------------------------------------------------------
# Dependencies
# -----------------------------------------------------------------------------
FROM node:22-alpine3.21 AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Use Liara mirror for fast npm downloads inside Iran (optional / fallback safe)
RUN npm config set registry https://package-mirror.liara.ir/repository/npm/

COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------------------------------------------------------
# Builder
# -----------------------------------------------------------------------------
FROM node:22-alpine3.21 AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

ARG NEXT_PUBLIC_SITE_URL=https://karapardazavand.ir
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -----------------------------------------------------------------------------
# Runner
# -----------------------------------------------------------------------------
FROM node:22-alpine3.21 AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache wget \
    && addgroup -S karapardaz \
    && adduser -S karapardaz -G karapardaz

COPY --from=builder /app/public ./public
COPY --from=builder --chown=karapardaz:karapardaz /app/.next/standalone ./
COPY --from=builder --chown=karapardaz:karapardaz /app/.next/static ./.next/static

USER karapardaz

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/fa" || exit 1

CMD ["node", "server.js"]

