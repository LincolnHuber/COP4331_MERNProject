import { createBrowserRouter } from "react-router";
import { Root } from "./components/root.tsx";
import { Store } from "./components/store.tsx";
import { SignUp } from "./components/signUp.tsx";
import { VerifyEmail } from "./components/verifyEmail.tsx";
import { Login } from "./components/login.tsx";
import { Library } from "./components/library.tsx";
import { Community } from "./components/community.tsx";
import { Cart } from "./components/cart.tsx";
import { Profile } from "./components/profile.tsx";
import { GameDetails } from "./components/gameDetails.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Store },
      { path: "signup", Component: SignUp },
      { path: "verify-email", Component: VerifyEmail },
      { path: "login", Component: Login },
      { path: "library", Component: Library },
      { path: "community", Component: Community },
      { path: "cart", Component: Cart },
      { path: "profile", Component: Profile },
      { path: "game/:id", Component: GameDetails },
    ],
  },
]);