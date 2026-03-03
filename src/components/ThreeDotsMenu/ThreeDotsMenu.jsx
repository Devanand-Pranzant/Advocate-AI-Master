// components/Common/ThreeDotsMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { MoreVertical, Eye, Edit, Trash2, Mail, Download, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useTheme } from "../Settings/themeUtils";

const ThreeDotsMenu = ({
  onView,
  onEdit,
  onDelete,
  onEmail,
  onDownload,
  onApprove,
  onReject,
  onExecute,
  viewTitle = "View",
  editTitle = "Edit",
  deleteTitle = "Delete",
  emailTitle = "Send Email",
  downloadTitle = "Download",
  approveTitle = "Approve",
  rejectTitle = "Reject",
  executeTitle = "Execute",
  menuAlignment = "right", // "left" or "right"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const { theme, themeUtils } = useTheme();

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      let top = rect.bottom + scrollY + 5; // 5px gap
      let left = rect.left + scrollX;

      // Adjust for right alignment (shifting left by menu width approx 192px)
      if (menuAlignment === "right") {
        // We estimate width as w-48 (12rem = 192px) + padding/borders
        // To be safe and precise, we can allow it to render or just use standard width
        left = (rect.right + scrollX) - 192;
      }

      // Screen edge guard
      if (left < 10) left = 10;

      setPosition({ top, left });
    }
  };

  // Close on window resize or scroll to avoid detached menu
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  // Close menu when any action is clicked
  const handleActionClick = (action) => {
    return (e) => {
      e.stopPropagation();
      setIsOpen(false);
      if (action) action();
    };
  };

  // Get icon color based on theme mode
  const getIconColor = () => {
    return theme.mode === "Dark" ? "#FFFFFF" : "#4B5563";
  };

  // Get text color based on theme mode
  const getTextColor = () => {
    return theme.mode === "Dark" ? "#E5E7EB" : "#374151";
  };

  // Get hover background color based on theme mode
  const getHoverBgColor = () => {
    return theme.mode === "Dark" ? "#374151" : "#F9FAFB";
  };

  // Portal Content
  const menuContent = (
    <>
      {/* Transparent backdrop for click-outside */}
      <div
        className="fixed inset-0 z-[9998] cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      />

      {/* Menu Dropdown */}
      <div
        className="absolute z-[9999] w-48 rounded-lg shadow-xl py-2"
        style={{
          top: position.top,
          left: position.left,
          backgroundColor: themeUtils.getCardBgColor(),
          border: `1px solid ${themeUtils.getBorderColor()}`,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu container
      >
        {/* View option */}
        {onView && (
          <button
            onClick={handleActionClick(onView)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: getTextColor() }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getHoverBgColor()}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Eye className="w-4 h-4 mr-3" style={{ color: getIconColor() }} />
            {viewTitle}
          </button>
        )}

        {/* Edit option */}
        {onEdit && (
          <button
            onClick={handleActionClick(onEdit)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: getTextColor() }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getHoverBgColor()}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Edit className="w-4 h-4 mr-3" style={{ color: getIconColor() }} />
            {editTitle}
          </button>
        )}

        {/* Email option */}
        {onEmail && (
          <button
            onClick={handleActionClick(onEmail)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: getTextColor() }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getHoverBgColor()}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Mail className="w-4 h-4 mr-3" style={{ color: getIconColor() }} />
            {emailTitle}
          </button>
        )}

        {/* Download option */}
        {onDownload && (
          <button
            onClick={handleActionClick(onDownload)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: getTextColor() }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getHoverBgColor()}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Download className="w-4 h-4 mr-3" style={{ color: getIconColor() }} />
            {downloadTitle}
          </button>
        )}

        {/* Approve option */}
        {onApprove && (
          <button
            onClick={handleActionClick(onApprove)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: "#059669" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.mode === "Dark" ? "#064E3B" : "#D1FAE5"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
            {approveTitle}
          </button>
        )}

        {/* Reject option */}
        {onReject && (
          <button
            onClick={handleActionClick(onReject)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: "#DC2626" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.mode === "Dark" ? "#7F1D1D" : "#FEE2E2"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <XCircle className="w-4 h-4 mr-3 text-red-600" />
            {rejectTitle}
          </button>
        )}

        {/* Execute option */}
        {onExecute && (
          <button
            onClick={handleActionClick(onExecute)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: "#2563EB" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.mode === "Dark" ? "#1E3A8A" : "#DBEAFE"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <RefreshCw className="w-4 h-4 mr-3 text-blue-600" />
            {executeTitle}
          </button>
        )}

        {/* Delete option */}
        {onDelete && (
          <button
            onClick={handleActionClick(onDelete)}
            className="flex items-center w-full px-4 py-2.5 text-sm transition-colors"
            style={{ color: "#EF4444" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.mode === "Dark" ? "#7F1D1D" : "#FEE2E2"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <Trash2 className="w-4 h-4 mr-3" style={{ color: "#EF4444" }} />
            {deleteTitle}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggleMenu}
        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          backgroundColor: isOpen ? theme.bgColor : "transparent",
        }}
        title="Actions"
        aria-label="Open action menu"
      >
        <MoreVertical
          className="w-4 h-4"
          style={{ color: getIconColor() }}
        />
      </button>

      {isOpen && ReactDOM.createPortal(menuContent, document.body)}
    </>
  );
};

export default ThreeDotsMenu;