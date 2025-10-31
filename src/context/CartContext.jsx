import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
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
    setCart((prev) => {
      const existing = prev.find((g) => g.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((g) => g.id !== id);
      return prev.map((g) =>
        g.id === id ? { ...g, quantity: g.quantity - 1 } : g
      );
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
