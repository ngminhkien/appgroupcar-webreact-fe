import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateUserApi } from '@/services/userService';
import logoGroupCar from '@/assets/logoGroupCar.png';

const EditProfileModal = ({ isOpen, onClose, profileInfo, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && profileInfo) {
      setFullName(profileInfo.fullName || '');
      setPhoneNumber(profileInfo.phoneNumber || '');
      setImgFile(null);
      
      // Setup current avatar preview
      if (profileInfo.avatarUrl) {
        if (profileInfo.avatarUrl.startsWith('http') || profileInfo.avatarUrl.startsWith('data:')) {
          setPreviewUrl(profileInfo.avatarUrl);
        } else {
          let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
          const formattedUrl = profileInfo.avatarUrl.startsWith('/') ? profileInfo.avatarUrl : `/${profileInfo.avatarUrl}`;
          setPreviewUrl(`${baseUrl}${formattedUrl}`);
        }
      } else {
        setPreviewUrl(logoGroupCar);
      }
    }
  }, [isOpen, profileInfo]);

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 2MB');
        return;
      }
      setImgFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Họ và tên không được để trống');
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error('Số điện thoại không được để trống');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('FullName', fullName.trim());
    formData.append('PhoneNumber', phoneNumber.trim());
    if (imgFile) {
      formData.append('ImgFile', imgFile);
    }

    try {
      await updateUserApi(profileInfo.id, formData);
      toast.success('Cập nhật thông tin cá nhân thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl transition-transform duration-300 scale-100"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Chỉnh sửa thông tin cá nhân</h2>
            <button 
              type="button" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <img 
                  src={previewUrl} 
                  alt="Preview Avatar" 
                  className="w-28 h-28 rounded-full object-cover border-2 border-slate-100 shadow-inner"
                  onError={(e) => { e.target.src = logoGroupCar; }}
                />
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold"
                >
                  Thay đổi ảnh
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-xs text-slate-400">Khuyến nghị ảnh tỷ lệ 1:1, dung lượng dưới 2MB</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm font-medium text-slate-800"
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm font-medium text-slate-800"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Email (Không được chỉnh sửa)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed"
                  value={profileInfo?.email || ''}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50 border-t border-slate-100">
            <button 
              type="button" 
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
