// Header.js
import { Menu } from "lucide-react";
import ProfileDropdown from "../Profile/ProfileDropdown";
import { useTheme } from "../Settings/themeUtils";
import { useState, useEffect } from "react";

const Header = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const { theme, themeUtils, ThemeToggleButton } = useTheme();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/me`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const data = await res.json();

        if (data.success) {
          setProfile({
            name: data.profile.full_name || "",
            email: data.profile.email || "",
            avatar: data.profile.profile_image || "",
          });
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header
      className="shadow-md z-30 transition-colors duration-300 border-b"
      style={{
        backgroundColor: themeUtils.getBgColor("card"),
        borderColor: themeUtils.getBorderColor(),
      }}
    >
      <div className="relative flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 lg:px-8">

        {/* LEFT SECTION (Menu + Logo on Mobile/Tablet) */}
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.headerBg
                  ? `${theme.headerBg}10`
                  : "transparent",
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
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Logo (Left on mobile/tablet) */}
          <div className="sm:hidden">
            <img
              src="/src/assets/Images/logo_vlc.png"
              alt="Logo"
              className="max-h-8 object-contain"
            />
          </div>
        </div>

        {/* Center Logo (Desktop Only) */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
          <img
            src="/src/assets/Images/logo_vlc.png"
            alt="Logo"
            className="max-h-10 md:max-h-12 object-contain"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleButton />
          <ProfileDropdown user={profile} onLogout={onLogout} />
        </div>

      </div>
    </header>
  );
};

export default Header;