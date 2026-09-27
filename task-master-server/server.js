import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import db from "./db.js";
import BaseModel from "./BaseModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ---------------------------------------------
// Google OAuth Configuration
// ---------------------------------------------
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Endpoint 1: Redirect user to Google sign-in
app.get("/api/auth/google", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  res.redirect(authUrl);
});

// Endpoint 2: Google redirects back with authorization code
app.get("/api/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=missing_code`);
  }

  try {
    // Exchange temporary code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user details from Google
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    // Check if user already exists in login table
    const [rows] = await db.execute(
      "SELECT id, username FROM login WHERE username = ?",
      [profile.email]
    );

    let userId;
    let username = profile.email;

    if (rows.length > 0) {
      userId = rows[0].id;
      username = rows[0].username;
    } else {
      // Auto-register new Google user with a dummy/oauth password marker
      const [insertResult] = await db.execute(
        "INSERT INTO login (username, password) VALUES (?, ?)",
        [profile.email, "OAUTH_GOOGLE_USER"]
      );
      userId = insertResult.insertId;
    }

    let fullname = profile.name;
    // Pass user session data via URL params back to React
    const sessionPayload = encodeURIComponent(
      JSON.stringify({ id: userId, username:fullname })
    );

    res.redirect(`${process.env.FRONTEND_URL}?oauth_session=${sessionPayload}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
  }
});

// ---------------------------------------------
// Standard Task & Auth Routes
// ---------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.post("/api/tasks", async (req, res) => {
  try {
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

    const sql2 = "INSERT INTO `status` (`tasks_id`, `status`) VALUES (?, ?)";
    await db.execute(sql2, [newTaskId, status]);

    return res.json({ message: "Task saved successfully!" });
  } catch (error) {
    console.error("Database insertion error:", error);
    return res.json({ error: "Internal Server Error" });
  }
});

app.get("/api/tasks/count", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS totalCount FROM `tasks`");
    const [pendingRows] = await db.query(
      "SELECT COUNT(*) AS pendingCount FROM `status` WHERE `status` = ?",
      ["Pending"]
    );
    const [completedRows] = await db.query(
      "SELECT COUNT(*) AS completedCount FROM `status` WHERE `status` = ?",
      ["Completed"]
    );
    const [overdueRows] = await db.query(
      "SELECT COUNT(*) AS overdueCount FROM `status` WHERE `status` = ?",
      ["Overdue"]
    );

    res.json({
      success: true,
      count: rows[0].totalCount,
      pendingCount: pendingRows[0].pendingCount,
      completedCount: completedRows[0].completedCount,
      overdueCount: overdueRows[0].overdueCount,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve record count." });
  }
});

app.get("/api/tasks/upcoming", async (req, res) => {
  try {
    const query = "SELECT * FROM `tasks` WHERE `due_date` > NOW();";
    const [tasks] = await db.query(query);
    res.json({ success: true, tasks });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve record count." });
  }
});

app.get("/api/tasks/details", async (req, res) => {
  try {
    const query =
      "SELECT tasks.*, status.* FROM `tasks` INNER JOIN `status` ON tasks.id = status.tasks_id;";
    const [tasks] = await db.query(query);
    res.json({ success: true, tasks });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve record count." });
  }
});

app.post("/api/tasks/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, username, password FROM login WHERE username = ?",
      [username]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    return res.status(200).json({
      id: rows[0].id,
      username: rows[0].username,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login route error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/tasks/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const [existing] = await db.execute(
      "SELECT id FROM login WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const [result] = await db.execute(
      "INSERT INTO login (username, password) VALUES (?, ?)",
      [username, password]
    );

    return res.status(201).json({
      id: result.insertId,
      username,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup route error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});