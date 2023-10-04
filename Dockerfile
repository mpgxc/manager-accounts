FROM node:18.16.1

WORKDIR /app

COPY . .

EXPOSE 3002

RUN apt-get update -y && apt-get install -y openssl

RUN npm run build

CMD ["npm", "run", "start:dev"]
