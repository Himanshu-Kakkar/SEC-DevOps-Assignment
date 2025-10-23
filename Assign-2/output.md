This is the stuff I need to submit for the assignment.

1. Screenshot of docker images
(run: docker images | grep node-app)
- This will show the size comparison between node-app-multistage and node-app-single.

2. Screenshot of running containers
(run: docker ps)
- This will show both 'multistage-container' and 'single-container' running on ports 3001 and 3002.

3. Screenshot of the app working
- I can use curl or just take a browser screenshot.
- Show the output from http://localhost:3001/greet
- Show the output from http://localhost:3002/greet

4. The Dockerfiles
- Include the Dockerfile.multistage file.
- Include the Dockerfile.single file.

5. The app code
- index.js
- package.json
- public/greet.css