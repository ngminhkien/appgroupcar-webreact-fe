import React from 'react';

const AdminProfilePage = () => {
  // Fake data based on the Stitch UI design
  const profileData = {
    name: 'Nguyễn Văn Admin',
    role: 'Quản trị viên hệ thống',
    description: 'Chịu trách nhiệm giám sát toàn bộ hoạt động của NexusRide, điều phối tài xế và tối ưu hóa các tuyến đường vận chuyển trong khu vực.',
    email: 'admin@nexusride.vn',
    phone: '090 123 4567',
    joinDate: '15 Tháng 03, 2023',
    office: 'Trụ sở Quận 1, TP. HCM',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d14d88k7?auto=format&fit=crop&w=1500&q=80',
  };

  return (
    <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-['Inter']">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-blue-600 w-full relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
          </div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="flex items-end">
                <div className="relative rounded-full p-2 bg-white">
                  <img 
                    src={profileData.avatarUrl} 
                    alt="Admin Avatar" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md"
                  />
                  <div className="absolute bottom-4 right-4 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition-colors flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Chỉnh sửa
                </button>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profileData.name}</h1>
              <p className="text-blue-600 font-semibold mt-1">{profileData.role}</p>
              <p className="text-slate-500 mt-4 max-w-3xl leading-relaxed">
                {profileData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Contact Information */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Thông tin liên hệ</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Email</p>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <p className="text-slate-800 font-medium">{profileData.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Số điện thoại</p>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <p className="text-slate-800 font-medium">{profileData.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Ngày tham gia</p>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-slate-800 font-medium">{profileData.joinDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Văn phòng làm việc</p>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <p className="text-slate-800 font-medium">{profileData.office}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Section (Mocking UI context) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Phân quyền & Bảo mật</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div>
                    <h3 className="text-slate-800 font-semibold">Tín nhiệm tài khoản (2FA)</h3>
                    <p className="text-sm text-slate-500 mt-1">Bảo vệ tài khoản với xác thực hai yếu tố</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Đã kích hoạt</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div>
                    <h3 className="text-slate-800 font-semibold">Quyền truy cập toàn hệ thống</h3>
                    <p className="text-sm text-slate-500 mt-1">Cấp phép giám sát mọi chức năng của NexusRide</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Super Admin</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div>
                    <h3 className="text-slate-800 font-semibold">Lịch sử đăng nhập</h3>
                    <p className="text-sm text-slate-500 mt-1">Lần cuối đăng nhập: TP.HCM (Hôm nay, 10:24 AM)</p>
                  </div>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">Xem chi tiết</button>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Sidebar / Quick Actions */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-slate-800 font-bold mb-4">Các phiên hoạt động</h3>
               <div className="space-y-4">
                 <div className="flex items-start">
                    <div className="mt-1 bg-green-500 w-2.5 h-2.5 rounded-full mr-3 shrink-0"></div>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">MacBook Pro M2</p>
                      <p className="text-slate-500 text-xs mt-1">Hiện đang hoạt động • TP.HCM</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <div className="mt-1 bg-slate-300 w-2.5 h-2.5 rounded-full mr-3 shrink-0"></div>
                    <div>
                      <p className="text-slate-800 font-medium text-sm">iPhone 14 Pro Max</p>
                      <p className="text-slate-500 text-xs mt-1">Hôm qua lúc 15:42 • TP.HCM</p>
                    </div>
                 </div>
               </div>
               <button className="w-full mt-6 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                 Đăng xuất tất cả thiết bị
               </button>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
