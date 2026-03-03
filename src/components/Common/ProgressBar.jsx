// src/components/Common/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ 
  value, 
  max = 100,
  color = "#3b82f6",
  showLabel = false,
  height = "h-2",
  borderRadius = "rounded-full",
  className = ""
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm mb-1">
        {showLabel && (
          <>
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          </>
        )}
      </div>
      <div 
        className={`w-full bg-gray-200 overflow-hidden ${height} ${borderRadius}`}
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
      >
        <div 
          className={`h-full transition-all duration-300 ${borderRadius}`}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;