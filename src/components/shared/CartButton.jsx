import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, removeAllFromCart } = useCart();
  const total = cart.reduce((acc, g) => acc + (g.price * g.quantity || 0), 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
      >
        🛒 Cart
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cart.reduce((acc, g) => acc + g.quantity, 0)}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400 text-center">Your Cart</h2>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center gap-4 text-gray-200">
                <p className="text-center">Your cart is empty</p>
                <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white"
                  >
                    Close
                  </button>
              </div>
            ) : (
              <>
                <ul className="space-y-2 max-h-60 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between items-center bg-gray-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-3">
                        <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded"/>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-indigo-400 font-bold">${item.price} × {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {item.quantity > 1 ? (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                              Remove One
                            </button>
                            <button
                              onClick={() => removeAllFromCart(item.id)}
                              className="px-2 py-1 bg-red-800 hover:bg-red-900 text-white rounded"
                            >
                              Remove All
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => removeAllFromCart(item.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="text-lg font-semibold text-right mb-4">Total: ${total.toFixed(2)}</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white"
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
            )}
          </div>
        </div>
      )}
    </>
  );
}
