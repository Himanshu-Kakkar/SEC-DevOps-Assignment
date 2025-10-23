const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const generatorRoutes = require('./routes/generatorRoutes');
const pushRoutes = require('./routes/pushRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: "DockGen AI Backend is running" });
});

// API routes
app.use('/api/v1', generatorRoutes);
app.use('/api/v1', pushRoutes);

// Connect to database and start server
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
