import React, { useState } from 'react';
import { registerAuthUser } from '../services/api';

const Register = ({ onLogin, onNavigateLogin, onNavigateHome, showAlert }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('User');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Helper to calculate simple password strength
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', score: 0, color: '#e2e8f0' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { label: 'Weak', score: 25, color: '#ef4444' };
      case 2:
        return { label: 'Fair', score: 50, color: '#f59e0b' };
      case 3:
        return { label: 'Good', score: 75, color: '#3b82f6' };
      case 4:
        return { label: 'Strong', score: 100, color: '#10b981' };
      default:
        return { label: 'Too short', score: 15, color: '#ef4444' };
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await registerAuthUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role
      });

      const data = res.data;
      const user = data.user || {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      };
      const token = data.token;

      // Store in localStorage
      localStorage.setItem('recipehub_token', token);
      localStorage.setItem('recipehub_user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (showAlert) {
        showAlert('Registration successful! Welcome to RecipeHub.', 'success');
      }

      if (onLogin) {
        onLogin(user);
      }

      if (onNavigateHome) {
        onNavigateHome();
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to register account. Please check your details and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Card Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <span>✨</span> Join RecipeHub
          </div>
          <h2>Create Your Account</h2>
          <p className="auth-subtitle">
            Sign up to share recipes, rate dishes, and join our culinary community
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="auth-alert auth-alert-error">
            <svg className="auth-alert-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="reg-name">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                }}
                className={fieldErrors.name ? 'input-error' : ''}
                autoComplete="name"
              />
            </div>
            {fieldErrors.name && <span className="auth-field-error">{fieldErrors.name}</span>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="reg-email">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                placeholder="e.g. priya@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
                className={fieldErrors.email ? 'input-error' : ''}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}
          </div>

          {/* Account Role */}
          <div className="form-group">
            <label htmlFor="reg-role">Account Type</label>
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="auth-select"
            >
              <option value="User">Standard User (Browse & Share Recipes)</option>
              <option value="Admin">Administrator (Manage Users & Categories)</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="reg-password">
              Password <span className="required-star">*</span>
            </label>
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password (min 6 chars)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
                className={fieldErrors.password ? 'input-error' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="toggle-text">{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            {/* Password strength progress bar */}
            {password && (
              <div className="password-strength-container">
                <div className="strength-meter-bar">
                  <div
                    className="strength-meter-fill"
                    style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: strength.color }}>
                  Strength: {strength.label}
                </span>
              </div>
            )}

            {fieldErrors.password && (
              <span className="auth-field-error">{fieldErrors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password">
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword)
                    setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                }}
                className={fieldErrors.confirmPassword ? 'input-error' : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="toggle-text">{showConfirmPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className="auth-field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner"></span> Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Navigation Link to Login */}
        <div className="auth-switch-box">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                if (onNavigateLogin) onNavigateLogin();
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

