import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { requestWithLog } from "../api";

export default function Login() {
  const { securityMode, setUser, setToken, setLastExchange } = useAuth();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("password123");
  const [message, setMessage] = useState("");

  const base = securityMode === "secure" ? "/secure" : "/vuln";

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await requestWithLog({
        method: "post",
        url: `${base}/login`,
        data: { username, password },
        setLastExchange
      });
      setUser(data.user);
      setToken(data.token);
      setMessage("Logged in successfully.");
    } catch (err) {
      setMessage("Login failed.");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    try {
      const data = await requestWithLog({
        method: "post",
        url: `${base}/register`,
        data: { username, password },
        setLastExchange
      });
      setMessage(`Registered user ${data.username}. You can login now.`);
    } catch (err) {
      setMessage("Registration failed.");
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2 pb-12">
      <form onSubmit={handleLogin} className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Login ({securityMode})</h2>
        <div>
          <label className="text-sm text-slate-600">Username</label>
          <input
            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full">Login</button>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </form>
      <form onSubmit={handleRegister} className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Register ({securityMode})</h2>
        <p className="text-sm text-slate-500">
          Demo registration is intentionally lightweight for testing flows.
        </p>
        <div>
          <label className="text-sm text-slate-600">Username</label>
          <input
            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-ghost w-full">Register</button>
      </form>
    </section>
  );
}
