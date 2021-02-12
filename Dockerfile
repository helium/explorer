FROM node:lts-alpine

ENV NEXT_PUBLIC_MAPBOX_KEY $NEXT_PUBLIC_MAPBOX_KEY
RUN apk add --no-cache git

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile
COPY . .

EXPOSE 3000
CMD [ "yarn", "dev" ]
