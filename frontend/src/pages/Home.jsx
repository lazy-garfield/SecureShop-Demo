import React from "react";

export default function Home() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center pb-16">
      <div className="space-y-5">
        <span className="badge">Full-stack testing lab</span>
        <h1 className="text-4xl font-bold leading-tight">
          SecureShop Demo is your hands-on playground for functional, performance,
          and security testing.
        </h1>
        <p className="text-slate-600">
          Explore intentionally vulnerable endpoints alongside secure variants, run
          realistic user flows, and benchmark API response behavior with toggled
          delays and stress mode.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="card px-4 py-3">
            <p className="text-sm font-semibold">Functional Testing</p>
            <p className="text-xs text-slate-500">Login, cart, checkout simulation</p>
          </div>
          <div className="card px-4 py-3">
            <p className="text-sm font-semibold">Performance Testing</p>
            <p className="text-xs text-slate-500">Delay + stress toggles</p>
          </div>
          <div className="card px-4 py-3">
            <p className="text-sm font-semibold">Security Testing</p>
            <p className="text-xs text-slate-500">SQLi, XSS, broken auth</p>
          </div>
        </div>
      </div>
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Quick Start</h2>
        <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-1">
          <li>Run backend on port 4000 and frontend on port 5173.</li>
          <li>Login with demo / password123.</li>
          <li>Switch between Secure and Vulnerable modes in Testing Panel.</li>
        </ol>
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs">
          <p className="text-slate-400">Sample attacks</p>
          <p>SQLi: ' OR 1=1 --</p>
          <p>XSS: &lt;script&gt;alert('XSS')&lt;/script&gt;</p>
        </div>
      </div>
    </section>
  );
}
