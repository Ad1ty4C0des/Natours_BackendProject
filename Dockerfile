FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npx esbuild public/js/index.js --bundle --outfile=public/js/bundle.js \
    --sourcemap --target=es2020 --format=iife --global-name=app

EXPOSE 3000

CMD ["node", "server.js"]