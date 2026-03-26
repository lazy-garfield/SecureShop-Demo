# SecureShop Demo — Presenter Guide

This document is a clear, step-by-step script for explaining the SecureShop Demo during a seminar. It includes a walkthrough for **Functional Testing**, **Performance Testing**, and **Security Testing** with concrete steps, expected outcomes, and talking points.

## Audience Goal
Show how the same app can be tested across functional flows, performance behaviors, and security vulnerabilities — and why secure implementations matter.

## Quick Setup (2–3 minutes)
1. Start backend: `npm run dev` in `backend`.
2. Start frontend: `npm run dev` in `frontend`.
3. Open the UI: `http://localhost:5173`.
4. Confirm API health: `http://localhost:4000/api/health`.

## Demo Flow (Suggested Order)
1. Functional testing
2. Performance testing
3. Security testing (SQLi, XSS, Broken Auth)

---

## 1) Functional Testing Walkthrough

### Goal
Validate core e-commerce flows work end-to-end.

### Steps
1. Open **Login** page.
2. Login with demo credentials:
   - Username: `demo`
   - Password: `password123`
3. Go to **Products**.
4. Click **Add to Cart** on 1–2 products.
5. Go to **Cart**, verify totals and quantities.
6. Click **Simulate Checkout**.
7. Confirm cart is cleared.
8. Go to **Profile** and show session details.

### Talking Points
- “These are the exact user flows we validate with functional tests.”
- “We can assert correctness: totals, state changes, and UI feedback.”

---

## 2) Performance Testing Walkthrough

### Goal
Show measurable response changes and the effect of throttling.

### Steps
1. Open **Admin/Test Panel**.
2. Move **Artificial Delay** to 1500–2500ms and click **Apply**.
3. Go to **Products** or **Cart** and trigger an API call.
4. Show the **Latest API Exchange** panel (response time changes).
5. Toggle **CPU stress mode** and apply.
6. Open **Profile** and show recent API metrics.

### Talking Points
- “We can simulate latency or server stress without external tools.”
- “The API response timing is logged and visible to testers.”
- “This helps benchmark acceptable performance thresholds.”

---

## 3) Security Testing Walkthrough

### 3.1 SQL Injection (SQLi)

**Goal:** Show the difference between vulnerable and secure login.

#### Vulnerable Mode
1. Go to **Admin/Test Panel**.
2. Switch to **Vulnerable Mode**.
3. Click **Run SQL Injection**.
4. Expected: login succeeds via SQLi and user is authenticated.

#### Secure Mode
1. Switch to **Secure Mode**.
2. Click **Run SQL Injection**.
3. Expected: request fails (blocked).

**Talking Points**
- “In vulnerable mode, string interpolation allows attacker input to alter the query.”
- “In secure mode, parameterized queries prevent query manipulation.”

---

### 3.2 Cross-Site Scripting (XSS)

**Goal:** Show rendered script execution vs sanitized output.

#### Vulnerable Mode
1. In **Admin/Test Panel**, switch to **Vulnerable Mode**.
2. Click **Inject XSS Payload**.
3. Go to **Products**, click a product, open **Reviews**.
4. Expected: the alert triggers (unsafe HTML rendered).

#### Secure Mode
1. Switch to **Secure Mode**.
2. Click **Inject XSS Payload**.
3. Go to **Products** -> **Reviews**.
4. Expected: payload appears as plain text (sanitized).

**Talking Points**
- “This shows what happens when user input is rendered without escaping.”
- “In secure mode, content is sanitized server-side and client-side.”

---

### 3.3 Broken Authentication

**Goal:** Show predictable tokens vs secure JWT.

#### Vulnerable Mode
1. Login in Vulnerable Mode.
2. Open **Profile**.
3. Observe token: `token-<userId>` (predictable, no expiry).

#### Secure Mode
1. Login in Secure Mode.
2. Open **Profile**.
3. Observe JWT token (long, signed, expires in 1h).

**Talking Points**
- “Predictable tokens are easy to guess and never expire.”
- “JWTs are signed and expiring; they are the secure baseline.”

---

## Built-in Demo Payloads
- SQLi: `' OR 1=1 --`
- XSS: `<script>alert('XSS')</script>`

---

## Common Questions (Suggested Answers)

**Q: Why does secure mode look the same visually?**
A: The UX is the same; the difference is in how data is processed and protected. That’s exactly why security testing matters.

**Q: Is this safe to deploy?**
A: No — this is intentionally vulnerable for training. Never deploy to public environments.

**Q: Can we use automated tests?**
A: Yes — the app is structured for functional tests and load testing with `autocannon`.

---

## Optional Extensions (If You Have Time)
- Run `node scripts/load-test.js http://localhost:4000/api/products` in backend to show throughput.
- Show server logs with `X-Response-Time` headers.
- Discuss how to fix each vulnerability in production.

---

## References (Files)
- Backend routes: `backend/routes/`
- Middleware: `backend/middleware/`
- Frontend UI: `frontend/src/pages/`
- Testing Panel: `frontend/src/pages/TestingPanel.jsx`

---

## Final Disclaimer
This demo contains intentionally insecure code for educational use only. Do not deploy publicly.
