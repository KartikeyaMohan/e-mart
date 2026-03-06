FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY shared ./shared

COPY services/order-service ./services/order-service

RUN npm install --omit=dev --workspace=services/order-service

WORKDIR /app/services/order-service

EXPOSE 3003

CMD ["node", "src/index.js"]