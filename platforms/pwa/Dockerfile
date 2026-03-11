# Stage 1: Build
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:stable-alpine

# Salin hasil build (Pastikan folder 'dist' sesuai dengan output build Anda)
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Tambahkan config Nginx agar support React Routing (menghindari 404 refresh)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]