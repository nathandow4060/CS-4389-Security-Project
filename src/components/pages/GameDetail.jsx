import React from "react";
import { useParams, Link } from "react-router-dom";

export default function GameDetail({ games, addToCart }) {
  const { id } = useParams();
  const game = games.find(g => g.id === Number(id));

  if (!game) return <p className="p-8 text-center">Game not found.</p>;

  return (
    <div className="p-8">
      <img src={game.img} alt={game.name} className="w-full max-w-lg mx-auto rounded-xl" />
      <h2 className="text-3xl font-bold mt-4 text-center">{game.name}</h2>
      <p className="text-center text-gray-400 mt-2">{game.description}</p>
      <p className="text-center text-indigo-400 text-xl mt-4">${game.price}</p>
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => addToCart(game)}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg"
        >
          Add to Cart
        </button>
        <Link to="/" className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg">
          Back
        </Link>
      </div>
    </div>
  );
}
