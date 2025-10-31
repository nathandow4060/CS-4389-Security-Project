import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await fetch("/api/games.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        const found = list.find((g) => g.id === Number(id));
        if (!found) throw new Error("Not found");
        if (ok) setGame(found);
      } catch (e) {
        if (ok) setErr(e.message || "Failed to load");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, [id]);

  const handleAddToCart = () => {
    addToCart(game);
    // Pop-up removed
  };

  if (loading) return <div className="p-8 text-gray-300">Loading…</div>;
  if (err) return <div className="p-8 text-red-400">Error: {err}</div>;

  return (
    <main className="p-6 max-w-5xl mx-auto text-gray-100">
      <Link to="/" className="text-indigo-400 hover:underline">
        &larr; Back
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-6 bg-gray-800 rounded-xl p-6 shadow-lg">
        <img
          src={game.img}
          alt={game.name}
          referrerPolicy="no-referrer"
          className="w-full object-contain rounded-lg"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="mt-2 text-gray-300">{game.description}</p>
            <p className="mt-4 text-2xl font-semibold text-indigo-400">
              ${Number(game.price).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
