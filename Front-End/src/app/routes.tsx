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
import { ForgotPassword } from "./components/forgotPassword.tsx";
import { WaitingForVerification } from "./components/waitingForVerification.tsx";
import { Checkout } from "./components/checkout.tsx";
import { TermsOfService } from "./components/termsOfService.tsx";
import { PrivacyPolicy } from "./components/privacyPolicy.tsx";

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
      { path: "forgot-password", Component: ForgotPassword },
      { path: "waiting-for-verification", Component: WaitingForVerification },
      { path: "checkout", Component: Checkout },
      { path: "terms", Component: TermsOfService },
      { path: "privacy", Component: PrivacyPolicy },
    ],
  },
]);
