FROM node:22-alpine AS builder
#Docker defaults to this /app?
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev
# Instead of copying the source files, copy only the compiled app for the image - to reduce size from the above builder.
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
