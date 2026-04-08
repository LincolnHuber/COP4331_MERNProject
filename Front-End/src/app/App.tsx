import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./components/cartContext.tsx";
import { LibraryProvider } from "./components/libraryContext.tsx";
import "../styles/index.css";

export default function App() {
  return (
    <CartProvider>
      <LibraryProvider>
        <RouterProvider router={router} />
      </LibraryProvider>
    </CartProvider>
  );
}