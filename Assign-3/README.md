Create a root directory with two sub-folders:
1.  /frontend
2.  /backend

Also, create a root `README.md` and a `.gitignore` file. Add `node_modules`, `.env`, and `temp-clones/` to the `.gitignore`.


1.  Initialize a new Node.js project: `npm init -y`
2.  Install the core dependencies: `npm install express mongoose cors dotenv`
3.  Install dev dependencies: `npm install nodemon --save-dev`
4.  Update `package.json` to add a dev script: `"dev": "nodemon src/index.js"`
5.  Create a `.env` file and add `PORT=8080` and `MONGO_URI=...` (I'll fill this in later).

Inside `/backend`, create a `src` directory.
Inside `/backend/src`, create `index.js`.
In `index.js`, write the code for a basic Express server:
-   Import `express`, `cors`, and `dotenv`.
-   Load `dotenv`.
-   Initialize the app and use `cors()` and `express.json()` middleware.
-   Set up a simple test route `GET /` that returns `{ message: "DockGen AI Backend is running" }`.
-   Make the app listen on `process.env.PORT`.


-   Import `mongoose`.
-   Create an `async` function called `connectDB`.
-   Inside, use `mongoose.connect(process.env.MONGO_URI)` in a try/catch block.
-   Log a success message on connection or an error on failure.
-   Export this function.

create the API endpoint.
1.  Create `/backend/src/routes/generatorRoutes.js`.
2.  Create `/backend/src/controllers/generatorController.js`.

In `generatorController.js`:
-   Create an `async` function `handleGenerateRequest`. For now, just make it log `req.body` and send back a dummy JSON: `res.status(200).json({ status: 'pending', dockerfile: '...generating...' })`.
-   Export this function.

In `generatorRoutes.js`:
-   Import `express` and create a `Router`.
-   Import `handleGenerateRequest` from the controller.
-   Create one route: `router.post('/generate', handleGenerateRequest)`.
-   Export the router.

Create Next.js project

Inside Frontend

1.  Initialize Shadcn/UI: `npx shadcn-ui@latest init` (use the default settings).
2.  Add the components we'll need:
    `npx shadcn-ui@latest add button`
    `npx shadcn-ui@latest add input`
    `npx shadcn-ui@latest add textarea`
    `npx shadcn-ui@latest add card`
    `npx shadcn-ui@latest add label`
    `npx shadcn-ui@latest add alert`
    `npx shadcn-ui@latest add loader-2` (for a loading spinner)


-   Import `mongoose`.
-   Define a `buildSchema` with these fields:
    -   `repoUrl`: String
    -   `status`: String (enum: ['success', 'failed'])
    -   `dockerfile`: String (only if success)
    -   `buildLogs`: String (only if failed)
    -   `createdAt`: Date (default: Date.now)
-   Create and export the model: `mongoose.model('Build', buildSchema)`.

