FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY backend/package*.json ./backend/

RUN npm install

COPY common ./common
COPY backend ./backend

EXPOSE 3000