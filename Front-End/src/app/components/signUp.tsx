import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !username) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Sign up failed");
        return;
      }

      sessionStorage.setItem("pendingEmail", email);
      navigate("/verify-email");
    } catch (err) {
      setError("Could not connect to server");
    }
  };
  

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-black" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </button>

        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-orange-600/10 rounded-full mb-4">
              <User className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-400">Join Citrus and start gaming</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Create a password"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center mt-6">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-orange-400 hover:text-orange-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-400 hover:text-orange-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
