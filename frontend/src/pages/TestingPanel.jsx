import React, { useEffect, useState } from "react";
import api, { requestWithLog } from "../api";
import { useAuth } from "../context/AuthContext";
import ApiConsole from "../components/ApiConsole";

export default function TestingPanel() {
  const {
    securityMode,
    setSecurityMode,
    setUser,
    setToken,
    lastExchange,
    setLastExchange
  } = useAuth();
  const [delayMs, setDelayMs] = useState(0);
  const [stressMode, setStressMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("");
  const base = securityMode === "secure" ? "/secure" : "/vuln";

  useEffect(() => {
    api.get("/config/perf").then((res) => {
      setDelayMs(res.data.delayMs || 0);
      setStressMode(!!res.data.stressMode);
    });
    api.get("/products").then((res) => {
      setProducts(res.data);
      if (res.data[0]) setProductId(res.data[0].id);
    });
  }, []);

  async function updatePerf() {
    await requestWithLog({
      method: "post",
      url: "/config/perf",
      data: { delayMs, stressMode },
      setLastExchange
    });
    setStatus("Performance config updated.");
  }

  async function simulateSQLi() {
    try {
      const data = await requestWithLog({
        method: "post",
        url: `${base}/login`,
        data: { username: "' OR 1=1 --", password: "anything" },
        setLastExchange
      });
      if (securityMode === "secure") {
        setStatus("Secure mode blocked SQLi (this should not succeed).");
      } else {
        setUser(data.user);
        setToken(data.token);
        setStatus("SQLi simulated: logged in via vulnerable endpoint.");
      }
    } catch (err) {
      if (securityMode === "secure") {
        setStatus("Secure mode blocked SQLi as expected.");
      } else {
        setStatus("SQLi attempt failed (unexpected in vulnerable mode).");
      }
    }
  }

  async function simulateXSS() {
    try {
      const payload = "<script>alert('XSS')</script>";
      const res = await requestWithLog({
        method: "post",
        url: `${base}/login`,
        data: { username: "demo", password: "password123" },
        setLastExchange
      });
      setUser(res.user);
      setToken(res.token);
      await requestWithLog({
        method: "post",
        url: `${base}/comments`,
        data: { productId, content: payload },
        token: res.token,
        setLastExchange
      });
      if (securityMode === "secure") {
        setStatus("Secure mode sanitized the XSS payload. Check Products > Reviews.");
      } else {
        setStatus("XSS payload injected in vulnerable comments. Check Products > Reviews.");
      }
    } catch (err) {
      setStatus("XSS simulation failed.");
    }
  }

  return (
    <section className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Testing Panel</h2>
          <p className="text-sm text-slate-500">
            Toggle security modes, stress performance, and run attack simulations.
          </p>
        </div>
        {status && <span className="badge">{status}</span>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold">Security Mode</h3>
          <div className="flex items-center gap-3">
            <button
              className={`btn ${securityMode === "secure" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setSecurityMode("secure")}
            >
              Secure Mode
            </button>
            <button
              className={`btn ${securityMode === "vulnerable" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setSecurityMode("vulnerable")}
            >
              Vulnerable Mode
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Secure mode routes to parameterized queries, sanitized output, and JWT auth.
            Vulnerable mode uses insecure endpoints for demonstration.
          </p>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-semibold">Performance Controls</h3>
          <label className="text-sm text-slate-600">Artificial Delay (ms)</label>
          <input
            type="range"
            min="0"
            max="3000"
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0 ms</span>
            <span>{delayMs} ms</span>
            <span>3000 ms</span>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stressMode}
              onChange={(e) => setStressMode(e.target.checked)}
            />
            Enable CPU stress mode
          </label>
          <button className="btn btn-primary" onClick={updatePerf}>Apply</button>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold">Attack Simulations</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-ghost" onClick={simulateSQLi}>
            Run SQL Injection
          </button>
          <button className="btn btn-ghost" onClick={simulateXSS}>
            Inject XSS Payload
          </button>
        </div>
        <div className="text-sm text-slate-600">
          <p>SQLi payload: <code>' OR 1=1 --</code></p>
          <p>XSS payload: <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code></p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Target product for XSS</label>
          <select
            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <ApiConsole exchange={lastExchange} />
    </section>
  );
}
