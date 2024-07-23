FROM node:20
WORKDIR /server/src/app
RUN npm init -y
COPY package*.json ./
RUN npm install -g typescript
RUN npm install
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]