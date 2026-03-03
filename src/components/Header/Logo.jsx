import { useTheme } from "../Settings/themeUtils";
import RajyugLogo from "../../assets/images/law-logo.png"; 

const Logo = ({ isCollapsed }) => {
  const { theme, themeUtils } = useTheme();

  return (
    <div className="flex items-center justify-center w-full">
      <img
        src={RajyugLogo}
        alt="Rajyug Logo"
        className={`h-10 w-auto transition-all duration-300 object-contain ${
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default Logo;