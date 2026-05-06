FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY apps/parsing-service ./apps/parsing-service
COPY libs ./libs

RUN npx nest build parsing-service

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/parsing-service ./dist

EXPOSE 3002

CMD ["node", "dist/main.js"]
