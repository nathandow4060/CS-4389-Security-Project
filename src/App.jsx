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
  );
}
