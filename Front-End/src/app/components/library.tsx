import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, LibraryBig, Star } from "lucide-react";
import { useLibrary } from "./libraryContext";

export function Library() {
    const navigate = useNavigate();
    const { ownedGames } = useLibrary();

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
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <LibraryBig className="w-8 h-8 text-orange-400" />
                    <h1 className="text-4xl font-bold">Your Library</h1>
                </div>

                {ownedGames.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                        <h2 className="text-2xl font-semibold mb-3">Your library is empty</h2>
                        <p className="text-slate-400 mb-6">
                            Buy some games from the store to add them to your library.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                        >
                            Browse Games
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownedGames.map((game) => (
                            <div
                                key={game.id}
                                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-colors"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h2
                                            onClick={() => navigate(`/game/${game.id}`)}
                                            className="text-xl font-semibold cursor-pointer hover:text-orange-400 transition-colors"
                                        >
                                            {game.title}
                                        </h2>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm">{game.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-2">{game.genre}</p>
                                    <p className="text-slate-300 text-sm mb-4">{game.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {game.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-slate-800 text-xs rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/game/${game.id}`)}
                                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium"
                                    >
                                        View Game
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}