FROM node:18-alpine

WORKDIR /home/node-app

COPY package.json ./
COPY yarn.lock ./

USER node

RUN yarn

COPY --chown=node:node . .

EXPOSE 3000

RUN yarn build

CMD [ "node", "dist/main.js" ]