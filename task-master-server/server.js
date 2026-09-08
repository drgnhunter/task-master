// server.js
const express = require("express");

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const db = require("./db"); // Import the connector file
const BaseModel = require("./BaseModel");

// Allow requests from frontend apps
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Basic GET route
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

// Example API Endpoint (GET)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Example POST route
app.post("/api/tasks", async (req, res) => {
  try {
    // const tableName1 = 'tasks'; // Fixed table name for this endpoint

    const { tableName, status, ...cleanResponse } = req.body;
    const columns = Object.keys(cleanResponse);
    const values = Object.values(cleanResponse);

    if (columns.length === 0) {
      return res.json({ error: "No task data provided." });
    }

    const columnNames = columns.map((col) => `\`${col}\``).join(", ");
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${placeholders})`;

    const [result] = await db.execute(sql, values);
    const newTaskId = result.insertId;
    //Get the value of the sent json "key"

    const sql2 = "INSERT INTO `status` (`tasks_id`, `status`) VALUES (?, ?)";
    await db.execute(sql2, [newTaskId, status]);

    return res.json({
      message: "Task saved successfully!",
    });
  } catch (error) {
    console.error("Database insertion error:", error);
    return res.json({ error: "Internal Server Error" });
  }
});

app.get("/api/tasks/count", async (req, res) => {
  try {
    const query = "SELECT COUNT(*) AS totalCount FROM `tasks`";
    const [rows] = await db.query(query);
    const totalRecords = rows[0].totalCount;

    const pendingQuery =
      "SELECT COUNT(*) AS pendingCount FROM `status` WHERE `status` = ?";
    const [pendingRows] = await db.query(pendingQuery, ["Pending"]);
    const pendingRecords = pendingRows[0].pendingCount;

    const completedQuery =
      "SELECT COUNT(*) AS completedCount FROM `status` WHERE `status` = ?";
    const [completedRows] = await db.query(completedQuery, ["Completed"]);
    const completedRecords = completedRows[0].completedCount;

    const overdueQuery =
      "SELECT COUNT(*) AS overdueCount FROM `status` WHERE `status` = ?";
    const [overdueRows] = await db.query(overdueQuery, ["Overdue"]);
    const overdueRecords = overdueRows[0].overdueCount;

    res.json({
      success: true,
      count: totalRecords,
      pendingCount: pendingRecords,
      completedCount: completedRecords,
      overdueCount: overdueRecords,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve record count.",
    });
  }
});

app.get("/api/tasks/upcoming", async (req, res) => {
  try {
    const query = "SELECT * FROM `tasks` WHERE `due_date`>NOW();";
    const [tasks] = await db.query(query);

    res.json({
      success: true,
      tasks: tasks
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve record count.",
    });
  }
});

app.get("/api/tasks/details", async (req, res) => {
  try {
    const query = "SELECT tasks.*,status.* FROM `tasks` INNER JOIN `status` ON tasks.id = status.tasks_id;";
    const [tasks] = await db.query(query);

    res.json({
      success: true,
      tasks: tasks
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve record count.",
    });
  }
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
