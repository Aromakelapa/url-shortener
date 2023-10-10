FROM node:18.17.1
WORKDIR /app
COPY package* .
RUN npm i
COPY . .
CMD ["npm", "start"]