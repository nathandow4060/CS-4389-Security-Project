import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return alert("Please fill out all fields");
    setLoggedIn(true);
    setUser({ username: loginData.email.split("@")[0], email: loginData.email });
    setShowLogin(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { username, email, password, confirm } = registerData;
    if (!username || !email || !password || !confirm) return alert("Please fill out all fields");
    if (password !== confirm) return alert("Passwords do not match");
    setLoggedIn(true);
    setUser({ username, email });
    setShowRegister(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
      >
        👤 {loggedIn && user ? user.username : "Account"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {loggedIn ? (
            <>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => {
                  navigate("/profile"); // Navigate to profile
                  setOpen(false);       // Close dropdown
                }}
              >
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">Orders</button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setShowLogin(true); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Log In
              </button>
              <button
                onClick={() => { setShowRegister(true); setOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
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
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowLogin(false)} className="px-4 py-2 bg-gray-600 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg text-white">
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
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirm}
                onChange={(e) => setRegisterData({ ...registerData, confirm: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowRegister(false)} className="px-4 py-2 bg-gray-600 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg text-white">
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
