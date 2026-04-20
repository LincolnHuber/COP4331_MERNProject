import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useCart } from "./cartContext";
import { useLibrary } from "./libraryContext";

export function Checkout() {
    const navigate = useNavigate();
    const { cart, clearCart, getCartTotal } = useCart();
    const { addGamesToLibrary } = useLibrary();

    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState("");

    const subtotal = getCartTotal();
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    const handleCardNumberChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
        const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
        setCardNumber(formatted);
    };

    const handleExpirationDateChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 4);

        if (digitsOnly.length <= 2) {
            setExpirationDate(digitsOnly);
        } else {
            setExpirationDate(`${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`);
        }
    };

    const handleCvvChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
        setCvv(digitsOnly);
    };

    const handlePurchase = () => {
        setError("");

        if (!cardholderName.trim()) {
            setError("Please enter the cardholder name");
            return;
        }

        if (cardNumber.replace(/\s/g, "").length !== 16) {
            setError("Card number must be 16 digits");
            return;
        }

        if (expirationDate.length !== 5) {
            setError("Expiration date must be in MM/YY format");
            return;
        }

        const [month] = expirationDate.split("/");
        const monthNumber = Number(month);

        if (!month || monthNumber < 1 || monthNumber > 12) {
            setError("Please enter a valid expiration month");
            return;
        }

        if (cvv.length !== 3) {
            setError("CVV must be 3 digits");
            return;
        }

        const gameIds = cart.map((item) => item.game.id);
        addGamesToLibrary(gameIds);
        clearCart();
        navigate("/library");
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                    >
                        Back to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/cart")}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                </button>

                <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="w-6 h-6 text-orange-400" />
                            <h2 className="text-2xl font-semibold">Payment Details</h2>
                        </div>

                        <div className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-300">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder="Enter cardholder name"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-300">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={cardNumber}
                                    onChange={(e) => handleCardNumberChange(e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-300">
                                        Expiration Date
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={expirationDate}
                                        onChange={(e) => handleExpirationDateChange(e.target.value)}
                                        placeholder="MM/YY"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-300">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={cvv}
                                        onChange={(e) => handleCvvChange(e.target.value)}
                                        placeholder="123"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
                                This is a demo checkout UI for the project. No real payment is processed.
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item.game.id} className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium">{item.game.title}</p>
                                        <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-orange-400">
                                        ${(item.game.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-3">
                            <div className="flex justify-between text-slate-300">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-orange-400">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePurchase}
                            className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Complete Purchase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}