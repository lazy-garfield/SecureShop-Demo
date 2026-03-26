const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret-demo-key";

function authVulnerable(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !token.startsWith("token-")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  const userId = Number(token.replace("token-", ""));
  if (!userId) return res.status(401).json({ error: "Invalid token" });
  req.user = { id: userId, username: `user${userId}` };
  next();
}

function authSecure(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authVulnerable, authSecure, JWT_SECRET };
