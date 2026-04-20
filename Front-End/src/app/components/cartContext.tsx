import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useGames } from "./gamesContext";
import type { Game } from "../types/game";

interface CartItem {
  game: Game;
  quantity: number;
}

interface StoredCartItem {
  gameId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (gameId: string) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeStoredCart(rawCart: unknown): StoredCartItem[] {
  if (!Array.isArray(rawCart)) {
    return [];
  }

  return rawCart.reduce<StoredCartItem[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const legacyGameId =
      "game" in item &&
      item.game &&
      typeof item.game === "object" &&
      "id" in item.game &&
      typeof item.game.id === "string"
        ? item.game.id
        : null;

    const gameId =
      "gameId" in item && typeof item.gameId === "string"
        ? item.gameId
        : legacyGameId;

    const quantity =
      "quantity" in item && typeof item.quantity === "number"
        ? item.quantity
        : 1;

    if (!gameId || quantity <= 0) {
      return items;
    }

    items.push({ gameId, quantity });
    return items;
  }, []);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { games } = useGames();
  const [cartItems, setCartItems] = useState<StoredCartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) {
      return [];
    }

    try {
      return normalizeStoredCart(JSON.parse(storedCart));
    } catch {
      localStorage.removeItem("cart");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (games.length === 0) {
      return;
    }

    setCartItems((prevCart) =>
      prevCart.filter((item) => games.some((game) => game.id === item.gameId)),
    );
  }, [games]);

  const cart = cartItems.reduce<CartItem[]>((items, item) => {
    const game = games.find((entry) => entry.id === item.gameId);

    if (!game) {
      return items;
    }

    items.push({ game, quantity: item.quantity });
    return items;
  }, []);

  const addToCart = (gameId: string) => {
    const gameExists = games.some((game) => game.id === gameId);

    if (!gameExists) {
      return;
    }

    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.gameId === gameId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.gameId === gameId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prevCart, { gameId, quantity: 1 }];
    });
  };

  const removeFromCart = (gameId: string) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.gameId !== gameId));
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
      return;
    }

    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.gameId === gameId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.game.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
