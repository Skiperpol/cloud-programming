FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY nest-cli.json tsconfig*.json ./
COPY apps/gateway-service ./apps/gateway-service
COPY libs ./libs

RUN npx nest build gateway-service

FROM node:20-alpine AS production-deps

WORKDIR /app
ENV NODE_ENV=development

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/gateway-service ./dist
COPY --from=builder /app/apps/gateway-service ./apps/gateway-service
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/nest-cli.json /app/tsconfig.json ./

EXPOSE 3000

CMD ["npx", "nest", "start", "gateway-service", "--watch"]
