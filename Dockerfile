# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:web

# Production stage - nginx for web
FROM nginx:alpine AS web
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
EXPOSE 8081 19000 19001 19002
CMD ["npm", "start"]