import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, User, Star, Tag, Search } from "lucide-react";
import { clearStoredUser, useStoredUser } from "../lib/authStorage";
import { getGameGenre } from "../lib/gameUtils";
import { useCart } from "./cartContext";
import { useGames } from "./gamesContext";
import { useLibrary } from "./libraryContext";

export function Store() {
    const navigate = useNavigate();
    const { addToCart, getCartItemCount } = useCart();
    const { games, isLoading, error } = useGames();
    const { isGameOwned } = useLibrary();
    const user = useStoredUser();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const featuredGame = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

    const handleLogout = () => {
        clearStoredUser();
        navigate("/login");
    };

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

    const filteredGames = games.filter((game) => {
        const query = searchQuery.trim().toLowerCase();
        const genre = getGameGenre(game);

        const matchesSearch =
            query.length === 0 ||
            game.title.toLowerCase().includes(query) ||
            genre.toLowerCase().includes(query) ||
            (game.developer || "").toLowerCase().includes(query) ||
            game.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesQuickFilter =
            activeFilter === "all" ||
            (activeFilter === "sale" && !!game.originalPrice) ||
            (activeFilter === "new" &&
                game.tags.some((tag) => tag.toLowerCase() === "new"));

        const matchesMinPrice = minPrice === "" || game.price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || game.price <= Number(maxPrice);

        return matchesSearch && matchesQuickFilter && matchesMinPrice && matchesMaxPrice;
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-8">
                        <h1 className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
                            Citrus
                        </h1>

                        <nav className="hidden gap-6 md:flex">
                            <button
                                onClick={() => navigate("/")}
                                className="text-slate-300 transition-colors hover:text-white"
                            >
                                Store
                            </button>
                            <button
                                onClick={() => navigate("/library")}
                                className="text-slate-300 transition-colors hover:text-white"
                            >
                                Library
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games..."
                                className="w-64 rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm transition-colors focus:border-orange-500 focus:outline-none"
                            />
                        </div>

                        <button
                            onClick={() => navigate("/cart")}
                            aria-label={`Shopping cart, ${getCartItemCount()} items`}
                            title="Shopping cart"
                            className="relative rounded-lg p-2 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                            {getCartItemCount() > 0 && (
                                <span
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs"
                                    aria-hidden="true"
                                >
                                    {getCartItemCount()}
                                </span>
                            )}
                        </button>

                        {!user ? (
                            <button
                                onClick={() => navigate("/signup")}
                                className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 transition-colors hover:bg-orange-700"
                            >
                                <User className="h-4 w-4" />
                                Sign Up
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 transition-colors hover:bg-slate-700"
                                >
                                    <User className="h-4 w-4" />
                                    {user.username}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg bg-orange-600 px-4 py-2 transition-colors hover:bg-orange-700"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {isLoading && (
                    <section className="mx-auto max-w-7xl px-4 py-12">
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
                            Loading games...
                        </div>
                    </section>
                )}

                {error && !isLoading && (
                    <section className="mx-auto max-w-7xl px-4 py-12">
                        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-300">
                            {error}
                        </div>
                    </section>
                )}

                {!isLoading && !error && featuredGame && (
                    <section className="relative h-[500px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
                        <img
                            src={featuredGame.imageUrl || ""}
                            alt={featuredGame.title}
                            width={1200}
                            height={500}
                            loading="eager"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center">
                            <div className="mx-auto w-full max-w-7xl px-4">
                                <div className="max-w-xl">
                                    <p className="mb-3 text-sm uppercase tracking-[0.3em] text-orange-300">
                                        Featured Pick
                                    </p>
                                    <h2 className="mb-4 text-5xl font-bold">{featuredGame.title}</h2>
                                    <p className="mb-6 text-xl text-slate-300">
                                        {featuredGame.description ||
                                            "Explore the latest standout release in the Citrus catalog."}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() =>
                                                isGameOwned(featuredGame.id)
                                                    ? navigate("/library")
                                                    : handleAddToCart(featuredGame.id)
                                            }
                                            className={`rounded-lg px-8 py-3 transition-colors ${isGameOwned(featuredGame.id)
                                                    ? "bg-slate-700 hover:bg-slate-600"
                                                    : "bg-orange-600 hover:bg-orange-700"
                                                }`}
                                        >
                                            {isGameOwned(featuredGame.id)
                                                ? "In Library"
                                                : `Buy Now - $${featuredGame.price}`}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/game/${featuredGame.id}`)}
                                            className="rounded-lg bg-slate-800 px-8 py-3 transition-colors hover:bg-slate-700"
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {!isLoading && !error && (
                    <section className="mx-auto max-w-7xl px-4 py-12">
                        <div className="mb-8 flex flex-col gap-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-3xl font-bold">Featured Games</h3>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveFilter("all")}
                                        className={`rounded-xl px-4 py-2 text-sm transition-colors ${activeFilter === "all"
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                            }`}
                                    >
                                        All
                                    </button>

                                    <button
                                        onClick={() => setActiveFilter("sale")}
                                        className={`rounded-xl px-4 py-2 text-sm transition-colors ${activeFilter === "sale"
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                            }`}
                                    >
                                        On Sale
                                    </button>

                                    <button
                                        onClick={() => setActiveFilter("new")}
                                        className={`rounded-xl px-4 py-2 text-sm transition-colors ${activeFilter === "new"
                                                ? "bg-slate-800 text-white"
                                                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                            }`}
                                    >
                                        New
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="mr-1 text-sm font-medium text-slate-300">Price</div>

                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min"
                                        className="w-28 rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-8 pr-4 text-sm transition-colors focus:border-orange-500 focus:outline-none"
                                    />
                                </div>

                                <span className="text-sm text-slate-500">to</span>

                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max"
                                        className="w-28 rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-8 pr-4 text-sm transition-colors focus:border-orange-500 focus:outline-none"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setMinPrice("");
                                        setMaxPrice("");
                                    }}
                                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredGames.map((game) => {
                                const hasDiscount = !!game.originalPrice && game.originalPrice > game.price;
                                const discountPercent = hasDiscount
                                    ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)
                                    : 0;

                                return (
                                    <div
                                        key={game.id}
                                        className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:scale-105 hover:border-orange-500/50"
                                    >
                                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                                            <img
                                                src={game.imageUrl || ""}
                                                alt={game.title}
                                                width={400}
                                                height={225}
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                            />
                                            {hasDiscount && (
                                                <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-orange-600 px-2 py-1">
                                                    <Tag className="h-3 w-3" />
                                                    <span className="text-xs">{discountPercent}% OFF</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="mb-2 flex items-start justify-between gap-3">
                                                <h4
                                                    onClick={() => navigate(`/game/${game.id}`)}
                                                    className="cursor-pointer text-lg font-semibold transition-colors hover:text-orange-400"
                                                >
                                                    {game.title}
                                                </h4>
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="text-sm">{game.rating || 0}</span>
                                                </div>
                                            </div>

                                            <p className="mb-3 text-sm text-slate-400">{getGameGenre(game)}</p>

                                            <div className="mb-4 flex flex-wrap gap-1">
                                                {game.tags?.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded bg-slate-800 px-2 py-1 text-xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    {hasDiscount && (
                                                        <span className="text-sm text-slate-500 line-through">
                                                            ${game.originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                    <span className="text-xl font-bold text-orange-400">
                                                        ${game.price.toFixed(2)}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        isGameOwned(game.id)
                                                            ? navigate("/library")
                                                            : handleAddToCart(game.id)
                                                    }
                                                    className={`rounded-lg px-4 py-2 transition-colors ${isGameOwned(game.id)
                                                            ? "bg-slate-700 hover:bg-slate-600"
                                                            : "bg-orange-600 hover:bg-orange-700"
                                                        }`}
                                                >
                                                    {isGameOwned(game.id) ? "In Library" : "Add to Cart"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredGames.length === 0 && (
                            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
                                No games matched your filters.
                            </div>
                        )}
                    </section>
                )}
            </main>

            <footer className="mt-20 border-t border-slate-800">
                <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500">
                    © 2026 Citrus. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
