const autocannon = require("autocannon");

const url = process.argv[2] || "http://localhost:4000/api/products";

const instance = autocannon({
  url,
  connections: 20,
  duration: 10
});

autocannon.track(instance, { renderProgressBar: true });
