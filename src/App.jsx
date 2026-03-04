import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTheme, ThemeProvider } from "./components/Settings/themeUtils";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Header from "./components/Header/Header";
import LoginPage from "./pages/Logins/Login";
import ForgotPasswordPage from "./pages/Logins/ForgotPass";
import OTPVerificationPage from "./pages/Logins/OtpVerification";
import ResetPasswordPage from "./pages/Logins/ResetPassword";
import SignUpPage from "./pages/Logins/SignUp";
import Profile from "./components/Profile/Profile";
import Footer from "./components/Footer/Footer";
import Setting from "./components/Settings/Settings";
import Dashboard from "./pages/Admin/AdminDashboard/Dashboard.jsx";
import HomePage from "./pages/Admin/HomePage.jsx";
import ListCommunity from "./pages/Admin/AdminDashboard/ListCommunity.jsx";
import ListClient from "./pages/Client/ListClient.jsx";
import EditClient from "./pages/Client/EditClient.jsx";
import AddClient from "./pages/Client/AddClient.jsx";
import ViewClient from "./pages/Client/ViewClient.jsx";

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { theme, themeUtils } = useTheme();

  const refreshTimerRef = useRef(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Always remove localStorage first (so routes see "logged out")
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");

      if (user?.session_token) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ session_token: user.session_token }),
        });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);

      // Redirect immediately
      // navigate("/login", { replace: true });
      if (reason === "session_expired") {
        setSessionExpired(true);
      } else {
        // Normal logout → redirect immediately
        navigate("/login", { replace: true });
      }
    }
  };

  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Not logged in → go to login
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // Role based access check
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      const roleDashboards = {
        admin: "/dashboard",
        owner: "/owner/dashboard",
        tenant: "/tenant/dashboard",
        support: "/support/dashboard",
      };

      return (
        <Navigate to={roleDashboards[user.role] || "/dashboard"} replace />
      );
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Already logged in → redirect to dashboard
    if (token && user) {
      const roleDashboards = {
        admin: "/dashboard",
        owner: "/owner/dashboard",
        tenant: "/tenant/dashboard",
        support: "/support/dashboard",
      };

      return (
        <Navigate to={roleDashboards[user.role] || "/dashboard"} replace />
      );
    }

    return children;
  };

  // Decode JWT expiry
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  };

  const handleSessionExpired = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);

    setSessionExpired(true); // popup only
  };

  const expireSession = () => {
    if (sessionExpired) return;
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpired(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    scheduleSessionExpiry(token, expireSession);

    return () => {
      if (sessionExpiryRef.current) {
        clearTimeout(sessionExpiryRef.current);
      }
    };
  }, [user?.token]);

  const sessionExpiryRef = useRef(null);

  const scheduleSessionExpiry = (token, onExpire) => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000;
      const delay = expiryTime - Date.now();

      if (sessionExpiryRef.current) {
        clearTimeout(sessionExpiryRef.current);
      }

      if (delay <= 0) {
        onExpire();
        return;
      }

      sessionExpiryRef.current = setTimeout(() => {
        onExpire();
      }, delay);
    } catch (err) {
      console.error("Invalid token");
      onExpire();
    }
  };

  // Refresh token API call
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/refresh-token`,
        { refresh_token: refreshToken },
      );

      console.log("REFRESH RESPONSE:", res.data);
      if (!res.data.success) throw new Error("Refresh failed");

      const storedUser = JSON.parse(localStorage.getItem("user"));

      const newUser = {
        ...storedUser,
        token: res.data.token,
        refresh_token: res.data.refresh_token,
      };

      setUser(newUser);
      setIsAuthenticated(true);

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      scheduleRefresh(res.data.token);
      // startExpiryWatcher(res.data.token);
    } catch (err) {
      console.log("Refresh failed:", err);
      // forceLogout("Session expired. Please login again.");
    }
  };

  // Schedule refresh 1 min before expiry
  const scheduleRefresh = (token) => {
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const now = Date.now();
    const refreshTime = expiry - now - 60_000; // 1 min before expiry

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    if (refreshTime <= 0) {
      // forceLogout("Session expired. Please login again.");
      return;
    }

    refreshTimerRef.current = setTimeout(() => {
      refreshToken();
    }, refreshTime);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);

      scheduleSessionExpiry(token, () => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        setSessionExpired(true);
      });
    }

    return () => {
      if (sessionExpiryRef.current) {
        clearTimeout(sessionExpiryRef.current);
      }
    };
  }, []);

  return (
    <div
      className="font-sans"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <Routes>
        {/* Public Routes - Homepage is now the default landing page */}
        <Route
          path="/"
          element={<HomePage />}
        />
        
        <Route
          path="/homepage"
          element={<HomePage />}
        />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/otp-verification"
          element={
            <PublicRoute>
              <OTPVerificationPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "owner", "tenant", "support", "customer"]}
            >
              <PortalLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <Profile />
              </PortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "owner", "tenant", "support", "customer"]}
            >
              <PortalLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <Setting />
              </PortalLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-community"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <ListCommunity />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-client"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <ListClient />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-client"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <EditClient />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/add-client"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <AddClient />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/view-client"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                user={user}
                onLogout={logout}
                themeUtils={themeUtils}
              >
                <ViewClient />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div
              className="min-h-screen flex flex-col items-center justify-center"
              style={{ backgroundColor: themeUtils.getBgColor("default") }}
            >
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-lg mb-6">Page not found</p>
              <a
                href="/"
                className="px-4 py-2 rounded-md"
                style={{ backgroundColor: theme.headerBg, color: "#fff" }}
              >
                Go to Home
              </a>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

// Admin Layout Component
const AdminLayout = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  user,
  onLogout,
  themeUtils,
}) => {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: themeUtils.getBgGradient() }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={user?.role || "admin"}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onLogout={onLogout}
        />

        <main
          className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4"
          style={{
            backgroundColor: themeUtils.getBgColor("default"),
            marginBottom: "25px",
          }}
        >
          <div>{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

//Customer Layout Component
const CustomerLayout = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  user,
  onLogout,
  themeUtils,
}) => {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: themeUtils.getBgGradient?.() || "#f9fafb" }}
    >
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - should be Customer-specific */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole="customer" // Important: pass "customer" or "tenant"
        user={user}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header - can be customized for customer */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onLogout={onLogout}
          isCustomer={true} // Optional prop to change header appearance
        />

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-4"
          style={{
            backgroundColor: themeUtils.getBgColor("default"),
            marginBottom: "25px",
          }}
        >
          <div>{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

// Portal Layout Component (for Owner, Tenant, Support)
const PortalLayout = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  user,
  onLogout,
  themeUtils,
}) => {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: themeUtils.getBgGradient() }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={user?.role || "tenant"}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onLogout={onLogout}
        />

        <main
          className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-4"
          style={{
            backgroundColor: themeUtils.getBgColor("default"),
          }}
        >
          <div className="p-4 ">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;