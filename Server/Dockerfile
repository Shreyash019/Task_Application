FROM node:20
WORKDIR /server/src/app
COPY package*.json ./
RUN npm install -g typescript
COPY . .
RUN npm install
RUN tsc
EXPOSE 5000
CMD ["npm", "start"]