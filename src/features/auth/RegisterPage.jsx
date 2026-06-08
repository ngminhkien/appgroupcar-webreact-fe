import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '@/services/authService';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)\d{9}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'Bạn cần đồng ý với điều khoản dịch vụ';
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
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      };
      const response = await registerApi(payload);
      toast.success(response?.message || 'Đăng ký tài khoản thành công!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 shadow-md shadow-emerald-500/20">
            N
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Tạo tài khoản mới</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Bắt đầu hành trình vận chuyển thông minh cùng NexusRide</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="register-fullname">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="register-fullname"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                autoComplete="name"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
              />
            </div>
            {errors.fullName && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.fullName}</span>}
          </div>

          {/* Email & Phone Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="register-email">
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
                  id="register-email"
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

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="register-phone">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <input
                  id="register-phone"
                  type="text"
                  placeholder="0912 345 678"
                  value={formData.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  autoComplete="tel"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                />
              </div>
              {errors.phoneNumber && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.phoneNumber}</span>}
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Password */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="register-password">
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
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={handleChange('password')}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="register-confirm-password">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                />
                <button
                  type="button"
                  className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex flex-col">
            <label className="flex items-start gap-2 text-slate-600 font-semibold cursor-pointer select-none text-sm" htmlFor="agree-terms">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                }}
                className="w-4.5 h-4.5 rounded text-emerald-500 border-slate-300 focus:ring-emerald-500 cursor-pointer mt-0.5"
              />
              <span>
                Tôi đồng ý với{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500 font-bold transition-colors">Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500 font-bold transition-colors">Chính sách bảo mật</a>
              </span>
            </label>
            {errors.terms && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.terms}</span>}
          </div>

          {/* Submit button */}
          <button
            id="register-submit-btn"
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>

        {/* Redirects */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-slate-600">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-extrabold transition-colors">
              Đăng nhập ngay
            </Link>
          </p>
          <p>
            Bạn là doanh nghiệp?{' '}
            <Link to="/register-company" className="text-blue-600 hover:text-blue-500 font-extrabold transition-colors">
              Đăng ký công ty
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
