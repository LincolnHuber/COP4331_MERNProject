import { useNavigate, useParams } from "react-router";
import { Star, Tag, ShoppingCart, ArrowLeft } from "lucide-react";
import { games } from "../data/games";
import { useCart } from "./cartContext";
import { useLibrary } from "./libraryContext";

export function GameDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isGameOwned } = useLibrary();

    const game = games.find((g) => g.id === id);

    const handleAddToCart = (gameId: string) => {
        const storedUser = localStorage.getItem("user_data");

        if (!storedUser) {
            navigate("/signup");
            return;
        }

        if (isGameOwned(gameId)) {
            navigate("/library");
            return;
        }

        addToCart(gameId);
    };

    if (!game) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Game not found</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                    >
                        Back to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div>
                        <img
                            src={game.imageUrl}
                            alt={game.title}
                            className="w-full h-[500px] object-cover rounded-2xl border border-slate-800"
                        />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{game.title}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-lg font-medium">{game.rating}</span>
                            </div>
                            <span className="text-slate-400">{game.genre}</span>
                        </div>

                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            {game.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {game.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-sm text-slate-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            {game.originalPrice && (
                                <>
                                    <span className="text-slate-500 line-through text-lg">
                                        ${game.originalPrice}
                                    </span>
                                    <div className="flex items-center gap-1 bg-orange-600 px-2 py-1 rounded text-sm">
                                        <Tag className="w-3 h-3" />
                                        <span>
                                            {Math.round(
                                                ((game.originalPrice - game.price) / game.originalPrice) * 100
                                            )}
                                            % OFF
                                        </span>
                                    </div>
                                </>
                            )}
                            <span className="text-3xl font-bold text-orange-400">${game.price}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() =>
                                    isGameOwned(game.id)
                                        ? navigate("/library")
                                        : handleAddToCart(game.id)
                                }
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${isGameOwned(game.id)
                                        ? "bg-slate-700 hover:bg-slate-600"
                                        : "bg-orange-600 hover:bg-orange-700"
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {isGameOwned(game.id) ? "Already in Library" : "Add to Cart"}
                            </button>

                            <button
                                onClick={() => navigate("/cart")}
                                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors font-medium"
                            >
                                Go to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}