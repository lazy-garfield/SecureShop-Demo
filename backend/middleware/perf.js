const perfConfig = {
  delayMs: 0,
  stressMode: false
};

const recentMetrics = [];

function perfMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  const originalEnd = res.end;
  res.end = function (...args) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${durationMs.toFixed(2)}ms`);
    }
    recentMetrics.push({
      method: req.method,
      path: req.originalUrl,
      durationMs: Number(durationMs.toFixed(2)),
      ts: new Date().toISOString()
    });
    if (recentMetrics.length > 50) recentMetrics.shift();
    console.log(`[perf] ${req.method} ${req.originalUrl} ${durationMs.toFixed(2)}ms`);
    return originalEnd.apply(this, args);
  };

  if (perfConfig.delayMs > 0) {
    setTimeout(() => next(), perfConfig.delayMs);
    return;
  }

  if (perfConfig.stressMode) {
    // Simple CPU stress loop (small but measurable)
    let sum = 0;
    for (let i = 0; i < 200000; i++) sum += Math.sqrt(i);
  }

  next();
}

module.exports = { perfMiddleware, perfConfig, recentMetrics };
