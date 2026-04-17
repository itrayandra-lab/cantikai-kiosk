# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Inject VITE env vars as build args (Vite embeds these at build time)
ARG VITE_API_URL
ARG VITE_BACKEND_URL
ARG VITE_PRODUCTS_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_PRODUCTS_API_URL=$VITE_PRODUCTS_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN ./node_modules/.bin/vite build

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