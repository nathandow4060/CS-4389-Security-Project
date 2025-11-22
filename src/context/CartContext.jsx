// Ryan Cogley

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (game) => {
    setCart((prev) => {
      const existing = prev.find((g) => g.id === game.id);
      if (existing) {
        return prev.map((g) =>
          g.id === game.id ? { ...g, quantity: g.quantity + 1 } : g
        );
      }
      return [...prev, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((g) => {
          if (g.id === id) {
            if (g.quantity > 1) return { ...g, quantity: g.quantity - 1 };
            return null; // remove completely if quantity is 1
          }
          return g;
        })
        .filter(Boolean)
    );
  };

  const removeAllFromCart = (id) => {
    setCart((prev) => prev.filter((g) => g.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeAllFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
