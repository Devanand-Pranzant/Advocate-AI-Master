import React from "react";
import { useTheme } from "../Settings/themeUtils";

const Footer = () => {
  const { theme, themeUtils } = useTheme();

  return (
    <footer
      className="border-t fixed bottom-0 left-0 right-0 z-30 transition-colors duration-300"
      style={{
        backgroundColor: themeUtils.getBgColor("card"), // ✅ Updated to match theme pattern
        borderColor: themeUtils.getBorderColor(),
        height: "4vh", // Takes exactly 4% of viewport height
      }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-center px-2">
        <p
          className="text-sm"
          style={{ color: themeUtils.getTextColor(false) }}
        >
          © 2025 RajYug IT Solutions LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;