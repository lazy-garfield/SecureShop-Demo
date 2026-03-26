const express = require("express");
const { db } = require("../db");

const router = express.Router();

router.get("/products", (req, res) => {
  const items = db.prepare("SELECT * FROM products").all();
  res.json(items);
});

router.get("/products/:id", (req, res) => {
  const item = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(item);
});

module.exports = router;
