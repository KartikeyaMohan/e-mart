FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY shared ./shared

COPY services/user-service ./services/user-service

RUN npm install --omit=dev --workspace=services/user-service

WORKDIR /app/services/user-service

EXPOSE 3001

CMD ["node", "src/index.js"]