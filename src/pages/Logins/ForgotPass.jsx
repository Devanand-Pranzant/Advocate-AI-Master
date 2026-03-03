// pages/Logins/ForgotPasswordPage.js
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    // 1. Must be lowercase only
    if (email !== email.toLowerCase()) {
      return "Email should be in lowercase only.";
    }

    // 2. Basic email format: must contain @ and a domain with TLD
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // 3. Must contain .com or other common TLD (optional strict check)
    if (!email.includes(".")) {
      return "Email must contain a domain extension (like .com, .in, etc.)";
    }

    return ""; // No error → valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    const validationError = validateEmail(email);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.success) {
        navigate("/otp-verification", {
          state: { email },
        });
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation message (shows while typing)
  const validationMessage = validateEmail(email);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/back-login.jpg')",
        }}
      ></div>

      {/* Dark Overlay for Left Panel - Improved readability */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-5"></div>

      {/* Left Side Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-20 flex flex-col justify-center px-12 text-white drop-shadow-lg">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
              Forgot Your Password?
            </h1>
            <p className="text-xl font-medium text-white drop-shadow-md mt-4">
              No worries! We'll send you instructions to reset it securely.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Email Instructions
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Secure & Simple
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Quick Recovery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-sm text-white/70 mt-2">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage(""); // Clear server message when user types
                }}
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Show real-time validation error */}
            {validationMessage && (
              <p className="text-sm text-red-400 mt-1">{validationMessage}</p>
            )}

            {/* Show server/API error message */}
            {message && !validationMessage && (
              <p className="text-sm text-red-400 mt-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading || !!validationMessage}
              className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                loading || validationMessage
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-sm text-white/70 hover:text-white transition hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Right Branding */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="text-white/60 text-xs">
          <p>BTU Meter Management System v1.0</p>
          <p>RSB Compliant • Secure • Enterprise Ready</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;