import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-500">
          GameVault
        </Link>
         <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/games" className="text-gray-300 hover:text-white">Games</Link>
          <Link to="/wishlist" className="text-gray-300 hover:text-white">Wishlist</Link>
          <Link to="/checkout" className="text-gray-300 hover:text-white">Buy</Link>
          <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
          <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;