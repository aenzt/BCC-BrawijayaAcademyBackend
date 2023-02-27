FROM node:19-alpine

RUN apk update

WORKDIR /usr/src/app

ENV NODE_ENV=PRODUCTION

COPY package*.json ./

RUN npm ci --omit=dev

COPY . ./

RUN npm run build

CMD ["npm", "run", "start:prod"]