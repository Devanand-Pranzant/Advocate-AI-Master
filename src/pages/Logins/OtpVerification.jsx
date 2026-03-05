// pages/Logins/OTPVerificationPage.js
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, ArrowRight, RotateCw } from "lucide-react";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // clear error on input

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("").trim();

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit code");
      return;
    }

    if (timeLeft <= 0) {
      setError("This code has expired. Please request a new one.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/verify-email-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: otpValue,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        let msg = data.message || "Invalid verification code";
        // Only show invalid OTP message, don't show expired message here
        if (msg.toLowerCase().includes("invalid")) {
          msg = "Invalid OTP. Please check and try again.";
        } else {
          msg = "Invalid OTP. Please check and try again.";
        }
        setError(msg);
        return;
      }

      // Success
      if (data.next === "reset-password") {
        navigate("/reset-password", {
          state: {
            email,
            reset_token: data.reset_token,
          },
        });
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    setIsResending(true);
    setError("");
    setResendMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setResendMessage("New code sent! Check your email.");
        setOtp(new Array(6).fill(""));
        setTimeLeft(60);           // Reset timer to 60s
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || "Failed to resend code. Try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Network error. Please check connection.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isExpired = timeLeft <= 0;

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background Image - Updated path */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/back-login.jpg')",
        }}
      ></div>

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Left Side Panel - Now with background image visible behind */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-20 flex flex-col justify-center px-12 text-white drop-shadow-lg">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
              Verify Your Email
            </h1>
            <p className="text-xl font-medium text-white drop-shadow-md mt-4">
              We've sent a 6-digit verification code to your registered email.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Secure Email Delivery
                </p>
                <p className="text-sm text-white/90">
                  Check your inbox (and spam)
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Account Protection
                </p>
                <p className="text-sm text-white/90">
                  Two-step verification enabled
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Instant Access
                </p>
                <p className="text-sm text-white/90">
                  Complete setup in seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Enter Verification Code
            </h2>
            <p className="text-sm text-white/70 mt-2">
              Code sent to <span className="font-semibold text-blue-300">{email}</span>
            </p>
            <p className="text-sm mt-2 flex items-center justify-center gap-2 text-white">
              {isExpired ? (
                <span className="text-red-400 font-medium">Code expired</span>
              ) : (
                <>
                  Code expires in{" "}
                  <span className="font-semibold text-green-400">
                    {formatTime(timeLeft)}
                  </span>
                </>
              )}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-center text-sm">
              {error}
            </div>
          )}

          {resendMessage && !error && (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-400/40 rounded-lg text-green-200 text-center text-sm">
              {resendMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-14 h-14 text-center text-3xl font-bold text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                  disabled={isSubmitting || isResending}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isResending || isExpired}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-white/70">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isSubmitting || timeLeft > 0}
              className="font-medium text-white hover:text-blue-300 transition flex items-center gap-1 mx-auto mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate("/login")}
              className="text-white/70 hover:text-white transition text-sm"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Right Branding */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="text-white/60 text-xs">
          <p>Advocate AI Master v1.0</p>
          <p>Bar Council Compliant • Secure • Enterprise Ready</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;