import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthBrandPanel, AuthFormInput } from '@/components/AuthLayout';
import './RegisterPage.css';

const ROLE_OPTIONS = [
  { value: 'customer', label: 'Khách hàng — Đặt xe, gửi hàng' },
  { value: 'driver', label: 'Tài xế — Đối tác vận chuyển' },
  { value: 'company_admin', label: 'Quản trị Công ty — Quản lý đội xe' },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu tối thiểu 8 ký tự';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn loại tài khoản';
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
    // TODO: Integrate actual API call
    try {
      console.log('Register payload:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left — Branding Panel */}
      <AuthBrandPanel
        headline="Định hình tương lai vận tải."
        subtitle="Gia nhập mạng lưới vận chuyển tinh vi nhất khu vực. Trải nghiệm sự chính xác trong từng chuyển động cùng NexusRide."
      />

      {/* Right — Register Form */}
      <div className="register-form-panel">
        <div className="register-mobile-brand">NexusRide</div>

        <div className="register-form-container">
          <div className="register-form-header">
            <h2 className="register-title">Tạo tài khoản mới</h2>
            <p className="register-subtitle">Bắt đầu hành trình vận chuyển thông minh của bạn hôm nay.</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {/* Role selection */}
            <AuthFormInput
              id="register-role"
              label="Loại tài khoản"
              type="select"
              placeholder="Chọn vai trò của bạn"
              value={formData.role}
              onChange={handleChange('role')}
              error={errors.role}
              required
              options={ROLE_OPTIONS}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              }
            />

            <AuthFormInput
              id="register-fullname"
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              error={errors.fullName}
              required
              autoComplete="name"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
            />

            <div className="register-row">
              <AuthFormInput
                id="register-email"
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
                id="register-phone"
                label="Số điện thoại"
                type="text"
                placeholder="0912 345 678"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={errors.phone}
                required
                autoComplete="tel"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                }
              />
            </div>

            <div className="register-row">
              <AuthFormInput
                id="register-password"
                label="Mật khẩu"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                required
                autoComplete="new-password"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                }
              />
              <AuthFormInput
                id="register-confirm-password"
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                }
              />
            </div>

            {/* Terms agreement */}
            <div className={`register-terms ${errors.terms ? 'has-error' : ''}`}>
              <label className="register-terms-label" htmlFor="agree-terms">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                />
                <span className="checkmark" />
                <span>
                  Tôi đồng ý với{' '}
                  <a href="#" className="terms-link">Điều khoản dịch vụ</a>
                  {' '}và{' '}
                  <a href="#" className="terms-link">Chính sách bảo mật</a>
                </span>
              </label>
              {errors.terms && <span className="auth-input-error">{errors.terms}</span>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="auth-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="auth-spinner" />
              ) : (
                'Tạo tài khoản'
              )}
            </button>

            <div className="login-divider">
              <span>hoặc</span>
            </div>

            <button type="button" className="auth-btn-social" id="register-google-btn">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.998 23.998 0 000 24c0 3.77.9 7.34 2.44 10.5l8.09-5.91z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Đăng ký với Google
            </button>
          </form>

          <p className="register-login-prompt">
            Đã có tài khoản?{' '}
            <Link to="/login" className="register-login-link">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
