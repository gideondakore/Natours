FROM node:lts-alpine3.22
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run clean
RUN npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
