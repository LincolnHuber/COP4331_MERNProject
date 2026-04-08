import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Game, games } from "../data/games";

interface LibraryContextType {
    ownedGames: Game[];
    addGamesToLibrary: (gameIds: string[]) => void;
    isGameOwned: (gameId: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
    const [ownedGameIds, setOwnedGameIds] = useState<string[]>(() => {
        const storedLibrary = localStorage.getItem("library");
        return storedLibrary ? JSON.parse(storedLibrary) : [];
    });

    useEffect(() => {
        localStorage.setItem("library", JSON.stringify(ownedGameIds));
    }, [ownedGameIds]);

    const addGamesToLibrary = (gameIds: string[]) => {
        setOwnedGameIds((prev) => {
            const newIds = gameIds.filter((id) => !prev.includes(id));
            return [...prev, ...newIds];
        });
    };

    const isGameOwned = (gameId: string) => {
        return ownedGameIds.includes(gameId);
    };

    const ownedGames = games.filter((game) => ownedGameIds.includes(game.id));

    return (
        <LibraryContext.Provider
            value={{
                ownedGames,
                addGamesToLibrary,
                isGameOwned,
            }}
        >
            {children}
        </LibraryContext.Provider>
    );
}

export function useLibrary() {
    const context = useContext(LibraryContext);
    if (context === undefined) {
        throw new Error("useLibrary must be used within a LibraryProvider");
    }
    return context;
}