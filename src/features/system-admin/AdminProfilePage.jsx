import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getUserProfileApi } from '@/services/userService';

const AdminProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileApi();
        const data = response?.data || response;
        if (!cancelled) setProfileInfo(data);
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.message || 'Không thể tải thông tin cá nhân.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, []);

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
      <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
         <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-emerald-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-slate-500 font-medium">Đang tải hồ sơ...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Card 1: Profile Header */}
        <div className="bg-white rounded-[1.25rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Area */}
          <div className="relative shrink-0 flex items-center justify-center p-3 rounded-full bg-[#F4F6F8]">
             <img 
               src={getFullImageUrl(profileInfo?.avatarUrl)} 
               alt="Admin Avatar" 
               className="w-32 h-32 rounded-full object-cover"
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
             <h1 className="text-[1.75rem] font-black text-[#0A1A2F] tracking-tight">{profileInfo?.fullName || "Người dùng"}</h1>
             <div className="mt-2">
               <span className="inline-block px-5 py-1.5 bg-[#0A1A2F] text-blue-50 text-[0.65rem] font-bold rounded-full tracking-widest uppercase">
                  {profileInfo?.roles?.length > 0 ? profileInfo.roles.join(', ') : 'Quản trị viên hệ thống'}
               </span>
             </div>
             <p className="text-slate-500 mt-5 leading-relaxed max-w-xl text-sm font-medium">
               Chịu trách nhiệm giám sát toàn bộ hoạt động của NexusRide, điều phối tài xế và tối ưu hóa các tuyến đường vận chuyển trong khu vực.
             </p>
             <button className="mt-8 inline-flex items-center justify-center px-5 py-3 bg-[#0A1A2F] text-white hover:bg-slate-800 rounded-[0.75rem] font-bold transition-colors text-sm shadow-md">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Chỉnh sửa thông tin
             </button>
          </div>
        </div>

        {/* Card 2: Contact Info */}
        <div className="bg-white p-8 rounded-[1.25rem] shadow-sm">
           <div className="flex items-center mb-8">
              <svg className="w-6 h-6 text-[#006e39] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
              </svg>
              <h2 className="text-xl font-bold text-[#0A1A2F]">Thông tin liên hệ</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pb-2">
              <div className="flex items-center">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                 </div>
                 <div>
                    <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</p>
                    <p className="text-[#0A1A2F] font-bold text-[0.95rem] w-full">{profileInfo?.email || '--'}</p>
                 </div>
              </div>

              <div className="flex items-center">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 <div>
                    <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Số điện thoại</p>
                    <p className="text-[#0A1A2F] font-bold text-[0.95rem] w-full">{profileInfo?.phoneNumber || '--'}</p>
                 </div>
              </div>

              <div className="flex items-center">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
                 <div>
                    <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ngày tham gia</p>
                    <p className="text-[#0A1A2F] font-bold text-[0.95rem] w-full">{formatDate(profileInfo?.createAt)}</p>
                 </div>
              </div>

              <div className="flex items-center">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shrink-0 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 </div>
                 <div>
                    <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Văn phòng làm việc</p>
                    <p className="text-[#0A1A2F] font-bold text-[0.95rem] w-full">Trụ sở Quận 1, TP. HCM</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Card 3: Permissions & Security */}
        <div className="bg-white p-8 rounded-[1.25rem] shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center">
                 <svg className="w-6 h-6 text-[#006e39] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                 </svg>
                 <h2 className="text-xl font-bold text-[#0A1A2F]">Phân quyền & Bảo mật</h2>
              </div>
              <span className="px-4 py-1.5 bg-[#52F091] text-emerald-900 rounded-full text-[0.65rem] font-bold tracking-widest uppercase">
                 Mức độ: {profileInfo?.roles?.includes('Admin') ? 'Cao nhất' : 'Cơ bản'}
              </span>
           </div>
           
           <div className="flex flex-wrap gap-4 pb-2">
              {profileInfo?.roles?.map((role, idx) => (
                 <span key={idx} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl font-semibold text-[0.8rem]">
                   {role}
                 </span>
              ))}
              {(!profileInfo?.roles || profileInfo.roles.length === 0) && (
                 <span className="text-slate-500 italic text-sm">Chưa có quyền nào</span>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfilePage;
