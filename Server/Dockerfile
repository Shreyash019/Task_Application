FROM node:18
WORKDIR /server/src/app
RUN npm init -y
COPY package*.json ./
RUN npm install -g typescript
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]