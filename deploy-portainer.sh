#!/bin/bash

# OpenHealth Portainer Stack Deployment Script
# Usage: ./deploy-portainer.sh [environment]

set -e

ENVIRONMENT=${1:-production}
STACK_NAME="openhealth"

echo "🚀 Deploying OpenHealth to Portainer (Environment: $ENVIRONMENT)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and configure it"
    exit 1
fi

# Validate required environment variables
required_vars=("DATABASE_URL" "AUTH_SECRET" "ENCRYPTION_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set in .env"
        exit 1
    fi
done

# Build the production image
echo "🔨 Building production Docker image..."
docker build -f Dockerfile.production -t openhealth:latest .

# Deploy stack to Portainer
echo "📦 Deploying stack to Portainer..."
docker stack deploy -c docker-compose.portainer.yaml $STACK_NAME

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker exec $(docker ps -qf "label=com.docker.stack.namespace=$STACK_NAME" -f "label=com.docker.compose.service=app") \
    npx prisma migrate deploy

# Check health status
echo "🔍 Checking application health..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Application is healthy!"
        break
    fi
    attempt=$((attempt + 1))
    echo "Waiting for application to be ready... (attempt $attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Application failed to become healthy"
    exit 1
fi

echo "✨ Deployment complete!"
echo "📱 Access OpenHealth at: http://localhost:3000"
echo "🔐 Default credentials: Check your .env file"
echo ""
echo "📊 Portainer labels applied for easy management"
echo "   - Stack namespace: $STACK_NAME"
echo "   - Resource limits configured"
echo "   - Health checks enabled"