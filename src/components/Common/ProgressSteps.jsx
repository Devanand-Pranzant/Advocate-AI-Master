// src/components/Common/ProgressSteps.jsx
import React from "react";
import { CheckCircle } from "lucide-react";
import { useTheme } from '../../components/Settings/themeUtils';

const ProgressSteps = ({ 
  steps = [], 
  currentStep = 1,
  onStepClick,
  showConnectors = true,
  size = "md",
  variant = "default",
  className = ""
}) => {
  const { themeUtils } = useTheme();
  
  // Size configuration
  const sizeClasses = {
    sm: {
      step: "w-8 h-8 text-sm",
      connector: "h-1",
      label: "text-xs",
      icon: "w-4 h-4"
    },
    md: {
      step: "w-10 h-10 text-base",
      connector: "h-1.5",
      label: "text-sm",
      icon: "w-5 h-5"
    },
    lg: {
      step: "w-12 h-12 text-lg",
      connector: "h-2",
      label: "text-base",
      icon: "w-6 h-6"
    }
  };

  // Get variant colors from themeUtils
  const getVariantColors = () => {
    switch(variant) {
      case "success":
        return {
          completed: {
            bg: themeUtils.getSuccessColor(),
            text: themeUtils.getSuccessColor(),
            border: themeUtils.getSuccessColor(),
            light: themeUtils.getLightBgColor(),
            icon: "#FFFFFF"
          },
          current: {
            bg: themeUtils.getSuccessColor(),
            text: themeUtils.getSuccessColor(),
            border: themeUtils.getSuccessColor(),
            light: themeUtils.getLightBgColor(),
            icon: "#FFFFFF"
          },
          upcoming: {
            bg: themeUtils.getLightBgColor(),
            text: themeUtils.getTextColor(false),
            border: themeUtils.getBorderColor(),
            light: themeUtils.getInputBgColor(),
            icon: themeUtils.getTextColor(false)
          }
        };
      case "primary":
      case "default":
      default:
        return {
          completed: {
            bg: themeUtils.getPrimaryColor(),
            text: themeUtils.getPrimaryColor(),
            border: themeUtils.getPrimaryColor(),
            light: themeUtils.getLightBgColor(),
            icon: "#FFFFFF"
          },
          current: {
            bg: themeUtils.getPrimaryColor(),
            text: themeUtils.getPrimaryColor(),
            border: themeUtils.getPrimaryColor(),
            light: themeUtils.getLightBgColor(),
            icon: "#FFFFFF"
          },
          upcoming: {
            bg: themeUtils.getLightBgColor(),
            text: themeUtils.getTextColor(false),
            border: themeUtils.getBorderColor(),
            light: themeUtils.getInputBgColor(),
            icon: themeUtils.getTextColor(false)
          }
        };
    }
  };

  const sizeConfig = sizeClasses[size];
  const colors = getVariantColors();

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "upcoming";
  };

  // Helper function to get border class based on theme mode
  const getBorderClass = () => {
    return "border-2";
  };

  // Helper function to get ring color for current step
  const getRingColor = () => {
    if (variant === "success") return "ring-green-200 dark:ring-green-900/30";
    return "ring-blue-200 dark:ring-blue-900/30";
  };

  // Helper function to get focus ring color
  const getFocusRingColor = () => {
    if (variant === "success") return "focus:ring-green-500";
    return "focus:ring-blue-500";
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Steps container */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(stepNumber);
          const stepColors = colors[status];
          const isClickable = onStepClick && stepNumber <= currentStep;
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step.number || stepNumber}>
              {/* Step */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center rounded-full 
                    transition-all duration-300 ${sizeConfig.step}
                    ${getBorderClass()}
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                    ${status === 'current' ? `ring-2 ring-offset-2 ${getRingColor()}` : ''}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${getFocusRingColor()}
                  `}
                  style={{
                    backgroundColor: stepColors.bg,
                    borderColor: stepColors.border,
                    color: stepColors.icon
                  }}
                >
                  {status === 'completed' ? (
                    <CheckCircle className={sizeConfig.icon} style={{ color: stepColors.icon }} />
                  ) : step.icon ? (
                    <div style={{ color: stepColors.icon }}>
                      {step.icon}
                    </div>
                  ) : (
                    <span className="font-semibold" style={{ color: stepColors.icon }}>
                      {step.number || stepNumber}
                    </span>
                  )}

                  {/* Active pulse animation for current step */}
                  {status === "current" && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ backgroundColor: stepColors.bg }}
                    />
                  )}
                </button>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <div 
                    className={`font-medium ${sizeConfig.label}`}
                    style={{ color: stepColors.text }}
                  >
                    {step.title || `Step ${stepNumber}`}
                  </div>
                  {step.description && (
                    <div 
                      className={`${sizeConfig.label} mt-0.5 hidden md:block`}
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector (except for last step) */}
              {showConnectors && !isLastStep && (
                <div className="flex-1 mx-2">
                  <div 
                    className={`w-full ${sizeConfig.connector} transition-all duration-300`}
                    style={{
                      backgroundColor: stepNumber < currentStep ? colors.completed.bg : colors.upcoming.bg
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar for mobile view */}
      <div className="mt-4 md:hidden">
        <div className="relative">
          <div 
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ backgroundColor: colors.upcoming.bg }}
          >
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: `${(currentStep / steps.length) * 100}%`,
                backgroundColor: colors.current.bg
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const status = getStepStatus(stepNumber);
              return (
                <div key={stepNumber} className="text-center">
                  <div 
                    className={`text-xs`}
                    style={{ color: colors[status].text }}
                  >
                    {stepNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;