FROM node:16-alpine AS builder

ENV VUE_APP_SPOTIFY_CLIENT_ID=02d74b98c7904d6498b0b79def49cc5c
ENV VUE_APP_SPOTIFY_REDIRECT_URI=https://spot2gether.cybre.town/auth/callback

ENV VUE_APP_API_BASEURL=/api/v1
ENV VUE_APP_API_AUTH_BASEURL=/api/auth
ENV VUE_APP_API_PUBLIC_BASEURL=/api/public

COPY . .

RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder ./dist/ /var/www/html/
