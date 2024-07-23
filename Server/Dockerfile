FROM node:20
WORKDIR /server/src/app
RUN npm install -g npm@10.8.2
RUN npm init -y
COPY package*.json ./
RUN npm install -g typescript
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]