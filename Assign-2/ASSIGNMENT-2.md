# Assignment 2 — Multi-Stage Dockerfile (Node.js)

This guide helps you build and run a small Node.js app using two Docker approaches:
- Single-stage image
- Multi-stage image (smaller, better for production)

Follow these steps and take screenshots as mentioned at the end.

## 1) Install requirements
- Install Docker Desktop
- Install Node.js (v18+ recommended)

## 2) Project overview
- App starts at `index.js`
- Port: `1234`
- Routes:
  - `/` → simple text
  - `/greet` → styled HTML page

## 3) Build images
Run these in the project folder (`Assign-2`):

```bash
# Multi-stage image (recommended)
docker build -f Dockerfile.multistage -t node-app-multistage .

# Single-stage image (for comparison)
docker build -f Dockerfile.single -t node-app-single .
```

## 4) Check image sizes
```bash
docker images | grep node-app
```
- You should see both images with sizes. Multi-stage should be smaller.

## 5) Run containers
```bash
# Multi-stage container (exposes app on http://localhost:3001)
docker run -d -p 3001:1234 --name multistage-container node-app-multistage

# Single-stage container (exposes app on http://localhost:3002)
docker run -d -p 3002:1234 --name single-container node-app-single
```

## 6) Test the app
- Browser:
  - Open `http://localhost:3001/` and `http://localhost:3001/greet`
  - Open `http://localhost:3002/` and `http://localhost:3002/greet`
- Or Terminal:
```bash
curl http://localhost:3001/
curl http://localhost:3001/greet
curl http://localhost:3002/
curl http://localhost:3002/greet
```

## 7) Take screenshots (for submission)
- `docker images` showing both image sizes
- `docker ps` showing both containers running
- Browser or curl showing responses from `/greet` and `/`

## 8) Stop and clean up (optional)
```bash
docker stop multistage-container single-container
docker rm multistage-container single-container
docker rmi node-app-multistage node-app-single
```

## Notes
- Dockerfiles: `Dockerfile.multistage` and `Dockerfile.single`
- Scripts available in `package.json` for dev and Docker tasks
- You can also run: `./docker-comparison.sh` to do everything automatically
