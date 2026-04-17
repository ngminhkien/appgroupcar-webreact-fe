import React, { useState } from 'react';
import './AuthFormInput.css';

/**
 * AuthFormInput — Reusable input for auth forms.
 * Supports text, email, password (with toggle), and select inputs.
 */
const AuthFormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  options, // For select type: [{ value, label }]
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  if (type === 'select' && options) {
    return (
      <div className={`auth-input-group ${error ? 'has-error' : ''}`}>
        {label && (
          <label className="auth-input-label" htmlFor={id}>
            {label}{required && <span className="auth-required">*</span>}
          </label>
        )}
        <div className="auth-input-wrapper">
          {icon && <span className="auth-input-icon">{icon}</span>}
          <select
            id={id}
            className="auth-input auth-select"
            value={value}
            onChange={onChange}
            required={required}
          >
            <option value="" disabled>{placeholder || 'Chọn...'}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="auth-select-chevron">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {error && <span className="auth-input-error">{error}</span>}
      </div>
    );
  }

  return (
    <div className={`auth-input-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="auth-input-label" htmlFor={id}>
          {label}{required && <span className="auth-required">*</span>}
        </label>
      )}
      <div className="auth-input-wrapper">
        {icon && <span className="auth-input-icon">{icon}</span>}
        <input
          id={id}
          type={inputType}
          className="auth-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="auth-input-error">{error}</span>}
    </div>
  );
};

export default AuthFormInput;
