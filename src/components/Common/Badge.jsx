// src/components/Common/Badge.jsx
import React from "react";
import { useTheme } from "../Settings/themeUtils";

const Badge = ({ 
  children, 
  color = "gray", 
  size = "md", 
  variant = "filled",
  icon,
  className = "",
  onClick 
}) => {
  const { themeUtils } = useTheme();

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-1.5 text-sm",
  };

  const colorClasses = {
    gray: {
      filled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
    },
    blue: {
      filled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      outline: "border border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300"
    },
    green: {
      filled: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      outline: "border border-green-300 text-green-700 dark:border-green-600 dark:text-green-300"
    },
    yellow: {
      filled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      outline: "border border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300"
    },
    orange: {
      filled: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      outline: "border border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-300"
    },
    red: {
      filled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      outline: "border border-red-300 text-red-700 dark:border-red-600 dark:text-red-300"
    },
    purple: {
      filled: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      outline: "border border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300"
    },
    pink: {
      filled: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      outline: "border border-pink-300 text-pink-700 dark:border-pink-600 dark:text-pink-300"
    },
  };

  const baseClasses = "inline-flex items-center font-medium rounded-full";

  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${colorClasses[color][variant]}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;