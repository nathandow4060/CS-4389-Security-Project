import React from "react";
import ReactDOM from "react-dom/client";
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
  </React.StrictMode>
);
