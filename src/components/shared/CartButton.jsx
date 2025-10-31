import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function CartButton() {
  const { cart, removeFromCart, removeAllFromCart } = useCart();
  const [open, setOpen] = useState(false);

  const total = cart.reduce((acc, g) => acc + g.price * g.quantity, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
      >
        🛒 Cart
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cart.reduce((sum, g) => sum + g.quantity, 0)}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Your Cart</h2>

            {cart.length ? (
              <>
                <ul className="space-y-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 items-center bg-gray-700 rounded-lg p-3"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-indigo-400 font-bold">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>

                      {item.quantity > 1 ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                          >
                            Remove One
                          </button>
                          <button
                            onClick={() => removeAllFromCart(item.id)}
                            className="px-2 py-1 rounded-lg bg-red-800 hover:bg-red-900 text-white"
                          >
                            Remove All
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => removeAllFromCart(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                <p className="text-lg font-semibold mt-4">Total: ${total.toFixed(2)}</p>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Close
                  </button>
                  <Link
                    to="/buy"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <p>Your cart is empty</p>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
                >
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
