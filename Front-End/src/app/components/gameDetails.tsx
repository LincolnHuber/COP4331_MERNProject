import { useNavigate, useParams } from "react-router";
import { Star, Tag, ShoppingCart, ArrowLeft } from "lucide-react";
import { useStoredUser } from "../lib/authStorage";
import { getGameDiscountPercentage, getGameGenre } from "../lib/gameUtils";
import { useCart } from "./cartContext";
import { useGames } from "./gamesContext";
import { useLibrary } from "./libraryContext";

export function GameDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useStoredUser();
  const { addToCart } = useCart();
  const { isGameOwned } = useLibrary();
  const { getGameById, isLoading } = useGames();

  const game = id ? getGameById(id) : undefined;
  const discount = game ? getGameDiscountPercentage(game) : 0;

  const handleAddToCart = (gameId: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (isGameOwned(gameId)) {
      navigate("/library");
      return;
    }

    addToCart(gameId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Loading game...</h1>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Game not found</h1>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-orange-600 px-4 py-2 transition-colors hover:bg-orange-700"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 transition-colors hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-2">
          <div>
            <img
              src={game.imageUrl || ""}
              alt={game.title}
              className="h-[500px] w-full rounded-2xl border border-slate-800 object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{game.title}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-medium">{game.rating || 0}</span>
              </div>
              <span className="text-slate-400">{getGameGenre(game)}</span>
              {game.developer && (
                <span className="text-slate-500">by {game.developer}</span>
              )}
            </div>

            <p className="mb-6 text-lg leading-relaxed text-slate-300">
              {game.description || "Game description is not available yet."}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-8 flex items-center gap-3">
              {game.originalPrice && (
                <>
                  <span className="text-lg text-slate-500 line-through">
                    ${game.originalPrice.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <div className="flex items-center gap-1 rounded bg-orange-600 px-2 py-1 text-sm">
                      <Tag className="h-3 w-3" />
                      <span>{discount}% OFF</span>
                    </div>
                  )}
                </>
              )}
              <span className="text-3xl font-bold text-orange-400">
                ${game.price.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() =>
                  isGameOwned(game.id)
                    ? navigate("/library")
                    : handleAddToCart(game.id)
                }
                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors ${
                  isGameOwned(game.id)
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {isGameOwned(game.id) ? "Already in Library" : "Add to Cart"}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 font-medium transition-colors hover:bg-slate-800"
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
