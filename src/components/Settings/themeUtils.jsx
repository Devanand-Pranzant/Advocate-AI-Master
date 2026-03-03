import React, { createContext, useState, useEffect, useContext } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

// ✅ Luxury Black Gold as default color
const defaultColor = {
  dark: "linear-gradient(270deg, rgba(128, 102, 51, 1) 4%, rgba(255, 212, 127, 1) 50%, rgba(128, 102, 51, 1) 96%)", // Gold
  light: "#000000", // Black
};

const defaultTheme = {
  mode: "Dark", // ✅ DARK MODE DEFAULT
  headerBg: defaultColor.dark,
  navbarBg: defaultColor.light,
  mood: "Night", // ✅ NIGHT MOOD DEFAULT
  activeColorCategory: "primary",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem("Theme");
    if (saved) {
      try {
        setTheme({ ...defaultTheme, ...JSON.parse(saved) });
      } catch {
        setTheme(defaultTheme);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--header-bg", theme.headerBg);
    root.style.setProperty("--navbar-bg", theme.navbarBg);

    document.body.className = document.body.className
      .replace(/mood-\w+/g, "")
      .replace(/mode-\w+/g, "")
      .trim();
    document.body.classList.add(`mood-${theme.mood.toLowerCase()}`);
    document.body.classList.add(`mode-${theme.mode.toLowerCase()}`);
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const toggleThemeMode = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "Dark" ? "Light" : "Dark",
      mood: prev.mode === "Dark" ? "Day" : "Night",
    }));
  };

  const themeUtils = {
    getTextColor: (isPrimary = true) => {
      return theme.mode === "Dark"
        ? isPrimary
          ? "#FFFFFF"
          : "#E5E7EB"
        : isPrimary
        ? "#1F2937"
        : "#414345";
    },
    getBgColor: (variant = "default") => {
      if (variant === "card")
        return theme.mood === "Day" ? "#FFFFFF" : "#1F2937";
      if (variant === "input")
        return theme.mood === "Day" ? "#F9FAFB" : "#374151";
      if (variant === "hover")
        return theme.mood === "Day" ? "#F3F4F6" : "#374151";
      return theme.mood === "Day" ? "#F9FAFB" : "#111827";
    },
    getBorderColor: () => (theme.mood === "Day" ? "#E5E7EB" : "#374151"),
    getBgGradient: () =>
      theme.mood === "Day"
        ? "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        : "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950",
    
    getPrimaryColor: (opacity = 1) => {
      if (opacity < 1) {
        const baseColor = theme.mode === "Dark" ? "#806633" : "#806633"; // Gold
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return theme.mode === "Dark" ? "#806633" : "#806633"; // Gold
    },
    
    getSuccessColor: () => theme.mode === "Dark" ? "#10B981" : "#059669",
    getWarningColor: () => theme.mode === "Dark" ? "#F59E0B" : "#D97706",
    getErrorColor: () => theme.mode === "Dark" ? "#EF4444" : "#DC2626",
    getInfoColor: () => theme.mode === "Dark" ? "#3B82F6" : "#2563EB",
    
    getLightBgColor: () => theme.mode === "Dark" ? "#374151" : "#F3F4F6",
    getCardBgColor: () => theme.mode === "Dark" ? "#1F2937" : "#FFFFFF",
    getInputBgColor: () => theme.mode === "Dark" ? "#374151" : "#F9FAFB",
  };

 const ThemeToggleButton = () => (
  <button
    onClick={toggleThemeMode}
    className="relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group"
    style={{
      backgroundColor: theme.mode === "Dark" ? "#1E293B" : "#FBBF24",
      boxShadow: theme.mode === "Dark" 
        ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)" 
        : "inset 0 2px 4px rgba(255,255,255,0.5), 0 0 0 1px rgba(0,0,0,0.1)"
    }}
    aria-label="Toggle dark/light mode"
  >
    {/* Background stars for dark mode */}
    {theme.mode === "Dark" && (
      <>
        <span className="absolute left-1.5 top-1 w-0.5 h-0.5 bg-white rounded-full opacity-70 animate-ping" style={{ animationDuration: '3s' }}></span>
        <span className="absolute left-3 top-2 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-ping" style={{ animationDuration: '2.5s' }}></span>
        <span className="absolute left-5 top-1.5 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-ping" style={{ animationDuration: '4s' }}></span>
      </>
    )}
    
    {/* Background clouds/rays for light mode */}
    {theme.mode === "Light" && (
      <>
        <span className="absolute right-2 top-1 w-1 h-1 bg-yellow-100 rounded-full blur-[1px] animate-pulse"></span>
        <span className="absolute right-4 top-2 w-1.5 h-1.5 bg-yellow-100 rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '0.2s' }}></span>
      </>
    )}
    
    <span
      className="inline-block w-6 h-6 transform transition-all duration-500 ease-out rounded-full shadow-lg flex items-center justify-center overflow-hidden backdrop-blur-sm"
      style={{
        transform: theme.mode === "Dark" ? "translateX(34px)" : "translateX(4px)",
        backgroundColor: theme.mode === "Dark" ? "#0F172A" : "#FFFFFF",
        boxShadow: theme.mode === "Dark"
          ? "0 4px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2)"
          : "0 4px 8px rgba(251, 191, 36, 0.3), 0 0 0 1px rgba(255,255,255,0.8)"
      }}
    >
      {/* Moon with craters */}
      {theme.mode === "Dark" ? (
        <div className="abdsolute w-full h-full flex items-center justify-center">
          <Moon className="w-4 h-4 text-indigo-200" />
          <span className="absolute -top-0.5 left-1 w-1 h-1 bg-indigo-300 rounded-full opacity-50"></span>
          <span className="absolute top-1.5 left-2 w-0.5 h-0.5 bg-indigo-300 rounded-full opacity-50"></span>
        </div>
      ) : (
        /* Sun with rays */
        <div className="abdsolute w-full h-full flex items-center justify-center">
          <Sun className="w-4 h-4  text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="absolute -inset-1 rounded-full bg-amber-300 blur-[2px] -z-10 opacity-30 animate-pulse"></span>
        </div>
      )}
    </span>
    
    {/* Labels with modern font */}
    <span className={`absolute text-[9px] font-medium transition-all duration-500 ${
      theme.mode === "Dark" 
        ? "left-2 opacity-100 text-indigo-200" 
        : "left-2 opacity-0 text-transparent"
    }`}>DARK</span>
    <span className={`absolute text-[9px] font-medium transition-all duration-500 ${
      theme.mode === "Light" 
        ? "right-2 opacity-100 text-amber-700" 
        : "right-2 opacity-0 text-transparent"
    }`}>LIGHT</span>
  </button>
);

  return (
    <ThemeContext.Provider
      value={{ theme, updateTheme, themeUtils, ThemeToggleButton }}
    >
      {children}
    </ThemeContext.Provider>
  );
};