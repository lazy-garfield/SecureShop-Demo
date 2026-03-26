import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { securityMode } = useAuth();
  const navClass = ({ isActive }) =>
    isActive
      ? "text-ink font-semibold"
      : "text-slate-500 hover:text-ink";

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 py-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-ocean text-white flex items-center justify-center font-bold">
          SS
        </div>
        <div>
          <p className="font-bold text-lg">SecureShop Demo</p>
          <p className="text-xs text-slate-500">Testing-driven e-commerce lab</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5 text-sm">
        <NavLink className={navClass} to="/">Home</NavLink>
        <NavLink className={navClass} to="/login">Login</NavLink>
        <NavLink className={navClass} to="/products">Products</NavLink>
        <NavLink className={navClass} to="/cart">Cart</NavLink>
        <NavLink className={navClass} to="/profile">Profile</NavLink>
        <NavLink className={navClass} to="/testing">Admin/Test Panel</NavLink>
        <span className={`badge ${securityMode === "secure" ? "bg-lime-100 text-lime-700" : "bg-amber-100 text-amber-700"}`}>
          {securityMode === "secure" ? "Secure Mode" : "Vulnerable Mode"}
        </span>
      </div>
    </nav>
  );
}
