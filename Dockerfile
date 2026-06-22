FROM node:24-slim AS prepare
WORKDIR /app

COPY packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /prepared/

RUN find packages -maxdepth 2 -mindepth 2 -name package.json -exec dirname /prepared/'{}' ';' | xargs mkdir -p && \
    find packages -maxdepth 2 -mindepth 2 -name package.json -exec cp '{}' /prepared/'{}' ';'

FROM node:24-slim AS build
WORKDIR /build

COPY --from=prepare /prepared ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build && pnpm --filter @rctf/server --prod deploy --legacy /app

FROM node:24-slim AS run
WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
ENV NODE_ENV=production

ENV RCTF_CONF_PATH=/app/rctf.d
VOLUME /app/rctf.d
ENV PORT=80
EXPOSE 80
CMD ["node", "--enable-source-maps", "--unhandled-rejections=strict", "/app/node_modules/.bin/rctf"]
