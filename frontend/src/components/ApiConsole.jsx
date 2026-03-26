import React from "react";

export default function ApiConsole({ exchange }) {
  if (!exchange) {
    return (
      <div className="card p-4 text-sm text-slate-500">
        No API requests yet. Trigger an action to see the request/response log.
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Latest API Exchange</p>
        <span className="badge">{exchange.response.durationMs} ms</span>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2 text-sm">
        <div className="bg-slate-900 text-slate-100 rounded-xl p-3 overflow-auto">
          <p className="text-xs uppercase text-slate-400">Request</p>
          <pre className="whitespace-pre-wrap">
{JSON.stringify(exchange.request, null, 2)}
          </pre>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto">
          <p className="text-xs uppercase text-slate-500">Response</p>
          <pre className="whitespace-pre-wrap">
{JSON.stringify(exchange.response, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
