# Assignment 2: Multi-Stage Dockerfile

This project demonstrates the difference between single-stage and multi-stage Docker builds for a Node.js application.

## Project Structure

```
├── index.js                 # Main Express application
├── package.json            # Node.js dependencies
├── public/
│   └── greet.css          # CSS styling
├── Dockerfile.multistage  # Multi-stage Dockerfile
├── Dockerfile.single      # Single-stage Dockerfile
├── .dockerignore          # Files to exclude from Docker context
└── README.md              # This file
```

## Application Overview

The Node.js application is a simple Express server that:
- Serves a basic greeting message on the root route (`/`)
- Provides a styled HTML page on the `/greet` route
- Uses static CSS files for styling
- Runs on port 1234

## Development Scripts

The project includes several npm scripts for easy development and Docker operations:

### Development Commands
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies (including nodemon for development)
npm install
```

### Docker Commands
```bash
# Build Docker images
npm run docker:build:multi    # Build multi-stage image
npm run docker:build:single   # Build single-stage image

# Run containers
npm run docker:run:multi       # Run multi-stage container
npm run docker:run:single     # Run single-stage container

# Docker management
npm run docker:stop           # Stop all containers
npm run docker:clean          # Stop, remove containers and images
npm run docker:compare        # Run full comparison script
npm run docker:analyze        # Run detailed size analysis
```

## Step-by-Step Instructions

### Step 1: Build Multi-Stage Docker Image

```bash
# Build the multi-stage Docker image
docker build -f Dockerfile.multistage -t node-app-multistage .

# Check the image size
docker images node-app-multistage
```

### Step 2: Build Single-Stage Docker Image

```bash
# Build the single-stage Docker image
docker build -f Dockerfile.single -t node-app-single .

# Check the image size
docker images node-app-single
```

### Step 3: Compare Image Sizes

```bash
# Compare both images
docker images | grep node-app

# Get detailed size information
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep node-app
```

### Step 4: Run Multi-Stage Container

```bash
# Run the multi-stage container
docker run -d -p 3001:1234 --name multistage-container node-app-multistage

# Check if container is running
docker ps

# Test the application
curl http://localhost:3001/
curl http://localhost:3001/greet
```

### Step 5: Run Single-Stage Container

```bash
# Run the single-stage container
docker run -d -p 3002:1234 --name single-container node-app-single

# Check if container is running
docker ps

# Test the application
curl http://localhost:3002/
curl http://localhost:3002/greet
```

### Step 6: Clean Up

```bash
# Stop and remove containers
docker stop multistage-container single-container
docker rm multistage-container single-container

# Remove images (optional)
docker rmi node-app-multistage node-app-single
```

## Expected Results

### Image Size Comparison

- **Multi-stage build**: Smaller image size (typically 50-70% smaller)
- **Single-stage build**: Larger image size (includes build tools and dependencies)

### Why Multi-Stage is Better

1. **Smaller Runtime Image**: Only includes production dependencies
2. **Better Security**: No build tools in production image
3. **Faster Deployment**: Smaller images transfer faster
4. **Reduced Attack Surface**: Fewer packages mean fewer vulnerabilities

## Dockerfile Explanations

### Multi-Stage Dockerfile (`Dockerfile.multistage`)

**Stage 1 (Builder)**:
- Uses `node:18-alpine` as base
- Installs dependencies
- Copies source code
- Prepares the application

**Stage 2 (Runtime)**:
- Uses `node:18-alpine` as base
- Copies only production artifacts from Stage 1
- Sets up non-root user for security
- Includes health check
- Runs the application

### Single-Stage Dockerfile (`Dockerfile.single`)

- Uses single `node:18-alpine` base image
- Installs dependencies and copies code in same stage
- Includes all build tools in final image
- Larger final image size

## Testing the Application

### Browser Testing
1. Open browser and go to `http://localhost:3001/` (multi-stage)
2. Open browser and go to `http://localhost:3002/` (single-stage)
3. Visit `http://localhost:3001/greet` and `http://localhost:3002/greet` for styled page

### Command Line Testing
```bash
# Test root endpoint
curl http://localhost:3001/
curl http://localhost:3002/

# Test greet endpoint
curl http://localhost:3001/greet
curl http://localhost:3002/greet
```

## Screenshots to Capture

1. **Docker Images Size Comparison**: `docker images` output showing both images
2. **Running Container**: `docker ps` showing both containers running
3. **Application in Browser**: Screenshot of the `/greet` endpoint
4. **Curl Output**: Terminal output showing successful HTTP responses

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change port mappings (e.g., `-p 3003:1234`)
2. **Container Won't Start**: Check logs with `docker logs <container-name>`
3. **Permission Issues**: Ensure Docker daemon is running and you have permissions

### Useful Commands

```bash
# View container logs
docker logs <container-name>

# Inspect container details
docker inspect <container-name>

# View running processes in container
docker exec -it <container-name> ps aux

# Access container shell
docker exec -it <container-name> sh
```
