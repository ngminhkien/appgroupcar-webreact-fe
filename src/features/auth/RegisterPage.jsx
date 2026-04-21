import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthBrandPanel, AuthFormInput } from '@/components/AuthLayout';
import { registerApi } from '@/services/authService';
import toast from 'react-hot-toast';
import './RegisterPage.css';

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu tối thiểu 8 ký tự';
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
      // Only send the fields backend expects
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
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                error={errors.phoneNumber}
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
