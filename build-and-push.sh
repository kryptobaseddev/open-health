#!/bin/bash

# Script to build and push Docker image for Portainer deployment
# This builds the image locally and can push to Docker Hub or GitHub Container Registry

set -e

# Configuration
IMAGE_NAME="openhealth"
IMAGE_TAG="latest"
REGISTRY="" # Leave empty for Docker Hub, or use "ghcr.io/yourusername/"

echo "🔨 Building OpenHealth Docker image..."

# Build the production image
docker build -f Dockerfile.production -t ${IMAGE_NAME}:${IMAGE_TAG} .

echo "✅ Build complete!"
echo ""
echo "To use this image in Portainer:"
echo "1. Tag it for your local registry or Docker Hub:"
echo "   docker tag ${IMAGE_NAME}:${IMAGE_TAG} your-registry/${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "2. Push to registry (optional - for multi-server deployment):"
echo "   docker push your-registry/${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "3. Or save as tar file to import on another server:"
echo "   docker save ${IMAGE_NAME}:${IMAGE_TAG} -o openhealth.tar"
echo "   # On target server: docker load -i openhealth.tar"