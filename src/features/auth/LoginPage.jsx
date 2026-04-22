import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthBrandPanel, AuthFormInput } from '@/components/AuthLayout';
import { loginApi } from '@/services/authService';
import { useAuth } from '@/store/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await loginApi(formData.email, formData.password);

      if (response.code === 200 && response.data) {
        // Store tokens and update auth state
        login(response.data);

        // Role-based redirect
        const { jwtDecode } = await import('jwt-decode');
        const decoded = jwtDecode(response.data.accessToken);

        // Map role from payload: check 'Roles' (sample payload) or 'role'/'Role' (fallback)
        const role = decoded?.Roles || decoded?.role || decoded?.Role || '';

        // Check for 'Admin' (capitalized as in sample) or 'admin' / 'system_admin'
        if (role === 'Admin' || role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'ADMIN_COMPANY') {
          navigate('/company-admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setApiError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đã xảy ra lỗi. Vui lòng thử lại.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — Branding Panel */}
      <AuthBrandPanel
        headline="Chuyển động Chính xác. Tương lai Vận tải."
        subtitle="Nền tảng quản lý vận tải thế hệ mới dành cho các doanh nghiệp dẫn đầu."
      />

      {/* Right — Login Form */}
      <div className="login-form-panel">
        {/* Mobile logo (hidden on desktop) */}
        <div className="login-mobile-brand">NexusRide</div>

        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-title">Chào mừng trở lại</h2>
            <p className="login-subtitle">Vui lòng nhập thông tin để truy cập hệ thống</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <AuthFormInput
              id="login-email"
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
              autoComplete="email"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 6L2 7"/>
                </svg>
              }
            />

            <AuthFormInput
              id="login-password"
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
              autoComplete="current-password"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              }
            />

            <div className="login-options">
              <label className="login-remember" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark" />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="login-forgot">
                Quên mật khẩu?
              </Link>
            </div>

            {apiError && (
              <div className="auth-error-banner" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                {apiError}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              className="auth-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="auth-spinner" />
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div className="login-divider">
              <span>hoặc</span>
            </div>

            <button type="button" className="auth-btn-social" id="login-google-btn">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.998 23.998 0 000 24c0 3.77.9 7.34 2.44 10.5l8.09-5.91z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Đăng nhập với Google
            </button>
          </form>

          <p className="login-signup-prompt">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="login-signup-link">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
