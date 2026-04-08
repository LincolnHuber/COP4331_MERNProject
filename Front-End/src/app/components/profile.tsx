import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, LibraryBig, ShoppingCart, LogOut } from "lucide-react";
import { useLibrary } from "./libraryContext";
import { useCart } from "./cartContext";

export function Profile() {
    const navigate = useNavigate();
    const { ownedGames } = useLibrary();
    const { getCartItemCount } = useCart();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user_data");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);
        setUsername(user.username);
        setEmail(user.email);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user_data");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-orange-600/10 rounded-full">
                            <User className="w-10 h-10 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">{username}</h1>
                            <p className="text-slate-400">{email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <LibraryBig className="w-6 h-6 text-orange-400" />
                                <h2 className="text-xl font-semibold">Library</h2>
                            </div>
                            <p className="text-3xl font-bold">{ownedGames.length}</p>
                            <p className="text-slate-400 text-sm mt-1">Owned games</p>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <ShoppingCart className="w-6 h-6 text-orange-400" />
                                <h2 className="text-xl font-semibold">Cart</h2>
                            </div>
                            <p className="text-3xl font-bold">{getCartItemCount()}</p>
                            <p className="text-slate-400 text-sm mt-1">Items in cart</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate("/library")}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium"
                        >
                            View Library
                        </button>

                        <button
                            onClick={() => navigate("/cart")}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-medium"
                        >
                            View Cart
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}