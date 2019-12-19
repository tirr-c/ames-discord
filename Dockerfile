FROM node:10 AS build

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn --frozen-lockfile && yarn cache clean
COPY . /app
RUN yarn build

FROM node:10

WORKDIR /app
ENV TINI_VERSION v0.18.0
RUN ARCH="$(dpkg --print-architecture)" \
 && wget -qO /tini "https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-${ARCH}" \
 && chmod +x /tini
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn --prod --frozen-lockfile && yarn cache clean
COPY --from=build /app/dist /app/dist

ENTRYPOINT ["/tini", "--"]
CMD ["yarn", "start"]
