const express = require("express");
const jwt = require("jsonwebtoken");
const { db } = require("../db");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// Vulnerable registration (no password hashing, minimal validation)
router.post("/vuln/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const info = stmt.run(username, password);
    return res.json({ id: info.lastInsertRowid, username });
  } catch (err) {
    return res.status(400).json({ error: "User already exists" });
  }
});

// Secure registration (still simple for demo)
router.post("/secure/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const info = stmt.run(username, password);
    return res.json({ id: info.lastInsertRowid, username });
  } catch (err) {
    return res.status(400).json({ error: "User already exists" });
  }
});

// Vulnerable login (SQL injection possible)
router.post("/vuln/login", (req, res) => {
  const { username, password } = req.body;
  const unsafeQuery = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  const user = db.prepare(unsafeQuery).get();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Broken authentication: predictable token, no expiration
  const token = `token-${user.id}`;
  return res.json({ token, user: { id: user.id, username: user.username } });
});

// Secure login (parameterized query + JWT)
router.post("/secure/login", (req, res) => {
  const { username, password } = req.body;
  const user = db
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .get(username, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return res.json({ token, user: { id: user.id, username: user.username } });
});

module.exports = router;
