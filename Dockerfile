# Production Dockerfile untuk Cantik AI
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache sqlite curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY platforms/pwa/package*.json ./platforms/pwa/
COPY platforms/admin/package*.json ./platforms/admin/
COPY platforms/kiosk/package*.json ./platforms/kiosk/
COPY platforms/desktop/package*.json ./platforms/desktop/

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Install workspace dependencies
RUN npm run install:all

# Build all platforms for production
RUN npm run build:all

# Create uploads directory and initialize database
RUN mkdir -p uploads
RUN npm run db:init

# Expose all ports
EXPOSE 8000 5173 5174 5175 5176

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start all services
CMD ["npm", "run", "dev:all"]