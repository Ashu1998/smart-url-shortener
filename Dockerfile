FROM node:20.19.2

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build
EXPOSE 5051

CMD ["npm", "start"]