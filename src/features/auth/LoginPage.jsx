import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi, googleLoginApi } from '@/services/authService';
import { useAuth } from '@/store/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Role-based redirect helper ───
  const redirectByRole = async (accessToken) => {
    const { jwtDecode } = await import('jwt-decode');
    const decoded = jwtDecode(accessToken);
    const role = decoded?.Roles || decoded?.role || decoded?.Role || '';

    if (role === 'Admin' || role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'ADMIN_COMPANY') {
      navigate('/company-admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // ─── Google Sign-In callback ───
  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setApiError('Không nhận được thông tin từ Google. Vui lòng thử lại.');
      return;
    }

    setIsGoogleLoading(true);
    setApiError('');

    try {
      const response = await googleLoginApi(idToken);

      if (response.code === 200 && response.data) {
        login(response.data);
        await redirectByRole(response.data.accessToken);
      } else {
        setApiError(response.message || 'Đăng nhập với Google thất bại.');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đã xảy ra lỗi khi đăng nhập với Google.';
      setApiError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // ─── Initialize Google Identity Services ───
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') return;

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin,
        });
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initializeGoogle();
        }
      }, 100);
      const timeout = setTimeout(() => clearInterval(checkInterval), 10000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, []);

  // ─── Trigger Google popup on button click ───
  const handleGoogleButtonClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      setApiError('Chưa cấu hình Google Client ID. Vui lòng liên hệ quản trị viên.');
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const oauth2Url = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(window.location.origin + '/login')}` +
            `&response_type=id_token` +
            `&scope=openid email profile` +
            `&nonce=${Math.random().toString(36).substring(2)}`;

          const popup = window.open(oauth2Url, 'google-login', 'width=500,height=600,left=200,top=100');

          const popupInterval = setInterval(() => {
            try {
              if (!popup || popup.closed) {
                clearInterval(popupInterval);
                return;
              }
              const hash = popup.location.hash;
              if (hash && hash.includes('id_token=')) {
                clearInterval(popupInterval);
                const params = new URLSearchParams(hash.substring(1));
                const idToken = params.get('id_token');
                popup.close();
                if (idToken) {
                  handleGoogleLogin({ credential: idToken });
                }
              }
            } catch {
              // Cross-origin — ignore until redirect
            }
          }, 500);
        }
      });
    } else {
      setApiError('Google Sign-In chưa sẵn sàng. Vui lòng tải lại trang.');
    }
  };

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
        login(response.data);
        await redirectByRole(response.data.accessToken);
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
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 shadow-md shadow-emerald-500/20">
            N
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Chào mừng trở lại</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Vui lòng đăng nhập để tiếp tục đồng hành cùng NexusRide</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>

          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="login-email">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange('email')}
                autoComplete="email"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</span>}
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="login-password">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange('password')}
                autoComplete="current-password"
                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
              />
              <button
                type="button"
                className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.password}</span>}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer select-none" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-emerald-500 border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-500 font-bold transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 flex items-center gap-2 font-semibold" role="alert">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Đăng nhập'
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-xs text-slate-400 font-semibold uppercase">hoặc</span>
          </div>

          {/* Google Login button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition-all cursor-pointer disabled:opacity-50"
            id="login-google-btn"
            onClick={handleGoogleButtonClick}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" className="shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.998 23.998 0 000 24c0 3.77.9 7.34 2.44 10.5l8.09-5.91z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}</span>
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-slate-600 mt-8 font-semibold">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-emerald-600 hover:text-emerald-500 font-extrabold transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
