import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, LibraryBig, Star } from "lucide-react";
import { useStoredUser } from "../lib/authStorage";
import { getGameGenre } from "../lib/gameUtils";
import { useLibrary } from "./libraryContext";

export function Library() {
  const navigate = useNavigate();
  const user = useStoredUser();
  const { ownedGames, isLoading } = useLibrary();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 transition-colors hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </button>

        <div className="mb-8 flex items-center gap-3">
          <LibraryBig className="h-8 w-8 text-orange-400" />
          <h1 className="text-4xl font-bold">Your Library</h1>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-300">
            Syncing your library...
          </div>
        ) : ownedGames.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="mb-3 text-2xl font-semibold">Your library is empty</h2>
            <p className="mb-6 text-slate-400">
              Buy some games from the store to add them to your library.
            </p>
            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-orange-600 px-6 py-3 transition-colors hover:bg-orange-700"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ownedGames.map((game) => (
              <div
                key={game.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors hover:border-orange-500/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={game.imageUrl || ""}
                    alt={game.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h2
                      onClick={() => navigate(`/game/${game.id}`)}
                      className="cursor-pointer text-xl font-semibold transition-colors hover:text-orange-400"
                    >
                      {game.title}
                    </h2>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">{game.rating || 0}</span>
                    </div>
                  </div>

                  <p className="mb-2 text-sm text-slate-400">{getGameGenre(game)}</p>
                  <p className="mb-4 text-sm text-slate-300">
                    {game.description || "Added to your Citrus library."}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {game.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-800 px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/game/${game.id}`)}
                    className="w-full rounded-lg bg-orange-600 py-3 font-medium transition-colors hover:bg-orange-700"
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
