import { getProducts } from "./api.js";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "./api.js";

export default function ProductPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
  let ok = true;

  (async () => {
    try {
      const product = await getProductById(id); // already JSON and handeled in api.js
      console.log("Product from API (PDP):", product);
      if (ok) setGame(product);
    } catch (e) {
      if (ok) setErr(e.message || "Failed to load product");
    } finally {
      if (ok) setLoading(false);
    }
  })();

  return () => {
    ok = false;
  };
}, [id]);

  const handleBuy = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ id: game.id, name: game.name_of_product, price: game.price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${game.name} added to cart`);
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
          src={game.img_url}
          alt={game.name_of_product}
          referrerPolicy="no-referrer"
          className="w-full h-72 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{game.name_of_product}</h1>
          <p className="mt-2 text-gray-300">{game.description}</p>
          <p className="mt-4 text-2xl font-semibold text-indigo-400">
            ${Number(game.price).toFixed(2)}
          </p>
          <button
            onClick={handleBuy}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-medium"
          >
            Buy
          </button>
        </div>
      </div>
    </main>
  );
}
