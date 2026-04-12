import { useNavigate } from "react-router";
import { MailCheck, ArrowLeft } from "lucide-react";

export function WaitingForVerification() {
    const navigate = useNavigate();
    const pendingEmail = sessionStorage.getItem("pendingEmail");

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-black" />

            <div className="relative w-full max-w-md">
                <button
                    onClick={() => navigate("/signup")}
                    className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign Up
                </button>

                <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 text-center">
                    <div className="inline-block p-3 bg-orange-600/10 rounded-full mb-4">
                        <MailCheck className="w-8 h-8 text-orange-400" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Check Your Email
                    </h1>

                    <p className="text-slate-400 mb-6">
                        We sent a verification email{pendingEmail ? ` to ${pendingEmail}` : ""}.
                        Please verify your account before signing in.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            I Already Verified
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}