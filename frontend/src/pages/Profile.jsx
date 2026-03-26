import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Profile() {
  const { user, token, securityMode } = useAuth();
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    api.get("/metrics/recent").then((res) => setMetrics(res.data));
  }, []);

  return (
    <section className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-sm text-slate-500">Session details for testing flows.</p>
      </div>

      <div className="card p-6 space-y-2">
        {!user && <p className="text-sm text-slate-500">Not logged in.</p>}
        {user && (
          <>
            <p><span className="font-semibold">User:</span> {user.username}</p>
            <p><span className="font-semibold">Mode:</span> {securityMode}</p>
            <p className="text-xs text-slate-500 break-all">Token: {token}</p>
          </>
        )}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-3">Recent API Metrics</h3>
        <div className="space-y-2 text-sm">
          {metrics.slice(0, 8).map((m, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span>{m.method} {m.path}</span>
              <span className="badge">{m.durationMs} ms</span>
            </div>
          ))}
          {metrics.length === 0 && <p className="text-slate-500">No metrics yet.</p>}
        </div>
      </div>
    </section>
  );
}
