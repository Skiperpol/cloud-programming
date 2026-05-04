# syntax=docker/dockerfile:1
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:${NODE_VERSION}-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SERVICE_NAME=gateway-service
RUN npx nest build "${SERVICE_NAME}"

FROM node:${NODE_VERSION}-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
ARG SERVICE_NAME=gateway-service
ENV SERVICE_NAME=${SERVICE_NAME}
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "exec node dist/apps/${SERVICE_NAME}/main.js"]
