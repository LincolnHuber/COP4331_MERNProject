import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Game, games } from "../data/games";

interface CartItem {
    game: Game;
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

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (gameId: string) => {
        const game = games.find((g) => g.id === gameId);
        if (!game) return;

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.game.id === gameId);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.game.id === gameId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevCart, { game, quantity: 1 }];
        });
    };

    const removeFromCart = (gameId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.game.id !== gameId));
    };

    const updateQuantity = (gameId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(gameId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.game.id === gameId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.game.price * item.quantity, 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
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