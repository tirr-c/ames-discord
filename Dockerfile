FROM node:10 AS build

WORKDIR /app
COPY . /app
RUN yarn --frozen-lockfile && yarn build

FROM node:10

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn --prod --frozen-lockfile && yarn cache clean
COPY --from=build /app/dist /app/dist

CMD ["yarn", "start"]
