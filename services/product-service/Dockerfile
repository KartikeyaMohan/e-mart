FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY shared ./shared

COPY services/product-service ./services/product-service

RUN npm install --omit=dev --workspace=services/product-service

WORKDIR /app/services/product-service

EXPOSE 3002

CMD ["node", "src/index.js"]