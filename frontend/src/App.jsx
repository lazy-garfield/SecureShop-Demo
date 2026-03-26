import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import TestingPanel from "./pages/TestingPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-6xl mx-auto px-6">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/testing" element={<TestingPanel />} />
        </Routes>
      </div>
    </div>
  );
}
