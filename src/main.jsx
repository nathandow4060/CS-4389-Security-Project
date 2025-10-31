import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import PDP from "./PDP.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} /> {/* <-- use /* so App handles subroutes */}
        <Route path="/product/:id" element={<PDP />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
