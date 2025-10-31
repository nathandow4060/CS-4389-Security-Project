import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function CartButton() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const total = cart.reduce((acc, g) => acc + (g.price * g.quantity || 0), 0);

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
            {cart.length ? (
              <>
                <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between bg-gray-700 rounded-lg px-3 py-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-lg font-semibold mb-4">Total: ${total.toFixed(2)}</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
                  >
                    Close
                  </button>
                  <Link
                    to="/buy"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center">Your cart is empty</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
