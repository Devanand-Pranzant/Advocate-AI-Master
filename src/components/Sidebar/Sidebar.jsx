// Sidebar.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Gauge,
  BarChart3,
  Calculator,
  Users,
  Bell,
  FileText,
  Settings,
  Power,
  AlertTriangle,
  Building,
  CreditCard,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Database,
  TrendingUp,
  Wallet,
  UserCheck,
  MessageSquare,
  RefreshCw,
  LogOut,
  Shield,
  Activity,
  FileCheck,
  Zap,
  Map,
  Users2,
  FolderKanban,
  Building2,
  Mail,
} from "lucide-react";

import Logo from "../Header/Logo";
import { useTheme } from "../Settings/themeUtils";

/* ================= ICON MAP FROM BACKEND STRING ================= */
const iconMap = {
  Home,
  Users2,
  Gauge,
  Users,
  TrendingUp,
  Calculator,
  MessageSquare,
  Power,
  Settings,
  FileCheck,
  BarChart3,
  Database,
  FolderKanban,
  Building2,
  CreditCard,
  Shield,
  Wrench,
  Wallet,
  AlertTriangle,
  Mail,
  Bell,
  Map,
};

const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const { theme, themeUtils } = useTheme();

  /* ================= LOAD MENU FROM BACKEND ================= */
  useEffect(() => {
    fetchSideMenu();
  }, []);

  const fetchSideMenu = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/sidemenu`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setMenuItems(res.data.sidemenu);
      }
    } catch (err) {
      console.error("Sidebar load error:", err);
    }
  };

  /* ================= ACTIVE & AUTO EXPAND ================= */
  const isActive = (path) =>
    path &&
    (location.pathname === path || location.pathname.startsWith(path + "/"));

  const toggleExpand = (label) =>
    setExpanded((p) => (p[label] ? {} : { [label]: true }));

  useEffect(() => {
    const auto = {};
    menuItems.forEach((m) => {
      if (m.hasSub && m.subItems?.some((s) => location.pathname === s.path)) {
        auto[m.label] = true;
      }
    });
    setExpanded((p) => ({ ...p, ...auto }));
  }, [location.pathname, menuItems]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"
          }`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          transition-transform duration-300
          ${isSidebarCollapsed ? "w-16" : "w-63"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
        `}
        style={{
          backgroundColor: themeUtils.getBgColor("card"),
        }}
      >
        {/* Header */}
        <div
  className="h-[50px] relative flex items-center px-3 shadow-md"
  style={{
    backgroundColor: themeUtils.getBgColor("card"),
    borderColor: themeUtils.getBorderColor(),
  }}
>
  {/* Centered Logo */}
  <div className="absolute left-1/2 -translate-x-1/2">
    <Logo isCollapsed={isSidebarCollapsed} />
  </div>

  {/* Right Toggle Button */}
  <button
    onClick={() => setIsSidebarCollapsed((p) => !p)}
    className="hidden lg:block ml-auto p-1.5 rounded-md transition-all duration-200 hover:scale-105"
  
    style={{
  ...(theme.headerBg.includes("gradient")
    ? { background: theme.headerBg }
    : { backgroundColor: theme.headerBg }),
      color: themeUtils.getTextColor(false),
}}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = theme.headerBg
        ? `${theme.headerBg}20`
        : "#f3f4f6";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = theme.headerBg
        ? `${theme.headerBg}10`
        : "transparent";
    }}
  >
    <ChevronLeft
      className={`w-4 h-4 ${isSidebarCollapsed ? "rotate-180" : ""}`}
    />
  </button>
</div>


        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-3 overflow-y-auto hide-scrollbar shadow-md">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon] || FileText; // fallback icon
            const open = expanded[item.label];
            const active =
              isActive(item.path) ||
              item.subItems?.some((s) => isActive(s.path));

            return (
              <div key={item.label}>
                {item.hasSub ? (
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: active
                        ? theme.headerBg
                        : "transparent",
                      color: active
                        ? "#FFFFFF"
                        : themeUtils.getTextColor(false),
                      borderLeft: active
                        ? `4px solid #FFFFFF`
                        : "4px solid transparent",
                      fontWeight: active ? "600" : "400",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = themeUtils.getBgColor("hover");
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-4 h-4"
                        style={{
                          color: active ? "#FFFFFF" : themeUtils.getTextColor(false),
                        }}
                      />
                      {!isSidebarCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </div>
                    {!isSidebarCollapsed && (
                      <ChevronRight
                        className={`w-4 h-4 ${open ? "rotate-90" : ""}`}
                        style={{
                          color: active ? "#FFFFFF" : themeUtils.getTextColor(false),
                        }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200"
                    style={{
                      background: active
                        ? theme.headerBg
                        : "transparent",
                      color: active
                        ? "#FFFFFF"
                        : themeUtils.getTextColor(false),
                      borderLeft: active
                        ? `4px solid #FFFFFF`
                        : "4px solid transparent",
                      fontWeight: active ? "600" : "400",
                    }}
                    onClick={() =>
                      window.innerWidth < 1024 && setSidebarOpen(false)
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = themeUtils.getBgColor("hover");
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: active ? "#FFFFFF" : themeUtils.getTextColor(false),
                      }}
                    />
                    {!isSidebarCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </Link>
                )}

                {item.hasSub && open && !isSidebarCollapsed && (
                  <div className="ml-5 mt-1 space-y-2">
                    {item.subItems.map((sub) => {
                      const SubIcon = iconMap[sub.icon] || FileText;
                      const subActive = location.pathname === sub.path;

                      return (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          className="flex items-center gap-2 px-2 py-1 rounded-lg text-sm transition-all duration-200"
                          style={{
                            backgroundColor: subActive
                              ? theme.headerBg
                              : "transparent",
                            color: subActive
                              ? "#FFFFFF"
                              : themeUtils.getTextColor(false),
                            borderLeft: subActive
                              ? `4px solid #FFFFFF`
                              : "4px solid transparent",
                            fontWeight: subActive ? "400" : "400",
                          }}
                          onMouseEnter={(e) => {
                            if (!subActive) {
                              e.currentTarget.style.backgroundColor = themeUtils.getBgColor("hover");
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!subActive) {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }
                          }}
                        >
                          <SubIcon
                            className="w-4 h-4"
                            style={{
                              color: subActive ? "#FFFFFF" : themeUtils.getTextColor(false),
                            }}
                          />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;