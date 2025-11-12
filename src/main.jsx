import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import PDP from "./PDP.jsx";
import Buy from "./components/pages/Buy.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/product/:id" element={<PDP />} />
          <Route path="/Buy" element={<Buy />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
