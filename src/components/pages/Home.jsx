import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx"; // adjust path if needed


export default function Home({ games }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const topSellers = games.filter(g => g.topSeller);
  const filteredGames = games.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const { addToCart } = useCart();


  useEffect(() => {
    if (!topSellers.length) return;
    const id = setInterval(() => setCarouselIndex(i => (i + 1) % topSellers.length), 4000);
    return () => clearInterval(id);
  }, [topSellers.length]);

  return (
    <main className="p-8">
      {/* Carousel */}
      {!!topSellers.length && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">🔥 Top Sellers</h2>
          <div className="relative w-full overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {topSellers.map(game => (
                <div key={game.id} className="min-w-full flex-shrink-0 relative">
                  <Link to={`/game/${game.id}`}>
                    <img src={game.img} alt={game.name} className="w-full h-64 object-cover" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search + Games Grid */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
        />
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">🎮 Game Catalogue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div key={game.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <Link to={`/game/${game.id}`}>
                <img src={game.img} alt={game.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{game.name}</h3>
                <p className="text-indigo-400 font-bold mt-2">${game.price}</p>
                <button
                  onClick={() => addToCart(game)}
                  className="bg-indigo-600 hover:bg-indigo-700 mt-3 px-3 py-1.5 rounded-lg w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
