#!/bin/bash

# Docker Multi-Stage vs Single-Stage Comparison Script
# This script automates the build, run, and comparison process

echo "🐳 Docker Multi-Stage vs Single-Stage Comparison"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean up any existing containers and images
print_status "Cleaning up existing containers and images..."
docker stop multistage-container single-container 2>/dev/null || true
docker rm multistage-container single-container 2>/dev/null || true
docker rmi node-app-multistage node-app-single 2>/dev/null || true

echo ""
print_status "Step 1: Building Multi-Stage Docker Image..."
docker build -f Dockerfile.multistage -t node-app-multistage .
if [ $? -eq 0 ]; then
    print_success "Multi-stage image built successfully!"
else
    print_error "Failed to build multi-stage image"
    exit 1
fi

echo ""
print_status "Step 2: Building Single-Stage Docker Image..."
docker build -f Dockerfile.single -t node-app-single .
if [ $? -eq 0 ]; then
    print_success "Single-stage image built successfully!"
else
    print_error "Failed to build single-stage image"
    exit 1
fi

echo ""
print_status "Step 3: Image Size Comparison"
echo "=================================="
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | grep node-app
echo ""

# Calculate size difference
MULTISTAGE_SIZE=$(docker images --format "{{.Size}}" node-app-multistage | sed 's/[^0-9.]//g')
SINGLE_SIZE=$(docker images --format "{{.Size}}" node-app-single | sed 's/[^0-9.]//g')

echo "📊 Size Analysis:"
echo "Multi-stage image: ${MULTISTAGE_SIZE}MB"
echo "Single-stage image: ${SINGLE_SIZE}MB"

echo ""
print_status "Step 4: Running Multi-Stage Container..."
docker run -d -p 3001:1234 --name multistage-container node-app-multistage
if [ $? -eq 0 ]; then
    print_success "Multi-stage container started on port 3001"
else
    print_error "Failed to start multi-stage container"
fi

echo ""
print_status "Step 5: Running Single-Stage Container..."
docker run -d -p 3002:1234 --name single-container node-app-single
if [ $? -eq 0 ]; then
    print_success "Single-stage container started on port 3002"
else
    print_error "Failed to start single-stage container"
fi

echo ""
print_status "Step 6: Container Status"
echo "=========================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(multistage|single)"

echo ""
print_status "Step 7: Testing Applications"
echo "================================="

# Wait a moment for containers to start
sleep 3

echo ""
print_status "Testing Multi-Stage Container (port 3001):"
echo "-----------------------------------------------"
echo "Root endpoint:"
curl -s http://localhost:3001/ || print_error "Failed to connect to multi-stage container"
echo ""
echo "Greet endpoint:"
curl -s http://localhost:3001/greet | head -5 || print_error "Failed to connect to multi-stage container"

echo ""
print_status "Testing Single-Stage Container (port 3002):"
echo "-----------------------------------------------"
echo "Root endpoint:"
curl -s http://localhost:3002/ || print_error "Failed to connect to single-stage container"
echo ""
echo "Greet endpoint:"
curl -s http://localhost:3002/greet | head -5 || print_error "Failed to connect to single-stage container"

echo ""
print_success "Comparison Complete!"
echo ""
echo "🌐 Access your applications:"
echo "Multi-stage: http://localhost:3001/"
echo "Multi-stage greet: http://localhost:3001/greet"
echo "Single-stage: http://localhost:3002/"
echo "Single-stage greet: http://localhost:3002/greet"
echo ""
echo "📸 Take screenshots of:"
echo "1. Docker images size comparison (docker images)"
echo "2. Running containers (docker ps)"
echo "3. Browser showing the /greet endpoint"
echo "4. Terminal showing successful curl responses"
echo ""
echo "🧹 To clean up, run:"
echo "docker stop multistage-container single-container"
echo "docker rm multistage-container single-container"
echo "docker rmi node-app-multistage node-app-single"
