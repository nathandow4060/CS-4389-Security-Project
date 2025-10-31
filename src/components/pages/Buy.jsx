import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState("");

  const total = cart.reduce((acc, g) => acc + Number(g.price || 0), 0);

  function isValidCardNumber(value) {
    const num = value.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardNumber || !isValidCardNumber(cardNumber)) {
      return alert("Please enter a valid card number");
    }
    alert("Payment successful!");
    clearCart();
  };

  if (!cart.length) return (
    <div className="p-8 text-center text-gray-100">
      <h2 className="text-2xl mb-4">Your cart is empty</h2>
      <Link to="/" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white">
        ← Back to Home
      </Link>
    </div>
  );

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid gap-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-xl shadow-lg flex items-center gap-4 p-4">
            <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-indigo-400 font-bold">${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <p className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</p>

      <form onSubmit={handlePayment} className="flex flex-col max-w-md mx-auto gap-4">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white">
          Pay Now
        </button>
      </form>

      <div className="text-center mt-6">
        <Link to="/" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
