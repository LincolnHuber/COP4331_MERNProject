import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, CheckCircle, Loader2, ArrowRight } from "lucide-react";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    // Get email from sessionStorage
    const pendingEmail = sessionStorage.getItem("pendingEmail");
    if (!pendingEmail) {
      navigate("/signup");
      return;
    }
    setEmail(pendingEmail);

    // Simulate sending verification email
    console.log(`Verification email sent to ${pendingEmail}`);
  }, [navigate]);

  useEffect(() => {
    // Countdown timer for resend button
    if (resendTimer > 0 && !isVerified) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, isVerified]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, accept any 6-digit code
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      setIsVerified(true);
      sessionStorage.removeItem("pendingEmail");

    } else {
      setError("Invalid verification code. Please enter a 6-digit code.");
    }

    setIsVerifying(false);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;

    // Simulate resending email
    console.log(`Verification email resent to ${email}`);
    setResendTimer(60);
    setError("");
    setVerificationCode("");
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-black" />

        <div className="relative w-full max-w-md">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 text-center">
            <div className="inline-block p-4 bg-green-500/10 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Email Verified!</h1>
            <p className="text-slate-400 mb-6">
              Your account has been successfully verified.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-black" />

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-orange-600/10 rounded-full mb-4">
              <Mail className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-slate-400">
              We've sent a verification code to
            </p>
            <p className="text-white font-medium mt-1">{email}</p>
          </div>

          {/* Info Box */}
          <div className="bg-orange-600/10 border border-orange-500/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-300">
              For demo purposes, enter any 6-digit number to verify your email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Verification Code */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-orange-400 hover:text-orange-300 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend Code"}
            </button>
          </div>

          {/* Back to signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/signup")}
              className="text-slate-500 hover:text-slate-400 text-sm transition-colors"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
