import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-black" />

            <div className="relative w-full max-w-md">
                <button
                    onClick={() => navigate("/login")}
                    className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </button>

                <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-orange-600/10 rounded-full mb-4">
                            <KeyRound className="w-8 h-8 text-orange-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            Reset Password
                        </h1>
                        <p className="text-slate-400">
                            Enter your email and we will send reset instructions
                        </p>
                    </div>

                    {submitted ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                                Password reset email sent
                            </div>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

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

                            <button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
                            >
                                Send Reset Email
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}