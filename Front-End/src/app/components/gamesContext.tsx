import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchGames } from "../lib/api";
import type { Game } from "../types/game";

interface GamesContextType {
  games: Game[];
  isLoading: boolean;
  error: string;
  getGameById: (gameId: string) => Game | undefined;
  refreshGames: () => Promise<void>;
}

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGames = async () => {
    try {
      setIsLoading(true);
      setError("");
      const nextGames = await fetchGames();
      setGames(nextGames);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load games";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const getGameById = (gameId: string) => games.find((game) => game.id === gameId);

  return (
    <GamesContext.Provider
      value={{
        games,
        isLoading,
        error,
        getGameById,
        refreshGames: loadGames,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GamesContext);

  if (!context) {
    throw new Error("useGames must be used within a GamesProvider");
  }

  return context;
}
