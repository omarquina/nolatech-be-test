FROM node:22.6.0-alpine3.19 as develop
#FROM node:18-alpine3.16 as develop
#RUN apk add --no-cache  chromium --repository=https://dl-cdn.alpinelinux.org/alpine/v3.17/main
#RUN apk add musl 
WORKDIR /app
#RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium
ARG PRIVATE_PORT=3333
EXPOSE $PRIVATE_PORT
EXPOSE 9229
CMD ["npm", "run", "start:dev"]

#BUILD
FROM node:18-alpine as build
WORKDIR /build/
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run prisma
RUN npm run build

#DEPLOY
FROM node:18-alpine as deploy
ARG NODE_ENV
ARG PORT=3333
WORKDIR /app
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001

COPY --from=build /build/dist ./
COPY package*.json ./
COPY prisma/ ./prisma

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV HUSKY_SKIP_INSTALL=1

RUN npm ci --prod \
    && rm -Rf ~/.cache ~/.npm \
    && npm run prisma

USER nestjs

EXPOSE $PORT

CMD ["npm", "run", "start"]
