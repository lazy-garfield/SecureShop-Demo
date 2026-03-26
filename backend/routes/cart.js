const express = require("express");
const { db } = require("../db");
const { authVulnerable, authSecure } = require("../middleware/auth");

const router = express.Router();

function getCart(userId) {
  return db
    .prepare(
      `SELECT cart.id, cart.qty, products.name, products.price, products.image, products.id as productId
       FROM cart JOIN products ON cart.productId = products.id WHERE cart.userId = ?`
    )
    .all(userId);
}

router.get("/vuln/cart", authVulnerable, (req, res) => {
  res.json(getCart(req.user.id));
});

router.post("/vuln/cart", authVulnerable, (req, res) => {
  const { productId, qty } = req.body;
  const existing = db
    .prepare("SELECT * FROM cart WHERE userId = ? AND productId = ?")
    .get(req.user.id, productId);
  if (existing) {
    db.prepare("UPDATE cart SET qty = qty + ? WHERE id = ?").run(qty || 1, existing.id);
  } else {
    db.prepare("INSERT INTO cart (userId, productId, qty) VALUES (?, ?, ?)")
      .run(req.user.id, productId, qty || 1);
  }
  res.json(getCart(req.user.id));
});

router.delete("/vuln/cart", authVulnerable, (req, res) => {
  db.prepare("DELETE FROM cart WHERE userId = ?").run(req.user.id);
  res.json({ ok: true });
});

router.get("/secure/cart", authSecure, (req, res) => {
  res.json(getCart(req.user.id));
});

router.post("/secure/cart", authSecure, (req, res) => {
  const { productId, qty } = req.body;
  const existing = db
    .prepare("SELECT * FROM cart WHERE userId = ? AND productId = ?")
    .get(req.user.id, productId);
  if (existing) {
    db.prepare("UPDATE cart SET qty = qty + ? WHERE id = ?").run(qty || 1, existing.id);
  } else {
    db.prepare("INSERT INTO cart (userId, productId, qty) VALUES (?, ?, ?)")
      .run(req.user.id, productId, qty || 1);
  }
  res.json(getCart(req.user.id));
});

router.delete("/secure/cart", authSecure, (req, res) => {
  db.prepare("DELETE FROM cart WHERE userId = ?").run(req.user.id);
  res.json({ ok: true });
});

module.exports = router;
