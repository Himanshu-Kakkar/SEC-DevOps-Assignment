const express = require('express');
const path = require('path');
const app = express();
const port = 1234;

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello. This is simple GET request with Express');
});

app.get('/greet', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Greeting Service</title>
      <link rel="stylesheet" href="/greet.css" />
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h2>👋 Hello from Server!</h2>
          <p>The Greeting Service is running successfully.</p>
          <small>Status: 200 OK</small>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
