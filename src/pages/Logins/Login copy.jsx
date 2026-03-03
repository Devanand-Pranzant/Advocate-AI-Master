// pages/Logins/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building,
  Users,
  Shield,
  ArrowRight,
  User as UserIcon,
  Lock as LockIcon,
  LayoutDashboard,
  Zap,
  Key,
  UserCheck,
} from "lucide-react";

// const LoginPage = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   // Demo credentials for different roles
//   // const demoCredentials = [
//   //   { role: "admin", email: "admin@example.com", password: "password" },
//   //   { role: "owner", email: "owner@example.com", password: "password" },
//   //   { role: "tenant", email: "tenant@example.com", password: "password" },
//   //   { role: "support", email: "support@example.com", password: "password" },
//   // ];

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");

//     const result = await onLogin(formData.email, formData.password);

//     if (result.success) {
//       const userRole = result.user?.role || "admin";
//       const roleRoutes = {
//         admin: "/dashboard",
//         owner: "/owner/dashboard",
//         tenant: "/tenant/dashboard",
//         support: "/support/dashboard",
//       };
//       navigate(roleRoutes[userRole] || "/dashboard");
//     } else {
//       setError(result.error || "Invalid credentials. Please try again.");
//     }
//     setIsSubmitting(false);
//   };

//   const handleQuickLogin = (email, password) => {
//     setFormData({ email, password });
//   };

// const LoginPage = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");

//     const result = await onLogin(formData.email, formData.password);

//     if (result.success) {
//       const userRole = result.user?.role || "admin";
//       const roleRoutes = {
//         admin: "/dashboard",
//         owner: "/owner/dashboard",
//         tenant: "/tenant/dashboard",
//         support: "/support/dashboard",
//       };
//       navigate(roleRoutes[userRole] || "/dashboard");
//     } else {
//       setError(result.error || "Invalid credentials. Please try again.");
//     }

//     setIsSubmitting(false);
//   };

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
        role: res.data.role,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);

      console.log("LOGIN SUCCESS RESPONSE:", res.data);
      console.log("USER ROLE:", userData.role);

      // Role based redirect
      const roleRoutes = {
        admin: "/dashboard",
        owner: "/owner/dashboard",
        tenant: "/tenant/dashboard",
        customer: "/customer/dashboard",
        support: "/support/dashboard",
      };

      console.log("REDIRECT PATH:", roleRoutes[userData.role]);

      navigate(roleRoutes[userData.role] || "/dashboard");
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
          backgroundImage: "url('/src/assets/bg1.png')",
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
                <Building className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
                BTU Meter Management
              </h1>
            </div>
            <p className="text-xl font-medium text-white drop-shadow-md">
              Advanced energy monitoring and billing system for commercial
              buildings
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  RSB Compliant
                </p>
                <p className="text-sm text-white/90">
                  Full regulatory compliance built-in
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Real-time Monitoring
                </p>
                <p className="text-sm text-white/90">
                  Live BTU meter data and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Multi-role Access
                </p>
                <p className="text-sm text-white/90">
                  Admin, Owner, Tenant, Support portals
                </p>
              </div>
            </div>
          </div>

          {/* Demo Credentials Section */}
          {/* <div className="mt-12 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <p className="text-sm font-semibold text-white mb-3">Demo Login (Click to try):</p>
            <div className="grid grid-cols-2 gap-3">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(cred.email, cred.password)}
                  className="text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition text-white border border-white/10 hover:border-white/30"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-white" />
                    <span className="font-medium capitalize">{cred.role}</span>
                  </div>
                  <div className="text-xs text-white/80 mt-1">{cred.email}</div>
                </button>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Right Side - Login Form (unchanged) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Key className="w-6 h-6 text-white/80" />
              <h2 className="text-white text-2xl font-bold">Login</h2>
            </div>
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
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your email"
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
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-white/70">
                Need access to the system?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-white hover:underline hover:text-blue-300 transition"
                >
                  Request access
                </Link>
              </p>
            </div> */}
          </form>
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

export default LoginPage;
