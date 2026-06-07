import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdApi } from '@/services/userService';

const UserDetailModal = ({ userId, onClose }) => {
  const { data: userResponse, isLoading, error } = useQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => getUserByIdApi(userId),
    enabled: !!userId,
  });

  const userData = userResponse?.data || userResponse;

  if (!userId) return null;

  // Helper for customer avatar URL
  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container with Emerald Theme & High Contrast */}
      <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-md flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - High Contrast Emerald Accent */}
        <div className="p-5 bg-emerald-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black tracking-tight">Thông tin khách hàng</h3>
            <p className="text-xs text-emerald-100 font-semibold mt-0.5">Chi tiết tài khoản thành viên</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-emerald-600 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-500 font-black text-xs uppercase tracking-wider">Đang tải thông tin...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
              <p className="text-red-950 font-black text-sm mb-1">Không thể tải thông tin người dùng</p>
              <p className="text-red-800 text-xs font-bold">{error?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}</p>
            </div>
          ) : userData ? (
            <div className="flex flex-col items-center gap-6">
              {/* Avatar section */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-50 shadow-md">
                  {userData.avatarUrl ? (
                    <img 
                      src={getAvatarUrl(userData.avatarUrl)} 
                      alt={userData.fullName || 'User Avatar'} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-3xl">
                      {(userData.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Roles badge absolute */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 justify-center w-max">
                  {userData.roles?.map((role) => (
                    <span 
                      key={role} 
                      className="bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider shadow-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* User info details list - High Contrast Slate cards */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 mt-2">
                <div className="border-b border-slate-200 pb-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Họ và tên</span>
                  <span className="text-slate-800 font-extrabold text-base mt-0.5 block">{userData.fullName || 'Chưa cung cấp'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email</span>
                  <span className="text-slate-800 font-extrabold text-sm mt-0.5 block break-all">{userData.email || 'Chưa cung cấp'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Số điện thoại</span>
                  {userData.phoneNumber ? (
                    <a 
                      href={`tel:${userData.phoneNumber}`}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline font-extrabold text-sm mt-0.5 block"
                    >
                      {userData.phoneNumber}
                    </a>
                  ) : (
                    <span className="text-slate-800 font-extrabold text-sm mt-0.5 block">Chưa cung cấp</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ngày tham gia</span>
                  <span className="text-slate-700 font-bold text-xs mt-0.5 block">{formatDate(userData.createdAt)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-6 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserDetailModal;
