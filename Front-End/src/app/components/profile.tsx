import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, LibraryBig, ShoppingCart, LogOut } from "lucide-react";
import { clearStoredUser, useStoredUser } from "../lib/authStorage";
import { useLibrary } from "./libraryContext";
import { useCart } from "./cartContext";

export function Profile() {
  const navigate = useNavigate();
  const user = useStoredUser();
  const { ownedGames } = useLibrary();
  const { getCartItemCount } = useCart();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    clearStoredUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 transition-colors hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-full bg-orange-600/10 p-4">
              <User className="h-10 w-10 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{user?.username || "Player"}</h1>
              <p className="text-slate-400">{user?.email || "No email available"}</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-6">
              <div className="mb-3 flex items-center gap-3">
                <LibraryBig className="h-6 w-6 text-orange-400" />
                <h2 className="text-xl font-semibold">Library</h2>
              </div>
              <p className="text-3xl font-bold">{ownedGames.length}</p>
              <p className="mt-1 text-sm text-slate-400">Owned games</p>
            </div>

            <div className="rounded-xl bg-slate-800 p-6">
              <div className="mb-3 flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-orange-400" />
                <h2 className="text-xl font-semibold">Cart</h2>
              </div>
              <p className="text-3xl font-bold">{getCartItemCount()}</p>
              <p className="mt-1 text-sm text-slate-400">Items in cart</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/library")}
              className="rounded-lg bg-orange-600 px-6 py-3 font-medium transition-colors hover:bg-orange-700"
            >
              View Library
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="rounded-lg bg-slate-800 px-6 py-3 font-medium transition-colors hover:bg-slate-700"
            >
              View Cart
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium transition-colors hover:bg-red-700"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
