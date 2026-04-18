import type { Game } from "../types/game";

export function getGameGenre(game: Game) {
  return game.genre || game.genres?.[0] || "Uncategorized";
}

export function getGameDiscountPercentage(game: Game) {
  if (typeof game.discountPercentage === "number" && game.discountPercentage > 0) {
    return Math.round(game.discountPercentage);
  }

  if (!game.originalPrice || game.originalPrice <= game.price) {
    return 0;
  }

  return Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100);
}

export function isNewRelease(game: Game) {
  if (!game.releaseDate) {
    return game.tags.some((tag) => tag.toLowerCase() === "new");
  }

  const releaseDate = new Date(game.releaseDate);
  const ageInDays = (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays <= 90;
}
