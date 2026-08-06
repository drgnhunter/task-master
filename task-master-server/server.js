// server.js
const express = require('express');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const db = require('./db'); // Import the connector file
const BaseModel = require('./BaseModel');

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
app.post('/api/tasks', async (req, res) => {
  try {
    // const tableName1 = 'tasks'; // Fixed table name for this endpoint

    const {tableName, ...cleanResponse} = req.body;
    const columns = Object.keys(cleanResponse);
    const values = Object.values(cleanResponse);

    if (columns.length === 0) {
      return res.json({ error: 'No task data provided.' });
    }

    const columnNames = columns.map((col) => `\`${col}\``).join(', ');
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${placeholders})`;

    const [result] = await db.execute(sql, values);

    return res.json({
      message: 'Task saved successfully!',
      insertedId: result.insertId,
    });

  } catch (error) {
    console.error('Database insertion error:', error);
    return res.json({ error: 'Internal Server Error' });
  }
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});