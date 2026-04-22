import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createCompanyUserApi } from '@/services/companyUserService';

const AddCompanyUserModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.phoneNumber) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCompanyUserApi(formData);
      toast.success(res?.message || 'Thêm tài khoản thành công!');
      if (onAdded) onAdded();
      setFormData({ email: '', password: '', phoneNumber: '' });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm tài khoản.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Thêm mới tài khoản</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="admin-filter-btn w-full outline-none"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="admin-filter-btn w-full outline-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Mật khẩu <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="admin-filter-btn w-full outline-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#001f3f] hover:bg-blue-900 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyUserModal;
