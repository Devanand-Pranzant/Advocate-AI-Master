import React, { createContext, useState, useEffect, useContext } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

// ✅ Luxury Black Gold as default color
const defaultColor = {
  dark: "#806633", // Gold
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
      className="relative inline-flex items-center pl-0 h-8 w-15 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      style={{
        backgroundColor: theme.mode === "Dark" ? "#D6D3D1" : "#0F172B",
      }}
      aria-label="Toggle dark/light mode"
    >
      <span
        className="inline-block w-6 h-6 transform transition-transform duration-300 ease-in-out rounded-full bg-transparent shadow-lg flex items-center justify-center"
        style={{
          transform:
            theme.mode === "Dark" ? "translateX(30px)" : "translateX(4px)",
        }}
      >
        {theme.mode === "Dark" ? (
          <Moon className="w-4 h-4 mt-1 ml-1 text-gray-800" />
        ) : (
          <Sun className="w-4 h-4 mt-1 ml-1 text-yellow-500" />
        )}
      </span>
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