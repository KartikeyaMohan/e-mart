FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY shared ./shared

COPY services/api-gateway ./services/api-gateway

RUN npm install --omit=dev --workspace=services/api-gateway

WORKDIR /app/services/api-gateway

EXPOSE 3000

CMD ["node", "src/index.js"]