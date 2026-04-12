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
  // The backend sends a raw array, so we parse it directly as Game[]
  const data = await parseResponse<Game[]>(response);
  return data;
}

export async function fetchLibrary(userId: string): Promise<Game[]> {
  // Matched the URL to our new backend route: /api/library/:id
  const response = await fetch(`/api/library/${userId}`);
  const data = await parseResponse<Game[]>(response);
  return data;
}

export async function addGamesToLibrary(
  userId: string,
  gameIds: string[],
): Promise<Game[]> {
  // Matched the URL to our new backend route: /api/library/add
  const response = await fetch(`/api/library/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // The backend route expects both userId and gameIds in the body!
    body: JSON.stringify({ userId, gameIds }), 
  });

  const data = await parseResponse<Game[]>(response);
  return data;
}
