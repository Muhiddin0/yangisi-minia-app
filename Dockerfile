# syntax=docker/dockerfile:1

# ---- dependencies -------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
# Be resilient to slow/unstable networks during dependency install.
ENV npm_config_fetch_retries=5 \
    npm_config_fetch_retry_mintimeout=15000 \
    npm_config_fetch_retry_maxtimeout=120000
COPY package.json package-lock.json ./
RUN npm ci

# ---- build --------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Browser → PocketBase base URL. Empty = same origin, so all `/api/*` calls go
# through the Next proxy below (no CORS). Inlined into the client bundle here.
ARG NEXT_PUBLIC_POCKETBASE_URL=""
ENV NEXT_PUBLIC_POCKETBASE_URL=$NEXT_PUBLIC_POCKETBASE_URL

# Proxy target for `/api/*`. Baked into the rewrite at build time, so it must be
# set here (defaults to the compose service name).
ARG POCKETBASE_ORIGIN="http://backend:8090"
ENV POCKETBASE_ORIGIN=$POCKETBASE_ORIGIN

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime ------------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone server bundles its own minimal node_modules + server.js.
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
