#!/bin/bash

# Production deployment script untuk Cantik AI

set -e

echo "🚀 Deploying Cantik AI to Production..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove old images to ensure fresh build
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start services
echo "🔨 Building and starting production services..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🏥 Checking service health..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend API is healthy!"
        break
    else
        echo "⏳ Attempt $attempt/$max_attempts - Backend not ready yet..."
        sleep 10
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Backend health check failed after $max_attempts attempts!"
    echo "📋 Container logs:"
    docker-compose -f docker-compose.prod.yml logs cantik-ai-production
    exit 1
fi

# Show running containers
echo "📋 Running containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Production deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Main Site: https://skin-analyzer.cantik.ai"
echo "   PWA: https://skin-analyzer.cantik.ai"
echo "   Admin: https://skin-analyzer.cantik.ai/admin"
echo "   Kiosk: https://skin-analyzer.cantik.ai/kiosk"
echo "   Desktop: https://skin-analyzer.cantik.ai/desktop"
echo "   API: https://skin-analyzer.cantik.ai/api"
echo ""
echo "📊 Monitor logs with: docker-compose -f docker-compose.prod.yml logs -f"