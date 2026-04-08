import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "./cartContext";
import { useLibrary } from "./libraryContext";



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

    const { addGamesToLibrary } = useLibrary();

    const handleCheckout = () => {
        const gameIds = cart.map((item) => item.game.id);
        addGamesToLibrary(gameIds);
        clearCart();
        navigate("/library");
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <ShoppingCart className="w-8 h-8 text-orange-400" />
                    <h1 className="text-4xl font-bold">Your Cart</h1>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                        <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
                        <p className="text-slate-400 mb-6">Add some games from the store to get started.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                        >
                            Browse Games
                        </button>
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
                                onClick={handleCheckout}
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