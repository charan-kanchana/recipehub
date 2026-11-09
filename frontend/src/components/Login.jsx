import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const Login = ({ onLogin, onNavigateRegister, onNavigateHome, showAlert }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(null);

  // Check for remembered email on load
  useEffect(() => {
    const savedEmail = localStorage.getItem('recipehub_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
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
      const res = await loginUser({
        email: email.trim(),
        password
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
      // Also store generic keys for full compatibility
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem('recipehub_remember_email', email.trim());
      } else {
        localStorage.removeItem('recipehub_remember_email');
      }

      if (showAlert) {
        showAlert(`Welcome back, ${user.name}!`, 'success');
      }

      if (onLogin) {
        onLogin(user);
      }

      if (onNavigateHome) {
        onNavigateHome();
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        'Unable to log in. Please check your credentials and make sure backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setForgotStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    setForgotStatus({
      type: 'success',
      message: `Password reset instructions have been dispatched to ${forgotEmail}. Please check your inbox.`
    });
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFieldErrors({});
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Card Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <span>🍳</span> RecipeHub
          </div>
          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to share, discover, and save your favourite recipes</p>
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="login-email">
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
                id="login-email"
                type="email"
                placeholder="e.g. rahul@example.com"
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

          {/* Password Field */}
          <div className="form-group">
            <div className="label-with-action">
              <label htmlFor="login-password">
                Password <span className="required-star">*</span>
              </label>
            </div>
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
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
                className={fieldErrors.password ? 'input-error' : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye slash icon
                  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  // Eye icon
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
            {fieldErrors.password && (
              <span className="auth-field-error">{fieldErrors.password}</span>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="auth-options-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="auth-link-button"
              onClick={() => {
                setForgotEmail(email);
                setForgotStatus(null);
                setShowForgotModal(true);
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner"></span> Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="auth-demo-box">
          <span className="demo-badge">Quick Demo Access:</span>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => fillDemoAccount('rahul@example.com', 'password123')}
            >
              👤 Admin (Rahul)
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => fillDemoAccount('sita@example.com', 'securePassword123')}
            >
              👤 User (Sita)
            </button>
          </div>
        </div>

        {/* Footer Navigation Link to Register */}
        <div className="auth-switch-box">
          <p>
            Don't have an account yet?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                if (onNavigateRegister) onNavigateRegister();
              }}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div
            className="modal-content auth-forgot-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Reset Your Password</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowForgotModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="forgot-instruction">
                Enter your registered email address and we will provide you with reset instructions.
              </p>

              {forgotStatus && (
                <div
                  className={`auth-alert ${
                    forgotStatus.type === 'error' ? 'auth-alert-error' : 'auth-alert-success'
                  }`}
                >
                  <span>{forgotStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label>Registered Email</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

