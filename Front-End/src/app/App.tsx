import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./components/cartContext.tsx";
import { GamesProvider } from "./components/gamesContext.tsx";
import { LibraryProvider } from "./components/libraryContext.tsx";
import "../styles/index.css";

export default function App() {
  return (
    <GamesProvider>
      <CartProvider>
        <LibraryProvider>
          <RouterProvider router={router} />
        </LibraryProvider>
      </CartProvider>
    </GamesProvider>
  );
}
