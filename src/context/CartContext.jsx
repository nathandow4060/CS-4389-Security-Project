import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    // Check if item already exists
    const index = cart.findIndex((g) => g.id === item.id);
    if (index > -1) {
      // Increase quantity
      const newCart = [...cart];
      newCart[index].quantity += 1;
      setCart(newCart);
    } else {
      // Add new item with quantity
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const index = cart.findIndex((g) => g.id === id);
    if (index > -1) {
      const newCart = [...cart];
      if (newCart[index].quantity > 1) {
        newCart[index].quantity -= 1;
      } else {
        newCart.splice(index, 1);
      }
      setCart(newCart);
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
