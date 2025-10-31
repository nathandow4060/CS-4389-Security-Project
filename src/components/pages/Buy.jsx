import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function Buy() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((acc, g) => acc + g.price * g.quantity, 0);

  // Luhn Algorithm
  const isValidCard = (number) => {
    if (!number) return false;
    const digits = number.replace(/\D/g, "").split("").reverse().map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let d = digits[i];
      if (i % 2 === 1) d *= 2;
      if (d > 9) d -= 9;
      sum += d;
    }
    return sum % 10 === 0;
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    if (!name || !cardNumber) return alert("Please enter your name and card number");
    if (!isValidCard(cardNumber)) return alert("Invalid card number");
    setSuccess(true);
    clearCart();
  };

  if (!cart.length) {
    return (
      <main className="p-8 bg-gray-900 min-h-screen text-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-center">Your cart is empty</h2>
        <p className="text-gray-400 mb-6 text-center">Add some games to your cart to see them here!</p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">Checkout</h2>

      {success ? (
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-green-400 mb-4">Purchase Successful! 🎉</h3>
          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">Your Cart</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
                  <img src={item.img} alt={item.name} className="w-full h-40 object-cover"/>
                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-indigo-400 font-bold">${item.price} × {item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                      Remove One
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xl font-semibold mt-4">Total: ${total.toFixed(2)}</p>
          </div>

          {/* Payment Form */}
          <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Payment Info</h3>
            <form onSubmit={handlePurchase} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name on Card"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Complete Purchase
              </button>
            </form>
            <Link
              to="/"
              className="mt-4 inline-block px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
