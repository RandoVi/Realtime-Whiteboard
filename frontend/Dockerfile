FROM node:22

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY common/package*.json ./common/

RUN npm install

COPY frontend ./frontend
COPY common ./common

WORKDIR /app/frontend

EXPOSE 5173

CMD ["npm", "run", "dev"]
