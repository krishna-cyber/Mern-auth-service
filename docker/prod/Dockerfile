FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts --omit=dev

COPY --from=builder /app/dist ./

EXPOSE 3001

CMD [ "node","src/server.js" ]



