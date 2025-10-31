import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/pages/Home";
import GameDetail from "./components/pages/GameDetail";
import Profile from "./components/pages/Profile";
import Wishlist from "./components/pages/Wishlist";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Buy from "./components/pages/Buy";
import NotFound from "./components/pages/NotFound";
import CartButton from "./components/shared/CartButton";
import UserButton from "./components/shared/UserButton";

const LOCAL_GAMES = [/* your LOCAL_GAMES data here */];

export default function App() {
  const [games, setGames] = useState(LOCAL_GAMES);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/games.json");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setGames(Array.isArray(data) ? data : LOCAL_GAMES);
      } catch {
        setGames(LOCAL_GAMES);
      }
    })();
  }, []);

  const addToCart = (game) => setCart((prev) => [...prev, game]);

  return (
    <Router>
      <div className="bg-gray-900 text-gray-100 min-h-screen">
        <header className="flex justify-between items-center px-8 py-4 bg-gray-800">
          <Link to="/" className="text-3xl font-bold text-indigo-400">GameHub</Link>
          <div className="flex items-center gap-4">
            <CartButton cart={cart} />
            <UserButton />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home games={games} addToCart={addToCart} />} />
          <Route path="/game/:id" element={<GameDetail games={games} addToCart={addToCart} />} />
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
