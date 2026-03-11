#!/bin/bash

# Production build script untuk Cantik AI

set -e

echo "🐳 Building Cantik AI Production Image..."

# Build production image
docker build -t cantik-ai:production .

echo "✅ Production image built successfully!"

# Optional: Tag untuk registry
if [ "$1" = "tag" ]; then
    echo "🏷️  Tagging image for registry..."
    docker tag cantik-ai:production your-registry/cantik-ai:latest
    docker tag cantik-ai:production your-registry/cantik-ai:$(date +%Y%m%d-%H%M%S)
    echo "✅ Image tagged for registry!"
fi

# Show image info
echo "📊 Image information:"
docker images cantik-ai:production

echo "🚀 Ready to deploy with: ./scripts/docker-deploy.sh"