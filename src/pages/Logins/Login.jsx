// pages/Logins/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Scale,
  Users,
  Shield,
  ArrowRight,
  Lock as LockIcon,
  Key,
  UserCheck,
  Briefcase,
  Gavel,
  FileText,
  Clock,
} from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 LOGIN DIRECTLY FROM HERE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
      );

      // adjust this according to your backend response
      if (!res.data.success) {
        setError(res.data.message || "Login failed");
        setIsSubmitting(false);
        return;
      }

      const userData = {
        user_id: res.data.user_id,
        name: res.data.full_name,
        email: res.data.email,
        token: res.data.token,
        session_token: res.data.session_token,
        role: res.data.role || "advocate", // Default to advocate role
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);

      console.log("LOGIN SUCCESS RESPONSE:", res.data);
      console.log("USER ROLE:", userData.role);

      // Single role redirect for advocates
      navigate("/dashboard");
      
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/back-login.jpg')",
        }}
      ></div>

      {/* Dark Overlay for Left Panel - Makes text readable */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-5"></div>

      {/* Left Side Panel - Now fully readable */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-20 flex flex-col justify-center px-12 text-white drop-shadow-lg">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
                Advocate AI Master
              </h1>
            </div>
            <p className="text-xl font-medium text-white drop-shadow-md">
              Intelligent case management and legal analytics platform for advocates
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Legal Compliance
                </p>
                <p className="text-sm text-white/90">
                  Bar council compliant with built-in regulatory standards
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Case Management
                </p>
                <p className="text-sm text-white/90">
                  Track cases, hearings, and legal documents in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Time 
                </p>
                <p className="text-sm text-white/90">
                  Automated time tracking 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-white/80" />
              <h2 className="text-white text-2xl font-bold">Advocate Login</h2>
            </div>
            <p className="text-white/60 text-sm text-center">
              Sign in to access your legal practice dashboard
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Bar Council Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="advocate@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/60 hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-white/70 hover:text-white transition hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-white/70">
                New to Advocate AI Master?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-white hover:underline hover:text-blue-300 transition"
                >
                  Register as Advocate
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default LoginPage;