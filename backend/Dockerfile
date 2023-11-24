FROM node:16-alpine

COPY . .

RUN npm ci

CMD "nodejs --unhandled-rejections=warn-with-error-code --trace-warnings index.mjs"
