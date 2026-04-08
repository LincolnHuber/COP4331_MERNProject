import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, User, Star, Tag, Search } from "lucide-react";
import { games } from "../data/games";
import { useCart } from "./cartContext";
import { useLibrary } from "./libraryContext";

export function Store() {
  const navigate = useNavigate();
  const { addToCart, getCartItemCount } = useCart();
  const { isGameOwned } = useLibrary();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  const handleAddToCart = (gameId: string) => {
    if (!isLoggedIn) {
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
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "sale" && !!game.originalPrice) ||
      (activeFilter === "new" && game.tags.some((tag) => tag.toLowerCase() === "new"));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Citrus
            </h1>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Store
              </button>
              <button
                onClick={() => navigate("/library")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Library
              </button>
              <button
                onClick={() => navigate("/community")}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Community
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              />
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Sign Up
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  {username}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        <img
          src={games[5].imageUrl}
          alt="Featured game"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <h2 className="text-5xl font-bold mb-4">{games[5].title}</h2>
              <p className="text-xl text-slate-300 mb-6">{games[5].description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    isGameOwned(games[5].id)
                      ? navigate("/library")
                      : handleAddToCart(games[5].id)
                  }
                  className={`px-8 py-3 rounded-lg transition-colors ${isGameOwned(games[5].id)
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-orange-600 hover:bg-orange-700"
                    }`}
                >
                  {isGameOwned(games[5].id) ? "In Library" : `Buy Now - $${games[5].price}`}
                </button>
                <button
                  onClick={() => navigate(`/game/${games[5].id}`)}
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold">Featured Games</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${activeFilter === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
            >
              All
            </button>

            <button
              onClick={() => setActiveFilter("sale")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${activeFilter === "sale"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
            >
              On Sale
            </button>

            <button
              onClick={() => setActiveFilter("new")}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${activeFilter === "new"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                }`}
            >
              New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-slate-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-slate-800 hover:border-orange-500/50"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                {game.originalPrice && (
                  <div className="absolute top-2 right-2 bg-orange-600 px-2 py-1 rounded flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className="text-xs">
                      {Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4
                    onClick={() => navigate(`/game/${game.id}`)}
                    className="font-semibold text-lg cursor-pointer hover:text-orange-400 transition-colors"
                  >
                    {game.title}
                  </h4>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{game.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-3">{game.genre}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {game.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {game.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        ${game.originalPrice}
                      </span>
                    )}
                    <span className="text-xl font-bold text-orange-400">
                      ${game.price}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      isGameOwned(game.id)
                        ? navigate("/library")
                        : handleAddToCart(game.id)
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${isGameOwned(game.id)
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-orange-600 hover:bg-orange-700"
                      }`}
                  >
                    {isGameOwned(game.id) ? "In Library" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">About</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reddit</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            © 2026 Citrus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}