FROM node:22-alpine AS deps
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /usr/src/app
COPY . .
RUN pnpm -r run build

FROM node:22-alpine AS core-prod
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/client/package.json ./client/
COPY --from=builder /usr/src/app/server/package.json ./server/
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/server/dist ./server/dist

CMD ["node", "server/dist/src/main.js"]

FROM nginx:alpine AS client-prod
COPY --from=builder /usr/src/app/client/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]