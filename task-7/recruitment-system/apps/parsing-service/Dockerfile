FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3002

CMD ["npx", "nest", "start", "parsing-service", "--watch"]
