// src/components/Common/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check, Search, X } from "lucide-react";
import { useTheme } from "../Settings/themeUtils";
const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  searchable = false,
  multiSelect = false,
  className = "",
  size = "medium",
  variant = "default",
  error = false,
  errorMessage = "",
  label = "",
  required = false,
  helpText = "",
  clearable = false,
}) => {
  const { themeUtils } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Size classes
  const sizeClasses = {
    small: "text-sm py-1.5 px-3",
    medium: "text-sm py-2.5 px-4",
    large: "text-base py-3 px-4",
  };

  // Variant styles
  const variantStyles = {
    default: {
      background: themeUtils.getBgColor("base"),
      border: `1px solid ${themeUtils.getBorderColor()}`,
      hoverBackground: themeUtils.getBgColor("hover"),
      focusBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
    },
    outline: {
      background: "transparent",
      border: `2px solid ${themeUtils.getBorderColor()}`,
      hoverBackground: themeUtils.getBgColor("hover"),
      focusBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
    },
    filled: {
      background: themeUtils.getBgColor("hover"),
      border: `1px solid transparent`,
      hoverBackground: themeUtils.getBgColor("hover", 0.8),
      focusBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
    },
  };

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens and searchable is true
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
        
        case "Tab":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
        
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  // Get selected option(s)
  const getSelectedOptions = () => {
    if (multiSelect) {
      return options.filter(option => 
        Array.isArray(value) ? value.includes(option.value) : false
      );
    }
    return options.find(option => option.value === value);
  };

  // Handle selection
  const handleSelect = (selectedValue) => {
    if (disabled) return;

    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter(v => v !== selectedValue)
        : [...currentValues, selectedValue];
      
      onChange(newValues);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Handle clear selection
  const handleClear = (event) => {
    event.stopPropagation();
    if (multiSelect) {
      onChange([]);
    } else {
      onChange(null);
    }
  };

  // Get display text
  const getDisplayText = () => {
    const selected = getSelectedOptions();
    
    if (multiSelect) {
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) return selected[0].label;
      return `${selected.length} selected`;
    }
    
    return selected ? selected.label : placeholder;
  };

  // Check if option is selected
  const isSelected = (optionValue) => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Render selected items for multi-select
  const renderSelectedItems = () => {
    const selected = getSelectedOptions();
    
    if (!multiSelect || selected.length === 0) {
      return (
        <span className={`truncate ${!value ? "opacity-70" : ""}`}>
          {getDisplayText()}
        </span>
      );
    }

    if (selected.length <= 2) {
      return (
        <div className="flex flex-wrap gap-1 truncate">
          {selected.map(option => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full truncate"
              style={{
                backgroundColor: themeUtils.getPrimaryColor?.() || "#3F6289",
                color: "white",
              }}
            >
              {option.label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                className="hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full"
          style={{
            backgroundColor: themeUtils.getPrimaryColor?.() || "#3F6289",
            color: "white",
          }}
        >
          {selected.length}
        </span>
        <span>items selected</span>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block mb-2 text-sm font-medium"
          style={{ color: themeUtils.getTextColor(true) }}>
          {label}
          {required && (
            <span className="ml-1" style={{ color: themeUtils.getErrorColor?.() || "#DC2626" }}>
              *
            </span>
          )}
        </label>
      )}

      {/* Dropdown Trigger */}
      <div
        className={`relative w-full rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-between ${sizeClasses[size]} ${
          disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-sm"
        } ${error ? "ring-2 ring-red-500" : ""}`}
        style={{
          backgroundColor: variantStyles[variant].background,
          border: variantStyles[variant].border,
          color: themeUtils.getTextColor(true),
        }}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearchTerm("");
              setHighlightedIndex(-1);
            }
          }
        }}
        onMouseEnter={() => {
          if (!disabled && !isOpen) {
            // Optional hover effect
          }
        }}
        onMouseLeave={() => {
          // Optional hover effect cleanup
        }}
      >
        {/* Selected Value Display */}
        <div className="flex-1 overflow-hidden">
          {renderSelectedItems()}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 ml-2">
          {/* Clear Button */}
          {clearable && value && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              style={{ color: themeUtils.getTextColor(false, true) }}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Dropdown Icon */}
          <div style={{ color: themeUtils.getTextColor(false, true) }}>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-xs" style={{ color: themeUtils.getErrorColor?.() || "#DC2626" }}>
          {errorMessage}
        </p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="mt-1 text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
          {helpText}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-1 rounded-lg shadow-xl border overflow-hidden"
          style={{
            backgroundColor: themeUtils.getBgColor("card"),
            borderColor: themeUtils.getBorderColor(),
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: themeUtils.getTextColor(false, true) }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-10 pr-3 py-2 text-sm rounded border"
                  style={{
                    backgroundColor: themeUtils.getBgColor("base"),
                    borderColor: themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm"
                style={{ color: themeUtils.getTextColor(false, true) }}>
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = isSelected(option.value);
                const highlighted = index === highlightedIndex;
                
                return (
                  <div
                    key={option.value}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                      option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-50"
                    } ${highlighted ? "bg-opacity-70" : ""}`}
                    style={{
                      backgroundColor: highlighted
                        ? `${themeUtils.getPrimaryColor?.() || "#3F6289"}20`
                        : selected
                        ? `${themeUtils.getPrimaryColor?.() || "#3F6289"}10`
                        : "transparent",
                      color: option.disabled
                        ? themeUtils.getTextColor(false, true)
                        : themeUtils.getTextColor(true),
                    }}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                    onMouseLeave={() => setHighlightedIndex(-1)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox for multi-select */}
                      {multiSelect && (
                        <div className={`w-4 h-4 flex items-center justify-center rounded border ${
                          selected ? "border-transparent" : ""
                        }`}
                          style={{
                            backgroundColor: selected
                              ? (themeUtils.getPrimaryColor?.() || "#3F6289")
                              : themeUtils.getBgColor("base"),
                            borderColor: selected
                              ? "transparent"
                              : themeUtils.getBorderColor(),
                          }}
                        >
                          {selected && (
                            <Check className="w-3 h-3" style={{ color: "white" }} />
                          )}
                        </div>
                      )}
                      
                      {/* Option Icon */}
                      {option.icon && (
                        <span style={{ color: themeUtils.getTextColor(false, true) }}>
                          {option.icon}
                        </span>
                      )}
                      
                      {/* Option Label */}
                      <span className={option.disabled ? "opacity-70" : ""}>
                        {option.label}
                      </span>
                    </div>
                    
                    {/* Single Select Checkmark */}
                    {!multiSelect && selected && (
                      <Check className="w-4 h-4"
                        style={{ color: themeUtils.getPrimaryColor?.() || "#3F6289" }} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Count for Multi-select */}
          {multiSelect && getSelectedOptions().length > 0 && (
            <div className="px-4 py-2 border-t text-xs"
              style={{
                borderColor: themeUtils.getBorderColor(),
                backgroundColor: themeUtils.getBgColor("hover"),
                color: themeUtils.getTextColor(false, true),
              }}>
              {getSelectedOptions().length} item(s) selected
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;