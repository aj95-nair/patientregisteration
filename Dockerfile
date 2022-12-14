FROM node:17.4

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=6000

EXPOSE 6000

CMD [ "npm", "start" ]
