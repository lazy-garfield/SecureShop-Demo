const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init } = require("./db");
const { perfMiddleware } = require("./middleware/perf");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const commentRoutes = require("./routes/comments");
const configRoutes = require("./routes/config");

const app = express();
const PORT = process.env.PORT || 4000;

init();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(perfMiddleware);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", commentRoutes);
app.use("/api", configRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`SecureShop Demo API running on http://localhost:${PORT}`);
});
