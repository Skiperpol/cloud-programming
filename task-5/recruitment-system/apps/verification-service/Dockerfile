FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY apps/verification-service ./apps/verification-service
COPY libs ./libs

RUN npx nest build verification-service

FROM node:20-alpine AS production-deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/verification-service ./dist

EXPOSE 3003

CMD ["node", "dist/main.js"]
