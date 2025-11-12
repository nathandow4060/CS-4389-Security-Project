import { getProducts } from "./api.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* fallback local data (same as /public/api/games.json)
const LOCAL_GAMES = [
  { id: 1, name: "Elden Ring", price: 59.99, topSeller: true,  img: "/images/eldenring.jpg",  description: "Open-world action RPG across the Lands Between." },
  { id: 2, name: "Starfield",  price: 69.99, topSeller: true,  img: "/images/starfield.jpg",   description: "Bethesda’s space RPG focused on exploration and factions." },
  { id: 3, name: "Spider-Man 2", price: 59.99, topSeller: true, img: "/images/spiderman2.webp", description: "Swing through NYC as Peter and Miles with symbiote powers." },
  { id: 4, name: "Zelda Tears of the Kingdom", price: 69.99, topSeller: false, img: "/images/zelda.jpg", description: "Inventive sandbox adventure across Hyrule, skies, and depths." },
  { id: 5, name: "God of War Ragnarok", price: 59.99, topSeller: false, img: "/images/godofwar.avif", description: "Norse saga finale with weighty combat and emotional story." },
  { id: 6, name: "Cyberpunk 2077", price: 49.99, topSeller: false, img: "/images/cyberpunk.jpg", description: "First-person RPG set in neon-drenched Night City." }
];
*/

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

function UserButton() {
  const [open, setOpen] = useState(false);        // dropdown toggle
  const [loggedIn, setLoggedIn] = useState(false); // mock login state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  // form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Mock login/register (no backend yet)
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      alert("Please fill out all fields");
      return;
    }
    setLoggedIn(true);
    setUser({ username: loginData.email.split("@")[0], email: loginData.email });
    setShowLogin(false);
    setOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { username, email, password, confirm } = registerData;
    if (!username || !email || !password || !confirm) {
      alert("Please fill out all fields");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    setLoggedIn(true);
    setUser({ username, email });
    setShowRegister(false);
    setOpen(false);
    alert("Registration successful!");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Main account button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
      >
        👤 {loggedIn && user ? user.username : "Account"}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {loggedIn ? (
            <>
              <button
                onClick={() => { alert("Profile page coming soon!"); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg"
              >
                Profile
              </button>
              <button
                onClick={() => { alert("Orders page coming soon!"); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Orders
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setShowLogin(true); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg"
              >
                Log In
              </button>
              <button
                onClick={() => { setShowRegister(true); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-b-lg"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirm}
                onChange={(e) => setRegisterData({ ...registerData, confirm: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



export default function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [games, setGames] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const products = await getProducts();
        console.log(products); // inspect in the console
        setGames(products);
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
        setGames([]); // fallback: empty array instead of LOCAL_GAMES
        //setGames(LOCAL_GAMES);
      }
    })();
  }, []);

  const topSellers = games.filter((g) => g.topSeller);
  const filteredGames = games.filter((g) =>
    g.name_of_product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!topSellers.length) return;
    const id = setInterval(() => setCarouselIndex((i) => (i + 1) % topSellers.length), 4000);
    return () => clearInterval(id);
  }, [topSellers.length]);

  const addToCart = (game) => setCart((prev) => [...prev, game]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800">
        <Link to="/" className="text-3xl font-bold text-indigo-400">GameHub</Link>
        <div className="flex items-center gap-4">
          <CartButton cart={cart} />
          <UserButton />
        </div>
      </header>

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
                      <img src={game.img_url} alt={game.name_of_product} className="w-full h-64 object-cover" />
                    </Link>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-semibold">
                        <Link to={`/product/${game.id}`}>{game.name_of_product}</Link>
                      </h3>
                      <p className="text-indigo-400 font-bold">${Number(game.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">🎮 Game Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-indigo-500/50 transform transition hover:-translate-y-2 hover:scale-105"
              >
                <Link to={`/product/${game.id}`}>
                  <img src={game.img_url} alt={game.name_of_product} className="w-full h-48 object-cover" />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    <Link to={`/product/${game.id}`}>{game.name_of_product}</Link>
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

