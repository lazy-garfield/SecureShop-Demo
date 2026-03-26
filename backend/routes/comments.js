const express = require("express");
const sanitizeHtml = require("sanitize-html");
const { db } = require("../db");
const { authVulnerable, authSecure } = require("../middleware/auth");

const router = express.Router();

router.get("/vuln/comments/:productId", (req, res) => {
  const items = db
    .prepare("SELECT * FROM comments WHERE productId = ? ORDER BY id DESC")
    .all(req.params.productId);
  res.json(items);
});

router.post("/vuln/comments", authVulnerable, (req, res) => {
  const { productId, content } = req.body;
  if (!productId || !content) return res.status(400).json({ error: "Missing fields" });
  db.prepare(
    "INSERT INTO comments (userId, productId, content, createdAt) VALUES (?, ?, ?, ?)"
  ).run(req.user.id, productId, content, new Date().toISOString());
  res.json({ ok: true });
});

router.get("/secure/comments/:productId", (req, res) => {
  const items = db
    .prepare("SELECT * FROM comments WHERE productId = ? ORDER BY id DESC")
    .all(req.params.productId);
  res.json(items);
});

router.post("/secure/comments", authSecure, (req, res) => {
  const { productId, content } = req.body;
  if (!productId || !content) return res.status(400).json({ error: "Missing fields" });

  const clean = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {}
  });

  db.prepare(
    "INSERT INTO comments (userId, productId, content, createdAt) VALUES (?, ?, ?, ?)"
  ).run(req.user.id, productId, clean, new Date().toISOString());
  res.json({ ok: true });
});

module.exports = router;
