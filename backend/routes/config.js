const express = require("express");
const { perfConfig, recentMetrics } = require("../middleware/perf");

const router = express.Router();

router.get("/config/perf", (req, res) => {
  res.json(perfConfig);
});

router.post("/config/perf", (req, res) => {
  const { delayMs, stressMode } = req.body;
  if (typeof delayMs === "number") perfConfig.delayMs = delayMs;
  if (typeof stressMode === "boolean") perfConfig.stressMode = stressMode;
  res.json(perfConfig);
});

router.get("/metrics/recent", (req, res) => {
  res.json(recentMetrics);
});

module.exports = router;
