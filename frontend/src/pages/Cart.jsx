import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { requestWithLog } from "../api";
import api from "../api";

export default function Cart() {
  const { securityMode, token, setLastExchange } = useAuth();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const base = securityMode === "secure" ? "/secure" : "/vuln";

  async function loadCart() {
    if (!token) return;
    const res = await api.get(`${base}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(res.data);
  }

  useEffect(() => {
    loadCart();
  }, [securityMode, token]);

  async function checkout() {
    if (!token) return;
    await requestWithLog({
      method: "delete",
      url: `${base}/cart`,
      token,
      setLastExchange
    });
    setItems([]);
    setMessage("Checkout simulated. Cart cleared.");
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

  return (
    <section className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Cart</h2>
        {message && <span className="badge">{message}</span>}
      </div>

      {!token && (
        <div className="card p-6 text-sm text-slate-500">
          Please login to view your cart.
        </div>
      )}

      {token && (
        <div className="card p-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                  </div>
                  <span className="badge">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="font-semibold">Total</p>
            <span className="badge">${total}</span>
          </div>
          <button className="btn btn-primary w-full" onClick={checkout}>
            Simulate Checkout
          </button>
        </div>
      )}
    </section>
  );
}
