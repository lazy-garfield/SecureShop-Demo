import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useAuth } from "../context/AuthContext";
import api, { requestWithLog } from "../api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { securityMode, token, setLastExchange } = useAuth();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const base = securityMode === "secure" ? "/secure" : "/vuln";

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  async function addToCart(product) {
    setMessage("");
    if (!token) {
      setMessage("Login required to add to cart.");
      return;
    }
    await requestWithLog({
      method: "post",
      url: `${base}/cart`,
      data: { productId: product.id, qty: 1 },
      token,
      setLastExchange
    });
    setMessage(`${product.name} added to cart.`);
  }

  async function loadComments(productId) {
    const res = await api.get(`${base}/comments/${productId}`);
    setComments(res.data);
  }

  async function submitComment(e) {
    e.preventDefault();
    setMessage("");
    if (!token) {
      setMessage("Login required to comment.");
      return;
    }
    await requestWithLog({
      method: "post",
      url: `${base}/comments`,
      data: { productId: selected.id, content: comment },
      token,
      setLastExchange
    });
    setComment("");
    await loadComments(selected.id);
  }

  return (
    <section className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-slate-500">
            Click a product to inspect reviews and try XSS payloads.
          </p>
        </div>
        {message && <span className="badge">{message}</span>}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} onClick={() => { setSelected(product); loadComments(product.id); }}>
            <ProductCard product={product} onAdd={addToCart} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Reviews: {selected.name}</h3>
            <span className="badge">{securityMode}</span>
          </div>
          <form onSubmit={submitComment} className="flex flex-wrap gap-3">
            <input
              className="flex-1 min-w-[220px] px-3 py-2 rounded-xl border border-slate-200"
              placeholder="Leave a review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-primary">Post</button>
          </form>
          <div className="space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-slate-500">No comments yet.</p>
            )}
            {comments.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-3">
                {securityMode === "vulnerable" ? (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  <div>{DOMPurify.sanitize(item.content)}</div>
                )}
                <p className="text-xs text-slate-400 mt-1">{item.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
