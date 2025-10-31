import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartButton({ cart }) {
  const [open, setOpen] = useState(false);
  const total = cart.reduce((acc, g) => acc + (Number(g.price) || 0), 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setOpen(false);    // Close the cart overlay
    navigate("/Buy");  // Go to the buy page
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
      >
        🛒 Cart
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cart.length}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Your Cart</h2>
            <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item, i) => (
                <li key={i} className="flex justify-between bg-gray-700 rounded-lg px-3 py-2">
                  <span>{item.name}</span>
                  <span>${Number(item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-semibold mb-4">Total ${total.toFixed(2)}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleCheckout}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
