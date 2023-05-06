FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY scripts/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
EXPOSE 8080
CMD ["npm", "start"]

