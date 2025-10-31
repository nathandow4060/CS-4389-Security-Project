import React, { useState } from "react";
import { useCart } from "../../context/CartContext.jsx";

export default function Checkout() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState("");
  const [success, setSuccess] = useState(false);

  // Luhn Algorithm to validate card number
  const validateCard = (num) => {
    const digits = num.replace(/\D/g, "").split("").reverse().map(Number);
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let d = digits[i];
      if (i % 2 === 1) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
    }
    return sum % 10 === 0;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!validateCard(cardNumber)) return alert("Invalid card number");
    clearCart();
    setSuccess(true);
  };

  if (success) return <h2 className="p-8 text-center text-2xl text-green-400">✅ Payment Successful!</h2>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6 space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between bg-gray-800 p-3 rounded-lg">
                <span>{item.name}</span>
                <div className="flex gap-4">
                  <span>${Number(item.price).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-lg font-semibold mb-6">Total: ${total.toFixed(2)}</p>

          <form onSubmit={handlePayment} className="max-w-sm mx-auto flex flex-col gap-4">
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Place Order
            </button>
          </form>
        </>
      )}
    </main>
  );
}
