FROM node:18

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# install dependencies
RUN npx playwright install-deps
RUN npm install --include=dev
RUN npx playwright install chromium

COPY ./src ./tsconfig.json ./

# build application
RUN npm run build

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]
