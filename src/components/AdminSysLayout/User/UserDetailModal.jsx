import React, { useEffect, useState, useRef } from 'react';
import { getUserByIdApi, updateUserApi } from '@/services/userService';
import toast from 'react-hot-toast';

const UserDetailModal = ({ isOpen, onClose, userId, onUpdated }) => {
  const [userData, setUserData] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setIsLoadingDetail(true);
      setErrorMessage('');
      try {
        const response = await getUserByIdApi(userId);
        const data = response?.data ?? response;
        if (cancelled) return;
        setUserData(data);
        setFullName(data.fullName || '');
        setPhoneNumber(data.phoneNumber || '');
        setAvatarPreview(data.avatarUrl || null);
        setAvatarFile(null);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error.response?.data?.message || 'Không thể tải thông tin người dùng.');
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    };

    fetchDetail();
    return () => { cancelled = true; };
  }, [isOpen, userId]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phoneNumber', phoneNumber);
      if (avatarFile) {
        formData.append('ImgFile', avatarFile);
      }
      const response = await updateUserApi(userId, formData);
      toast.success(response?.message || 'Cập nhật thành công!');
      if (onUpdated) onUpdated();
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.';
      toast.error(msg);
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setUserData(null);
    setErrorMessage('');
    setAvatarFile(null);
    setAvatarPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  const formatDate = (value) => {
    if (!value || value.startsWith('0001-01-01')) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('vi-VN');
  };

  const getAvatarSrc = () => {
    if (avatarPreview && avatarPreview.startsWith('data:')) return avatarPreview;
    if (avatarPreview) {
      // If it's a relative URL, prepend the API base URL
      if (avatarPreview.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        // Remove trailing /api or similar if present to get the domain
        const domainUrl = baseUrl.replace(/\/api\/?$/, '');
        return `${domainUrl}${avatarPreview}`;
      }
      return avatarPreview;
    }
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl transition-transform duration-300 scale-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chi tiết người dùng</h2>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              onClick={handleClose}
              aria-label="Đóng"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {isLoadingDetail && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-slate-500">Đang tải thông tin...</span>
            </div>
          )}

          {!isLoadingDetail && errorMessage && !userData && (
            <div className="text-center py-12">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-100 text-red-500 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <p className="text-red-500">{errorMessage}</p>
            </div>
          )}

          {!isLoadingDetail && userData && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {getAvatarSrc() ? (
                    <img
                      src={getAvatarSrc()}
                      alt="Avatar"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-2 ring-indigo-100">
                      {(userData.fullName || userData.userName || 'N')[0]?.toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    onClick={() => fileInputRef.current?.click()}
                    title="Thay đổi ảnh đại diện"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                {avatarFile && (
                  <span className="mt-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                    Ảnh mới đã chọn: {avatarFile.name}
                  </span>
                )}
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Họ và tên
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                {/* Phone Number - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Số điện thoại
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Email - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Email</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {userData.email || '--'}
                  </div>
                </div>

               

                {/* Created Date - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Ngày đăng ký</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {formatDate(userData.createAt)}
                  </div>
                </div>

                {/* Roles - Read Only (full width) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600">Vai trò</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm cursor-not-allowed">
                    {Array.isArray(userData.roles) && userData.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userData.roles.map((role) => {
                          const roleColors = {
                            Admin: 'bg-red-100 text-red-700 ring-red-200',
                            User: 'bg-sky-100 text-sky-700 ring-sky-200',
                            Driver: 'bg-amber-100 text-amber-700 ring-amber-200',
                            Company: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
                          };
                          const colorClass = roleColors[role] || 'bg-slate-100 text-slate-700 ring-slate-200';
                          return (
                            <span
                              key={role}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${colorClass}`}
                            >
                              {role}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-slate-400">Chưa gán vai trò</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              {errorMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoadingDetail && userData && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
              onClick={handleClose}
              disabled={isSaving}
            >
              Đóng
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;
