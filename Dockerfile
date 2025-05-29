FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm config set strict-ssl false
RUN npm install --verbose
RUN npm config set strict-ssl true

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
