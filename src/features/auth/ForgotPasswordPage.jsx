import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgetPasswordApi, resetPasswordApi } from '@/services/authService';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: 'Vui lòng nhập email' });
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }

    setIsLoading(true);
    try {
      await forgetPasswordApi(email);
      setStep(2);
      toast.success('OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!otp.trim()) newErrors.otp = 'Vui lòng nhập OTP';
    if (!newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (newPassword.length < 6) newErrors.newPassword = 'Mật khẩu tối thiểu 6 ký tự';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordApi(email, otp, newPassword);
      toast.success(res?.message || 'Đổi mật khẩu thành công. Đang chuyển hướng đến đăng nhập...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-16 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 shadow-md shadow-emerald-500/20">
            N
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Quên mật khẩu</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {step === 1 ? 'Nhập email của bạn để lấy lại mật khẩu' : 'Nhập OTP và mật khẩu mới'}
          </p>
        </div>

        {step === 1 ? (
          <form className="space-y-5" onSubmit={handleEmailSubmit} noValidate>
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
              />
              {errors.email && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</span>}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Lấy lại mật khẩu'}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleResetSubmit} noValidate autoComplete="off">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="emailDisplay">
                Email
              </label>
              <input
                id="emailDisplay"
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="otp">
                Mã OTP <span className="text-red-500">*</span>
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                autoComplete="one-time-code"
                onChange={(e) => { setOtp(e.target.value); setErrors((prev) => ({ ...prev, otp: '' })); }}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.otp ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
              />
              {errors.otp && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.otp}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="newPassword">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                autoComplete="new-password"
                onChange={(e) => { setNewPassword(e.target.value); setErrors((prev) => ({ ...prev, newPassword: '' })); }}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
              />
              {errors.newPassword && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.newPassword}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((prev) => ({ ...prev, confirmPassword: '' })); }}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
              />
              {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 font-semibold">{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-500 hover:text-emerald-600 font-semibold transition-colors">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
