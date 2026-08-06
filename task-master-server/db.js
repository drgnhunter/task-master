// db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to optimize performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your server capacity
  queueLimit: 0
});

// Export the promise-based wrapper for async/await support
module.exports = pool.promise();
