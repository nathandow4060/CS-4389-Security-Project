import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import GamesList from './pages/GamesList';
import GameDetails from './pages/GameDetails';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;