import React, { useState, useEffect } from "react";
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
   
  );
}
