// server.js
const express = require('express');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// Allow requests from frontend apps
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Basic GET route
app.get('/', (req, res) => {
  res.send('Welcome to the Express Server!');
});

// Example API Endpoint (GET)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Example POST route
app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  console.log('Received new task:', newTask);
  
  res.status(201).json({
    message: 'Task created successfully',
    task: newTask,
  });
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});