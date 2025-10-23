## Assignment 2 - Multi-Stage Dockerfile
### check output folder for screenshots

This project shows how to build a Node.js app with a multi-stage Dockerfile and compare it to a single-stage one.

The app is a simple server on port 1234.
- / (root) shows a test message.
- /greet shows a styled HTML page.

Requirements
You need Docker and Node.js installed to run this.

How to Build the Images

1. Build the multi-stage image (the small one)
docker build -f Dockerfile.multistage -t node-app-multistage .

2. Build the single-stage image (the big one)
docker build -f Dockerfile.single -t node-app-single .

Check Image Sizes

Run this command to see the size difference:
docker images | grep node-app

How to Run the Containers

1. Run the multi-stage container (on port 3001)
docker run -d -p 3001:1234 --name multistage-container node-app-multistage

2. Run the single-stage container (on port 3002)
docker run -d -p 3002:1234 --name single-container node-app-single

Test the App

You can open these in your browser:
http://localhost:3001/greet  (multi-stage)
http://localhost:3002/greet  (single-stage)

Or test with curl in your terminal:
curl http://localhost:3001/
curl http://localhost:3002/

Cleanup

To stop and remove the containers:
docker stop multistage-container single-container
docker rm multistage-container single-container

To remove the images:
docker rmi node-app-multistage node-app-single

