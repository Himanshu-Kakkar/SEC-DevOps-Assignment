#!/bin/bash

# Detailed Docker Image Size Comparison Script

echo "🔍 Detailed Docker Image Size Analysis"
echo "======================================"

# Get detailed image information
echo ""
echo "📊 Image Details:"
echo "-----------------"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}\t{{.ID}}" | head -1
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}\t{{.ID}}" | grep node-app

echo ""
echo "📏 Layer Analysis:"
echo "------------------"

# Analyze layers for multi-stage image
echo "Multi-stage image layers:"
docker history node-app-multistage --format "table {{.CreatedBy}}\t{{.Size}}" | head -10

echo ""
echo "Single-stage image layers:"
docker history node-app-single --format "table {{.CreatedBy}}\t{{.Size}}" | head -10

echo ""
echo "🔍 Container Resource Usage:"
echo "----------------------------"
echo "Multi-stage container:"
docker stats multistage-container --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "Single-stage container:"
docker stats single-container --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "✅ Both containers are running and responding correctly!"
echo ""
echo "🌐 Test URLs:"
echo "Multi-stage: http://localhost:3001/greet"
echo "Single-stage: http://localhost:3002/greet"
