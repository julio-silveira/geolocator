FROM node:20-alpine

WORKDIR /api

COPY package.json ./

COPY yarn.lock ./

RUN yarn

EXPOSE ${API_PORT}

COPY . .

CMD ["yarn", "dev"]
