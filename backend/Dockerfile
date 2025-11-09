# ------------ STAGE 1: deps ------------
FROM node:20-bookworm AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev

# ------------ STAGE 2: build ------------
FROM node:20-bookworm AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# якщо у тебе Nest CLI, то:
RUN npm run build
# прибираємо dev-залежності, лишаємо тільки прод
RUN npm prune --omit=dev

# ------------ STAGE 3: runtime ------------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips ca-certificates tini curl \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    TZ=Europe/Kyiv

# копіюємо від root і одразу віддаємо власність appuser
COPY --from=build --chown=10001:10001 /app/node_modules ./node_modules
COPY --from=build --chown=10001:10001 /app/dist ./dist
COPY --from=build --chown=10001:10001 /app/package*.json ./
COPY --from=build --chown=10001:10001 /app/certs ./certs

RUN useradd -m -u 10001 appuser
USER appuser

ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["node", "dist/main.js"]
