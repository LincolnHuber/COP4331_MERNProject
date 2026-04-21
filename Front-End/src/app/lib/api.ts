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

function mapMongoId(game: any): Game {
  return {
    ...game,
    id: game._id || game.id,
  };
}

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/api/games");
  const data = await parseResponse<any>(response);

  const games = Array.isArray(data) ? data : data.games ?? [];
  return games.map(mapMongoId);
}

export async function fetchLibrary(userId: string): Promise<Game[]> {
  const response = await fetch(`/api/library/${userId}`);
  const data = await parseResponse<any[]>(response);
  //map the incoming MongoDB array to fix the IDs
  return data.map(mapMongoId);
}

export async function addGamesToLibrary(
  userId: string,
  gameIds: string[],
): Promise<Game[]> {
  const response = await fetch(`/api/library/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, gameIds }), 
  });

  const data = await parseResponse<any[]>(response);
  //map the incoming MongoDB array to fix the IDs
  return data.map(mapMongoId);
}
