import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addGamesToLibrary as persistGamesToLibrary, fetchLibrary } from "../lib/api";
import { useStoredUser } from "../lib/authStorage";
import type { Game } from "../types/game";

interface LibraryContextType {
  ownedGames: Game[];
  isLoading: boolean;
  addGamesToLibrary: (gameIds: string[]) => Promise<boolean>;
  isGameOwned: (gameId: string) => boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const user = useStoredUser();
  const [ownedGames, setOwnedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLibrary = async () => {
    if (!user?.id) {
      setOwnedGames([]);
      return;
    }

    try {
      setIsLoading(true);
      const library = await fetchLibrary(user.id);
      setOwnedGames(library);
    } catch (err) {
      console.log(err);
      setOwnedGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [user?.id]);

  const addGamesToLibrary = async (gameIds: string[]) => {
    if (!user?.id || gameIds.length === 0) {
      return false;
    }

    try {
      setIsLoading(true);
      const library = await persistGamesToLibrary(user.id, gameIds);
      setOwnedGames(library);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isGameOwned = (gameId: string) => {
    return ownedGames.some((game) => game.id === gameId);
  };

  return (
    <LibraryContext.Provider
      value={{
        ownedGames,
        isLoading,
        addGamesToLibrary,
        isGameOwned,
        refreshLibrary: loadLibrary,
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
