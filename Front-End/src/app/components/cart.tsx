import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useStoredUser } from "../lib/authStorage";
import { getGameGenre } from "../lib/gameUtils";
import { useCart } from "./cartContext";

export function Cart() {
    const navigate = useNavigate();
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
    } = useCart();

    useEffect(() => {
        const storedUser = localStorage.getItem("user_data");

        if (!storedUser) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                  <img
                    src={item.game.imageUrl || ""}
                    alt={item.game.title}
                    className="h-36 w-full rounded-xl object-cover md:w-56"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="mb-2 text-2xl font-semibold">{item.game.title}</h2>
                      <p className="mb-2 text-slate-400">{getGameGenre(item.game)}</p>
                      <p className="text-sm text-slate-300">
                        {item.game.description || "Ready to add to your Citrus library."}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                          className="rounded-lg bg-slate-800 p-2 transition-colors hover:bg-slate-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="w-8 text-center text-lg font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                          className="rounded-lg bg-slate-800 p-2 transition-colors hover:bg-slate-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-orange-400">
                          ${(item.game.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.game.id)}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 transition-colors hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.game.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4"
                                >
                                    <img
                                        src={item.game.imageUrl}
                                        alt={item.game.title}
                                        className="w-full md:w-56 h-36 object-cover rounded-xl"
                                    />

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold mb-2">{item.game.title}</h2>
                                            <p className="text-slate-400 mb-2">{item.game.genre}</p>
                                            <p className="text-slate-300 text-sm">{item.game.description}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>

                                                <span className="text-lg font-medium w-8 text-center">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-bold text-orange-400">
                                                    ${(item.game.price * item.quantity).toFixed(2)}
                                                </span>

                                                <button
                                                    onClick={() => removeFromCart(item.game.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

                            <div className="flex justify-between text-slate-300 mb-3">
                                <span>Items</span>
                                <span>{getCartItemCount()}</span>
                            </div>

                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-orange-400">${getCartTotal().toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
