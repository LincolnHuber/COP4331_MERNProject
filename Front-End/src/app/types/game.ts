export interface Game {
  id: string;
  title: string;
  developer?: string;
  ESRB?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  genre?: string;
  genres?: string[];
  rating?: number;
  imageUrl?: string;
  description?: string;
  tags: string[];
  isActive?: boolean;
  releaseDate?: string;
}
