import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// fallback local data (same as /public/api/games.json)
const LOCAL_GAMES = [
  { id: 1, name: "Elden Ring", price: 59.99, topSeller: true, img: "/images/eldenring.jpg", description: "Open-world action RPG across the Lands Between." },
  { id: 2, name: "Starfield", price: 69.99, topSeller: true, img: "/images/starfield.jpg", description: "Bethesda’s space RPG focused on exploration and factions." },
  { id: 3, name: "Spider-Man 2", price: 59.99, topSeller: true, img: "/images/spiderman2.webp", description: "Swing through NYC as Peter and Miles with symbiote powers." },
  { id: 4, name: "Zelda Tears of the Kingdom", price: 69.99, topSeller: false, img: "/images/zelda.jpg", description: "Inventive sandbox adventure across Hyrule, skies, and depths." },
  { id: 5, name: "God of War Ragnarok", price: 59.99, topSeller: false, img: "/images/godofwar.avif", description: "Norse saga finale with weighty combat and emotional story." },
  { id: 6, name: "Cyberpunk 2077", price: 49.99, topSeller: false, img: "/images/cyberpunk.jpg", description: "First-person RPG set in neon-drenched Night City." }
];

function CartButton({ cart }) {
  const [open, setOpen] = useState(false);
  const total = cart.reduce((acc, g) => acc + (Number(g.price) || 0), 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
      >
        🛒 Cart
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cart.length}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Your Cart</h2>
            <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item, i) => (
                <li key={i} className="flex justify-between bg-gray-700 rounded-lg px-3 py-2">
                  <span>{item.name}</span>
                  <span>${Number(item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-semibold mb-4">Total ${total.toFixed(2)}</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700">
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GamesList() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [games, setGames] = useState(LOCAL_GAMES);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/games.json");
        if (!res.ok) throw new Error("bad status");
        const list = await res.json();
        setGames(Array.isArray(list) ? list : LOCAL_GAMES);
      } catch {
        setGames(LOCAL_GAMES);
      }
    })();
  }, []);

  const topSellers = games.filter((g) => g.topSeller);
  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!topSellers.length) return;
    const id = setInterval(() => setCarouselIndex((i) => (i + 1) % topSellers.length), 4000);
    return () => clearInterval(id);
  }, [topSellers.length]);

  const addToCart = (game) => setCart((prev) => [...prev, game]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-indigo-400">
          <Link to="/">GameVault</Link>
        </h1>
        <div className="flex items-center gap-3">
          {/* Profile Button */}
          <Link
            to="/profile"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium"
          >
            👤 Profile
          </Link>
          <CartButton cart={cart} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-8">
        {!!topSellers.length && (
          <section className="mb-10 relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">🔥 Top Sellers</h2>
            <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {topSellers.map((game) => (
                  <div key={game.id} className="min-w-full flex-shrink-0 relative">
                    <Link to={`/product/${game.id}`}>
                      <img src={game.img} alt={game.name} className="w-full h-64 object-cover" />
                    </Link>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-semibold">
                        <Link to={`/product/${game.id}`}>{game.name}</Link>
                      </h3>
                      <p className="text-indigo-400 font-bold">${Number(game.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* GAME CATALOGUE */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">🎮 Game Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-indigo-500/50 transform transition hover:-translate-y-2 hover:scale-105"
              >
                <Link to={`/product/${game.id}`}>
                  <img src={game.img} alt={game.name} className="w-full h-48 object-cover" />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    <Link to={`/product/${game.id}`}>{game.name}</Link>
                  </h3>
                  <p className="text-sm text-gray-400">Product ID {game.id}</p>
                  <p className="text-indigo-400 font-bold mt-2">${Number(game.price).toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(game)}
                    className="bg-indigo-600 hover:bg-indigo-700 mt-3 px-3 py-1.5 rounded-lg text-sm font-medium w-full"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}