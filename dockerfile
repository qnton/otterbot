FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/bot

COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node

CMD ["node", "index.js"]