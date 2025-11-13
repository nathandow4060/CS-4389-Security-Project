import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function GameDetail({ games }) {
  const { id } = useParams();
  const { addToCart } = useCart();

  // route param is string, ids may be numbers -> normalize both
  const game = games.find((g) => String(g.id) === String(id));

  if (!game) {
    return (
      <div className="p-8 text-red-400 text-center">
        Game not found.
        <br />
        <Link to="/" className="text-indigo-400 underline">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto text-gray-100">
      <Link to="/" className="text-indigo-400 hover:underline">
        &larr; Back
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-6 bg-gray-800 rounded-xl p-6 shadow-lg">
        <img
          src={game.image_url}
          alt={game.name_of_product}
          className="w-full object-contain rounded-lg"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{game.name_of_product}</h1>

            {game.description && (
              <p className="mt-2 text-gray-300">{game.description}</p>
            )}

            <p className="mt-4 text-2xl font-semibold text-indigo-400">
              ${Number(game.price).toFixed(2)}
            </p>
          </div>

          <button
            onClick={() => addToCart(game)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
