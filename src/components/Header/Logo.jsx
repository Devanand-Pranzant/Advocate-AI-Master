
import { useTheme } from "../Settings/themeUtils";

import RajyugLogo from "../../assets/img/BTU-Logo-removebg-preview.png"; 

const Logo = ({ isCollapsed }) => {
  const { theme, themeUtils } = useTheme();

  return (
    <div className="flex items-left gap-3 ">
    
      <img
        src={RajyugLogo}
        alt="Rajyug Logo"
        className={`h-10 w-auto transition-all duration-300 object-contain mr-40 ${
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default Logo;