# SecureShop Demo

SecureShop Demo is a full-stack e-commerce lab built for demonstrating **Functional Testing**, **Performance Testing**, and **Security Testing** in a controlled environment.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: SQLite (via better-sqlite3)
- REST API architecture

## Quick Start

### 1) Backend
```bash
cd backend
npm install
npm run dev
```
API runs at `http://localhost:4000`.

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
UI runs at `http://localhost:5173`.

### Demo Login
- Username: `demo`
- Password: `password123`

### Docker (Optional)
```bash
docker compose up --build
```
Frontend: `http://localhost:5173`
Backend: `http://localhost:4000`

## Key Features (Functional Testing)
- User registration and login
- Product listing page
- Add to cart
- Checkout simulation (clears cart)
- User profile page with session info

## Performance Testing Features
- **Artificial delay** (0-3000 ms) via Testing Panel
- **Stress mode** (small CPU loop)
- **Request timing logs** + `X-Response-Time` header
- Recent metrics in Profile page

## Security Modules (Intentionally Vulnerable vs Secure)

### 1) SQL Injection
**Vulnerable endpoint**: `POST /api/vuln/login`
- Vulnerable SQL string interpolation:
  ```js
  const unsafeQuery = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  ```
- **Payload**: `' OR 1=1 --`

**Secure endpoint**: `POST /api/secure/login`
- Uses parameterized query:
  ```js
  db.prepare("SELECT * FROM users WHERE username = ? AND password = ?")
  ```

### 2) Cross-Site Scripting (XSS)
**Vulnerable endpoint**: `POST /api/vuln/comments`
- UI renders `content` using `dangerouslySetInnerHTML` (no sanitization).

**Secure endpoint**: `POST /api/secure/comments`
- Server sanitizes input using `sanitize-html`.
- UI uses `DOMPurify` for defense in depth.

**Payload**: `<script>alert('XSS')</script>`

### 3) Broken Authentication
**Vulnerable auth**: `POST /api/vuln/login`
- Returns predictable token: `token-<userId>`
- No expiration

**Secure auth**: `POST /api/secure/login`
- Returns JWT with 1-hour expiration

## Testing Panel
Use the **Testing Panel** to:
- Toggle Secure vs Vulnerable modes
- Apply delay and stress mode
- Run SQLi and XSS simulations
- Inspect last API request/response

## Sample Test Cases (Functional)
- Register a new user and login
- Add products to cart and verify totals
- Simulate checkout and ensure cart is cleared
- Post a product review and verify it renders

## Load Test Script (Optional)
```bash
cd backend
node scripts/load-test.js http://localhost:4000/api/products
```
Requires `autocannon` (already in backend dependencies).

## Folder Structure
```
secureshop-demo/
  backend/
  frontend/
```

## Notes / Fix Guidance
- Replace plaintext passwords with proper hashing (bcrypt)
- Enforce strict input validation (zod/Joi)
- Use CSRF protection for sessions
- Remove vulnerable endpoints before production

## Important Disclaimer
This project intentionally includes insecure patterns for training and demo use. Do NOT deploy it publicly.
