import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useTheme } from "../../components/Settings/themeUtils";

// PrimeReact Toast
import { Toast } from "primereact/toast";

const SweetAlert = ({
  type = "success",
  title,
  message,
  showConfirm = true,
  confirmText = "OK",
  showCancel = false,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  autoClose = false,
  autoCloseTime = 3000,
  variant = "modal",
  confirmVariant = "primary",
  cancelVariant = "default",
  id, // Add unique ID to prevent duplicates
}) => {
  const { themeUtils } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const toastRef = useRef(null);
  const hasShownToast = useRef(false); // Track if toast has been shown

  // Auto-close logic
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, autoCloseTime]);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Show PrimeReact toast when in toast mode
  useEffect(() => {
    // Only show toast if it's visible and hasn't been shown yet
    if (!isVisible || !toastRef.current || hasShownToast.current) return;

    if (variant === "toast" || (!showConfirm && !showCancel)) {
      const severityMap = {
        success: "success",
        error: "error",
        warning: "warn",
        info: "info",
      };

      const severity = severityMap[type] || "info";
      
      // Mark as shown to prevent duplicate
      hasShownToast.current = true;

      toastRef.current.show({
        severity,
        summary: title || type.charAt(0).toUpperCase() + type.slice(1),
        detail: message,
        life: autoClose ? autoCloseTime : 3000,
        closable: true,
      });

      // Auto close after toast disappears
      if (autoClose) {
        setTimeout(() => {
          handleClose();
        }, autoCloseTime + 400);
      }
    }
  }, [isVisible, variant, type, title, message, autoClose, autoCloseTime, showConfirm, showCancel]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  // TOAST MODE
  if (variant === "toast" || (!showConfirm && !showCancel)) {
    return <Toast ref={toastRef} position="top-right" />;
  }

  // MODAL MODE
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <div
        className="rounded-xl border shadow-2xl max-w-md w-full"
        style={{
          backgroundColor: themeUtils.getBgColor("card"),
          borderColor: themeUtils.getBorderColor(),
        }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">{icons[type]}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: themeUtils.getTextColor(true) }}
                >
                  {title}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10"
                >
                  <X
                    className="w-5 h-5"
                    style={{ color: themeUtils.getTextColor(false) }}
                  />
                </button>
              </div>
              <p
                className="text-sm"
                style={{ color: themeUtils.getTextColor(false) }}
              >
                {message}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            {showCancel && (
              <button
                onClick={handleCancel}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  cancelVariant === "danger" ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    cancelVariant === "danger"
                      ? "#ef4444"
                      : cancelVariant === "success"
                      ? "#10b981"
                      : themeUtils.getBgColor("hover"),
                  color:
                    cancelVariant === "danger" || cancelVariant === "success"
                      ? "#fff"
                      : themeUtils.getTextColor(true),
                }}
              >
                {cancelText}
              </button>
            )}

            {showConfirm && (
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor:
                    confirmVariant === "success" || type === "success"
                      ? "#10b981"
                      : confirmVariant === "danger" || type === "error"
                      ? "#ef4444"
                      : confirmVariant === "warning" || type === "warning"
                      ? "#f59e0b"
                      : "#3b82f6",
                }}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated hook with unique ID generation
export const useSweetAlert = () => {
  const [alertConfig, setAlertConfig] = useState(null);
  const alertIdRef = useRef(0);

  const showAlert = (config) => {
    // Generate a unique ID for each alert
    const newId = ++alertIdRef.current;
    setAlertConfig({ ...config, id: newId });
  };

  const AlertComponent = () => {
    if (!alertConfig) return null;
    // Use the unique ID as key to prevent React from reusing components
    return <SweetAlert key={alertConfig.id} {...alertConfig} onClose={() => setAlertConfig(null)} />;
  };

  return { showAlert, AlertComponent };
};

export default SweetAlert;