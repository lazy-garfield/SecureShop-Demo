import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card overflow-hidden">
      <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <span className="badge">${product.price}</span>
        </div>
        <p className="text-sm text-slate-600">{product.description}</p>
        <button className="btn btn-primary w-full" onClick={() => onAdd(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
