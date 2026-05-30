import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getUserProfileApi } from '@/services/userService';
import EditProfileModal from '@/features/system-admin/EditProfileModal';

const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { data: profileInfo, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await getUserProfileApi();
      return response?.data || response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(error.response?.data?.message || 'Không thể tải thông tin cá nhân.');
    }
  }, [isError, error]);

  const formatDate = (value) => {
    if (!value || value.startsWith('0001-01-01')) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getFullImageUrl = (url) => {
    if (!url) return 'https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 bg-slate-50 min-h-[70vh] flex items-center justify-center">
         <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-slate-500 font-medium">Đang tải hồ sơ...</span>
         </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 md:p-10 bg-slate-50 min-h-[70vh] flex items-center justify-center">
         <div className="text-center">
            <p className="text-red-500 font-bold mb-4">Lỗi: {error.message || 'Không thể tải dữ liệu'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-955 text-white rounded-xl shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
            >
              Thử lại
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-[80vh] font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Card 1: Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left border border-slate-100">
          {/* Avatar Area */}
          <div className="relative shrink-0 flex items-center justify-center p-2.5 rounded-full bg-slate-50 border border-slate-100">
             <img 
               src={getFullImageUrl(profileInfo?.avatarUrl)} 
               alt="User Avatar" 
               className="w-32 h-32 rounded-full object-cover shadow-sm"
               onError={(e) => { e.target.src = 'https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp'; }}
             />
             <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#52F091] border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-emerald-900" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
             </div>
          </div>
          
          {/* Top Info */}
          <div className="flex-1 mt-2">
             <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{profileInfo?.fullName || "Người dùng"}</h1>
             <div className="mt-2.5">
               <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full tracking-wider uppercase">
                  {profileInfo?.roles?.length > 0 ? profileInfo.roles.join(', ') : 'Thành viên'}
               </span>
             </div>
             <p className="text-slate-500 mt-4 leading-relaxed max-w-xl text-sm font-medium">
               Chào mừng bạn đến với tài khoản NexusRide của mình. Tại đây bạn có thể quản lý thông tin cá nhân và xem lịch sử đặt xe.
             </p>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-bold transition-all text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                 </svg>
                 Chỉnh sửa thông tin
              </button>
          </div>
        </div>

        {/* Card 2: Contact Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mr-3">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                 </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Thông tin liên hệ</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                 <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                 </div>
                 <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-slate-700 font-semibold text-sm truncate">{profileInfo?.email || '--'}</p>
                 </div>
              </div>

              <div className="flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                 <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                    <p className="text-slate-700 font-semibold text-sm truncate">{profileInfo?.phoneNumber || '--'}</p>
                 </div>
              </div>

              <div className="flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                 <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
                 <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày tham gia</p>
                    <p className="text-slate-700 font-semibold text-sm truncate">{formatDate(profileInfo?.createAt)}</p>
                 </div>
              </div>

              <div className="flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                 <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 </div>
                 <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khu vực</p>
                    <p className="text-slate-700 font-semibold text-sm truncate">Việt Nam</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileInfo={profileInfo}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ProfilePage;
