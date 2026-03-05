import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Validation error states
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const reset_token = location.state?.reset_token;

  useEffect(() => {
    if (!email || !reset_token) {
      navigate("/login", { replace: true });
    }
  }, [email, reset_token, navigate]);

  // Same password validation as in Profile component
  const validateStrongPassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (confirmPwd) => {
    if (!confirmPwd) return "Confirm password is required";
    if (confirmPwd !== password) return "Passwords do not match";
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidationErrors({
      ...validationErrors,
      password: validateStrongPassword(value)
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setValidationErrors({
      ...validationErrors,
      confirmPassword: validateConfirmPassword(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validateStrongPassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);
    
    setValidationErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (passwordError || confirmPasswordError) {
      setMessage("Please fix password validation errors");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reset_token,
            newPassword: password,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Password reset failed");
        setMessageType("error");
        setTimeout(() => setMessage(""), 5000);
        return;
      }

      setMessage("Password reset successful!");
      setMessageType("success");
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/img/back-login.jpg')",
        }}
      ></div>

      {/* Dark Overlay for Left Panel */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-5"></div>

      {/* Left Side Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-20 flex flex-col justify-center px-12 text-white drop-shadow-lg">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
              Create New Password
            </h1>
            <p className="text-xl font-medium text-white drop-shadow-md mt-4">
              Your new password should be strong and different from previous
              ones.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Strong Encryption
                </p>
                <p className="text-sm text-white/90">
                  Your password is never stored in plain text
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Maximum Security
                </p>
                <p className="text-sm text-white/90">
                  Enterprise-grade protection
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
                  Log in immediately after reset
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Set New Password</h2>
            <p className="text-sm text-white/70 mt-2">
              Choose a strong and unique password
            </p>
          </div>

          {/* Message Alert - Same style as Profile component */}
          {message && (
            <div className="mb-6">
              <div 
                className="flex items-center gap-3 p-4 rounded-lg shadow-sm"
                style={{ 
                  backgroundColor: messageType === "success" ? "#d1fae5" : "#fee2e2",
                }}
              >
                {messageType === "success" ? (
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                )}
                <span
                  className="font-medium text-sm"
                  style={{
                    color: messageType === "success" ? "#065f46" : "#991b1b",
                  }}
                >
                  {message}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-lg text-white font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    validationErrors.password ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-400 text-xs mt-1 ml-2">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-lg text-white font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    validationErrors.confirmPassword ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 ml-2">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements Hint */}
            <div className="text-xs text-white/50 px-2 space-y-1">
              <p className="font-semibold text-white/70">Password requirements:</p>
              <p className={password.length >= 8 ? "text-green-400" : ""}>• At least 8 characters</p>
              <p className={/[A-Z]/.test(password) ? "text-green-400" : ""}>• At least one uppercase letter</p>
              <p className={/[a-z]/.test(password) ? "text-green-400" : ""}>• At least one lowercase letter</p>
              <p className={/[0-9]/.test(password) ? "text-green-400" : ""}>• At least one number</p>
              <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-400" : ""}>• At least one special character</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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

     
    </div>
  );
};

export default ResetPasswordPage;