import type { Game } from "../types/game";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/api/games");
  const data = await parseResponse<{ games: Game[] }>(response);
  return data.games;
}

export async function fetchLibrary(userId: string): Promise<Game[]> {
  const response = await fetch(`/api/users/${userId}/library`);
  const data = await parseResponse<{ library: Game[] }>(response);
  return data.library;
}

export async function addGamesToLibrary(
  userId: string,
  gameIds: string[],
): Promise<Game[]> {
  const response = await fetch(`/api/users/${userId}/library`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameIds }),
  });

  const data = await parseResponse<{ library: Game[] }>(response);
  return data.library;
}
