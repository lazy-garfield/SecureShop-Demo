const path = require("path");
const Database = require("better-sqlite3");

const dbFile = path.join(__dirname, "data.db");
const db = new Database(dbFile);

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      qty INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  const count = db.prepare("SELECT COUNT(*) as c FROM products").get();
  if (count.c === 0) {
    const seed = db.prepare(
      "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)"
    );
    const products = [
      ["Secure Hoodie", "Cozy hoodie for testing demos.", 49.99, "https://picsum.photos/seed/hoodie/400"],
      ["Penetration Tester Kit", "Starter kit for QA and security labs.", 89.0, "https://picsum.photos/seed/kit/400"],
      ["Load Test Mug", "Coffee mug built for performance nights.", 14.5, "https://picsum.photos/seed/mug/400"],
      ["Functional Checklist", "Poster-sized checklist for QA flows.", 19.99, "https://picsum.photos/seed/poster/400"],
      ["Bug Hunter Backpack", "Carry your testing tools in style.", 79.99, "https://picsum.photos/seed/bag/400"]
    ];
    const insertMany = db.transaction((items) => {
      for (const p of items) seed.run(p);
    });
    insertMany(products);
  }

  const user = db.prepare("SELECT COUNT(*) as c FROM users").get();
  if (user.c === 0) {
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(
      "demo",
      "password123"
    );
  }
}

module.exports = { db, init };
