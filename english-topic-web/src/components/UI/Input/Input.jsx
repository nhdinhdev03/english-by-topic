import PropTypes from "prop-types";
import { forwardRef, useState } from "react";
import "./Input.scss";

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      icon,
      iconPosition = "left",
      fullWidth = false,
      size = "medium",
      variant = "outlined",
      className = "",
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputClasses = [
      "input-wrapper",
      `input-${variant}`,
      `input-${size}`,
      fullWidth && "input-full-width",
      error && "input-error",
      disabled && "input-disabled",
      isFocused && "input-focused",
      icon && `input-with-icon-${iconPosition}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className={inputClasses}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        <div className="input-container">
          {icon && iconPosition === "left" && (
            <span className="input-icon input-icon-left">{icon}</span>
          )}

          <input
            ref={ref}
            type={inputType}
            className="input-field"
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              className="input-icon input-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}

          {icon && iconPosition === "right" && type !== "password" && (
            <span className="input-icon input-icon-right">{icon}</span>
          )}
        </div>

        {(error || helperText) && (
          <div className={`input-helper ${error ? "input-helper-error" : ""}`}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default Input;
