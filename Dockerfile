FROM node:20
WORKDIR /server/src/app
COPY package*.json ./
RUN npm install -g typescript
COPY . .
RUN npm run build
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]