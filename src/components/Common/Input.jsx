// src/components/Common/Input.jsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { 
  Eye, EyeOff, Search, X, Calendar, 
  DollarSign, Percent, User, Mail, 
  Phone, Lock, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp
} from "lucide-react";
import { useTheme } from "../Settings/themeUtils";

const Input = forwardRef((props, ref) => {
  const {
    type = "text",
    value,
    onChange,
    placeholder = "",
    label = "",
    error = false,
    errorMessage = "",
    success = false,
    successMessage = "",
    disabled = false,
    readOnly = false,
    required = false,
    helpText = "",
    prefix = null,
    suffix = null,
    size = "medium",
    variant = "default",
    className = "",
    fullWidth = false,
    min,
    max,
    step,
    rows = 3,
    maxLength,
    showCount = false,
    clearable = false,
    onClear,
    autoFocus = false,
    pattern,
    icon: IconComponent = null,
    iconPosition = "left",
    onIconClick,
    mask,
    format,
    validate,
    debounce = 0,
    loading = false,
    loadingPosition = "right",
    showPasswordToggle = true,
    ...restProps
  } = props;

  const { themeUtils } = useTheme();
  const [localValue, setLocalValue] = useState(value || "");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.toString().length || 0);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const inputRef = React.useRef(null);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    getValue: () => localValue,
    setValue: (val) => handleChange({ target: { value: val } }),
    clear: () => handleClear(),
  }));

  // Size classes
  const sizeClasses = {
    small: "text-xs py-1 px-3",
    medium: "text-sm py-1 px-3",
    large: "text-base py-1 px-4",
  };

  // Variant styles
  const variantStyles = {
    default: {
      background: themeUtils.getBgColor("base"),
      border: `1px solid ${themeUtils.getBorderColor()}`,
      hoverBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
      focusBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
      focusRing: "0 0 0 3px rgba(63, 98, 137, 0.1)",
      disabledBackground: themeUtils.getBgColor("hover"),
    },
    outline: {
      background: "transparent",
      border: `2px solid ${themeUtils.getBorderColor()}`,
      hoverBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
      focusBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
      focusRing: "0 0 0 3px rgba(63, 98, 137, 0.1)",
      disabledBackground: themeUtils.getBgColor("hover", 0.3),
    },
    filled: {
      background: themeUtils.getBgColor("hover"),
      border: `1px solid transparent`,
      hoverBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
      focusBorder: themeUtils.getPrimaryColor?.() || "#3F6289",
      focusRing: "0 0 0 3px rgba(63, 98, 137, 0.1)",
      disabledBackground: themeUtils.getBgColor("hover", 0.5),
    },
    minimal: {
      background: "transparent",
      border: `0px solid transparent`,
      hoverBorder: "transparent",
      focusBorder: "transparent",
      focusRing: "none",
      disabledBackground: "transparent",
    },
  };

  // Icon based on input type
  const getTypeIcon = () => {
    switch (type) {
      case 'search':
        return <Search className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'tel':
        return <Phone className="w-4 h-4" />;
      case 'password':
        return <Lock className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Get actual input type
  const getInputType = () => {
    if (type === 'password' && showPassword) {
      return 'text';
    }
    return type;
  };

  // Handle value change
  const handleChange = (e) => {
    let newValue = e.target.value;
    
    // Apply mask if provided
    if (mask && typeof mask === 'function') {
      newValue = mask(newValue);
    }
    
    // Apply format if provided
    if (format && typeof format === 'function') {
      newValue = format(newValue);
    }
    
    // Validate pattern
    if (pattern && newValue) {
      const regex = new RegExp(pattern);
      if (!regex.test(newValue)) {
        return;
      }
    }
    
    // Update character count
    if (maxLength !== undefined) {
      setCharCount(newValue.length);
    }
    
    // Update local value
    setLocalValue(newValue);
    
    // Handle debounce
    if (debounce > 0) {
      clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        onChange?.(newValue);
      }, debounce);
      setDebounceTimer(timer);
    } else {
      onChange?.(newValue);
    }
  };

  // Handle clear
  const handleClear = () => {
    setLocalValue("");
    setCharCount(0);
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    restProps.onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    
    // Validate on blur if validate function provided
    if (validate && typeof validate === 'function') {
      const isValid = validate(localValue);
      if (!isValid && localValue) {
        // Trigger error state if needed
      }
    }
    
    restProps.onBlur?.(e);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Get icon color based on state
  const getIconColor = () => {
    if (error) return themeUtils.getErrorColor?.() || "#DC2626";
    if (success) return themeUtils.getSuccessColor?.() || "#059669";
    if (disabled) return themeUtils.getTextColor(false, true);
    return themeUtils.getTextColor(false, true);
  };

  // Get status icon
  const getStatusIcon = () => {
    if (loading) {
      return (
        <div className="animate-spin">
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent"
            style={{
              borderColor: themeUtils.getPrimaryColor?.() || "#3F6289",
            }}
          />
        </div>
      );
    }
    if (error) {
      return <AlertCircle className="w-4 h-4" style={{ color: getIconColor() }} />;
    }
    if (success) {
      return <CheckCircle className="w-4 h-4" style={{ color: getIconColor() }} />;
    }
    return null;
  };

  // Render prefix/suffix
  const renderAddon = (addon, position) => {
    if (!addon) return null;
    
    const isIcon = typeof addon === 'function' || React.isValidElement(addon);
    
    return (
      <div className={`flex items-center justify-center px-3 ${
        position === 'left' ? 'border-r' : 'border-l'
      }`}
        style={{
          borderColor: themeUtils.getBorderColor(),
          color: themeUtils.getTextColor(false, true),
        }}>
        {isIcon ? (
          typeof addon === 'function' ? addon() : addon
        ) : (
          <span className="text-sm">{addon}</span>
        )}
      </div>
    );
  };

  // Calculate input classes
  const inputClasses = `
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || readOnly ? 'cursor-not-allowed' : ''}
    transition-all duration-200
    ${variant === 'minimal' ? 'focus:outline-none' : 'focus:outline-none focus:ring-2'}
  `;

  // Calculate container classes
  const containerClasses = `
    relative
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Determine if we should show clear button
  const shouldShowClear = clearable && localValue && !disabled && !readOnly;

  // Determine if we should show password toggle
  const shouldShowPasswordToggle = 
    type === 'password' && showPasswordToggle && !disabled && !readOnly;

  // Render textarea
  if (type === 'textarea') {
    return (
      <div className={containerClasses}>
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

        {/* Textarea Container */}
        <div className={`relative rounded-lg border transition-all duration-200 ${
          isFocused ? 'ring-2' : ''
        } ${error ? 'border-red-500' : success ? 'border-green-500' : ''} ${
          disabled ? 'opacity-60' : ''
        }`}
          style={{
            backgroundColor: disabled 
              ? variantStyles[variant].disabledBackground
              : variantStyles[variant].background,
            borderColor: error
              ? themeUtils.getErrorColor?.() || "#DC2626"
              : success
              ? themeUtils.getSuccessColor?.() || "#059669"
              : isFocused
              ? variantStyles[variant].focusBorder
              : variantStyles[variant].border,
            boxShadow: isFocused ? variantStyles[variant].focusRing : 'none',
          }}>
          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={localValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            rows={rows}
            maxLength={maxLength}
            autoFocus={autoFocus}
            className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none ${
              disabled || readOnly ? 'cursor-not-allowed' : ''
            } ${sizeClasses[size]}`}
            style={{
              color: themeUtils.getTextColor(true),
            }}
            {...restProps}
          />

          {/* Character Count */}
          {showCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs"
              style={{ color: themeUtils.getTextColor(false, true) }}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && errorMessage && (
          <p className="mt-1 text-xs flex items-center gap-1"
            style={{ color: themeUtils.getErrorColor?.() || "#DC2626" }}>
            <AlertCircle className="w-3 h-3" />
            {errorMessage}
          </p>
        )}
        
        {success && successMessage && (
          <p className="mt-1 text-xs flex items-center gap-1"
            style={{ color: themeUtils.getSuccessColor?.() || "#059669" }}>
            <CheckCircle className="w-3 h-3" />
            {successMessage}
          </p>
        )}
        
        {helpText && !error && !success && (
          <p className="mt-1 text-xs"
            style={{ color: themeUtils.getTextColor(false, true) }}>
            {helpText}
          </p>
        )}
      </div>
    );
  }

  // Render regular input
  return (
    <div className={containerClasses}>
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

      {/* Input Container */}
      <div className={`relative rounded-lg border transition-all duration-200 flex items-center ${
        isFocused ? 'ring-2' : ''
      } ${error ? 'border-red-500' : success ? 'border-green-500' : ''} ${
        disabled ? 'opacity-60' : ''
      }`}
        style={{
          backgroundColor: disabled 
            ? variantStyles[variant].disabledBackground
            : variantStyles[variant].background,
          borderColor: error
            ? themeUtils.getErrorColor?.() || "#DC2626"
            : success
            ? themeUtils.getSuccessColor?.() || "#059669"
            : isFocused
            ? variantStyles[variant].focusBorder
            : variantStyles[variant].border,
          boxShadow: isFocused ? variantStyles[variant].focusRing : 'none',
        }}>
        {/* Prefix */}
        {prefix && iconPosition === 'left' && renderAddon(prefix, 'left')}
        
        {/* Icon (left) */}
        {IconComponent && iconPosition === 'left' && !prefix && (
          <div className="pl-3 pr-2"
            style={{ color: getIconColor() }}
            onClick={onIconClick}
            role={onIconClick ? "button" : undefined}
            tabIndex={onIconClick ? 0 : undefined}>
            {typeof IconComponent === 'function' ? <IconComponent /> : IconComponent}
          </div>
        )}
        
        {/* Type Icon (left) */}
        {!IconComponent && !prefix && getTypeIcon() && iconPosition === 'left' && (
          <div className="pl-3 pr-2" style={{ color: getIconColor() }}>
            {getTypeIcon()}
          </div>
        )}

        {/* Loading (left) */}
        {loading && loadingPosition === 'left' && (
          <div className="pl-3 pr-2">
            {getStatusIcon()}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={getInputType()}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          pattern={pattern}
          autoFocus={autoFocus}
          className={`flex-1 bg-transparent border-none focus:outline-none focus:ring-0 ${
            disabled || readOnly ? 'cursor-not-allowed' : ''
          } ${inputClasses}`}
          style={{
            color: themeUtils.getTextColor(true),
          }}
          {...restProps}
        />

        {/* Character Count */}
        {showCount && maxLength && (
          <div className="px-2 text-xs whitespace-nowrap"
            style={{ color: themeUtils.getTextColor(false, true) }}>
            {charCount}/{maxLength}
          </div>
        )}

        {/* Clear Button */}
        {shouldShowClear && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-1"
            style={{ color: themeUtils.getTextColor(false, true) }}
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Password Toggle */}
        {shouldShowPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-1"
            style={{ color: themeUtils.getTextColor(false, true) }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Status Icon (right) */}
        {(error || success) && !loading && (
          <div className="pr-2">
            {getStatusIcon()}
          </div>
        )}

        {/* Loading (right) */}
        {loading && loadingPosition === 'right' && (
          <div className="pr-2">
            {getStatusIcon()}
          </div>
        )}

        {/* Icon (right) */}
        {IconComponent && iconPosition === 'right' && !suffix && (
          <div className="pr-3 pl-2"
            style={{ color: getIconColor() }}
            onClick={onIconClick}
            role={onIconClick ? "button" : undefined}
            tabIndex={onIconClick ? 0 : undefined}>
            {typeof IconComponent === 'function' ? <IconComponent /> : IconComponent}
          </div>
        )}
        
        {/* Type Icon (right) */}
        {!IconComponent && !suffix && getTypeIcon() && iconPosition === 'right' && (
          <div className="pr-3 pl-2" style={{ color: getIconColor() }}>
            {getTypeIcon()}
          </div>
        )}
        
        {/* Suffix */}
        {suffix && iconPosition === 'right' && renderAddon(suffix, 'right')}
      </div>

      {/* Status Messages */}
      {error && errorMessage && (
        <p className="mt-1 text-xs flex items-center gap-1"
          style={{ color: themeUtils.getErrorColor?.() || "#DC2626" }}>
          <AlertCircle className="w-3 h-3" />
          {errorMessage}
        </p>
      )}
      
      {success && successMessage && (
        <p className="mt-1 text-xs flex items-center gap-1"
          style={{ color: themeUtils.getSuccessColor?.() || "#059669" }}>
          <CheckCircle className="w-3 h-3" />
          {successMessage}
        </p>
      )}
      
      {helpText && !error && !success && (
        <p className="mt-1 text-xs"
          style={{ color: themeUtils.getTextColor(false, true) }}>
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

// Helper components for common input types
export const SearchInput = (props) => (
  <Input type="search" icon={Search} iconPosition="left" {...props} />
);

export const EmailInput = (props) => (
  <Input type="email" icon={Mail} iconPosition="left" {...props} />
);

export const PhoneInput = (props) => (
  <Input type="tel" icon={Phone} iconPosition="left" {...props} />
);

export const PasswordInput = (props) => (
  <Input type="password" icon={Lock} iconPosition="left" {...props} />
);

export const CurrencyInput = (props) => (
  <Input type="number" prefix="AED" step="0.01" {...props} />
);

export const PercentageInput = (props) => (
  <Input type="number" suffix="%" step="0.1" min="0" max="100" {...props} />
);

// Helper HOCs
export const withValidation = (InputComponent, validationRules) => {
  return forwardRef((props, ref) => {
    const [errors, setErrors] = useState([]);
    
    const validate = (value) => {
      const newErrors = [];
      
      validationRules.forEach(rule => {
        if (rule.required && !value) {
          newErrors.push(rule.message || "This field is required");
        }
        if (rule.pattern && value && !rule.pattern.test(value)) {
          newErrors.push(rule.message || "Invalid format");
        }
        if (rule.minLength && value && value.length < rule.minLength) {
          newErrors.push(rule.message || `Minimum ${rule.minLength} characters required`);
        }
        if (rule.maxLength && value && value.length > rule.maxLength) {
          newErrors.push(rule.message || `Maximum ${rule.maxLength} characters allowed`);
        }
        if (rule.min && value && parseFloat(value) < rule.min) {
          newErrors.push(rule.message || `Minimum value is ${rule.min}`);
        }
        if (rule.max && value && parseFloat(value) > rule.max) {
          newErrors.push(rule.message || `Maximum value is ${rule.max}`);
        }
        if (rule.custom && value) {
          const customError = rule.custom(value);
          if (customError) newErrors.push(customError);
        }
      });
      
      setErrors(newErrors);
      return newErrors.length === 0;
    };
    
    return (
      <InputComponent
        ref={ref}
        {...props}
        error={errors.length > 0}
        errorMessage={errors[0]}
        validate={validate}
      />
    );
  });
};