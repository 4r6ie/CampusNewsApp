FROM node:20-alpine AS build
WORKDIR /app
COPY apps/admin/web_admin/package*.json ./
RUN npm ci
COPY apps/admin/web_admin/ ./
RUN npm run build

FROM nginx:1.27-alpine AS release
COPY infrastructure/docker/admin/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]