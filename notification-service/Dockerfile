FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add supervisor

COPY package*.json ./
RUN npm install

COPY . .

CMD ["supervisord", "-c", "/app/supervisord.conf"]
