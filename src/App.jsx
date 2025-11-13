import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { getProducts } from "./api.js";

// Page components
import Home from "./components/pages/Home";
import GameDetail from "./components/pages/GameDetail";
import Profile from "./components/pages/Profile";
import Wishlist from "./components/pages/Wishlist";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Buy from "./components/pages/Buy";
import NotFound from "./components/pages/NotFound";

// Shared components
import CartButton from "./components/shared/CartButton";
import UserButton from "./components/shared/UserButton";

// Fallback data (optional)
const LOCAL_GAMES = [
  { id: 1, name_of_product: "Elden Ring", price: 59.99, topSeller: true, img_url: "/images/eldenring.jpg" },
  { id: 2, name_of_product: "Starfield", price: 69.99, topSeller: true, img_url: "/images/starfield.jpg" },
  { id: 3, name_of_product: "Spider-Man 2", price: 59.99, topSeller: true, img_url: "/images/spiderman2.webp" },
  { id: 4, name_of_product: "Zelda: Tears of the Kingdom", price: 69.99, topSeller: false, img_url: "/images/zelda.jpg" },
  { id: 5, name_of_product: "God of War: Ragnarok", price: 59.99, topSeller: false, img_url: "/images/godofwar.avif" },
  { id: 6, name_of_product: "Cyberpunk 2077", price: 49.99, topSeller: false, img_url: "/images/cyberpunk.jpg" },
];

export default function App() {
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");


  useEffect(() => {
  let ok = true;
  (async () => {
    try {
      const data = await getProducts();
      if (ok) {
        if (!data || !data.length) {
          console.warn("Empty product list — using fallback data.");
          setGames(LOCAL_GAMES);
        } else {
          setGames(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
      if (ok) {
        setErr("Failed to load products — showing fallback data.");
        setGames(LOCAL_GAMES);
      }
    } finally {
      if (ok) setLoading(false);
    }
  })();
  return () => { ok = false; };
}, []);


  const addToCart = (game) => setCart((prev) => [...prev, game]);

  // Optional: Show global loading/error UI
  if (loading) return <div className="p-8 text-gray-300">Loading…</div>;
  if (err) console.warn(err);

  return (
    <Router>
      <div className="bg-gray-900 text-gray-100 min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4 bg-gray-800">
          <Link to="/" className="text-3xl font-bold text-indigo-400">
            GameHub
          </Link>
          <div className="flex items-center gap-4">
            <CartButton cart={cart} />
            <UserButton />
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home games={games}} />} />
          <Route path="/game/:id" element={<GameDetail games={games}} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
