import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import "./index.css"; 

import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamesList from "./components/pages/GamesList.jsx";
import GameDetail from "./components/pages/GameDetail.jsx";
import Profile from "./components/pages/Profile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/product/:id" element={<GameDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
=======
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
>>>>>>> ba582f12a7958d9acb102e17983cc1d9ae9e7610
  </React.StrictMode>
);
