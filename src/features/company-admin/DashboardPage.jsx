import React from 'react';

const CompanyAdminDashboardPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001f3f]">Tổng quan hoạt động</h1>
          <p className="text-sm text-slate-500 mt-1">Dữ liệu cập nhật lúc 08:45, 24 Th10</p>
        </div>
        <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-slate-100">
          <button className="px-5 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Hôm nay</button>
          <button className="px-5 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Tuần này</button>
          <button className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#001f3f] text-white shadow-sm transition-colors">Tháng này</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#001f3f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              12%
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Tổng phương tiện</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-2 leading-none">124</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#001f3f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="19" r="3" />
                <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                <circle cx="18" cy="5" r="3" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              8%
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Chuyến đi (Tháng)</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-2 leading-none">1,432</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#001f3f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              15%
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Tổng hành khách</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-2 leading-none">42.5K</h3>
        </div>

        {/* Card 4 - Highlight */}
        <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 flex flex-col h-full relative">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#001f3f] shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 9.5h20" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-100/70 px-2 py-1 rounded-md text-xs font-bold">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              22%
            </div>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Doanh thu (Tháng)</p>
          <h3 className="text-[28px] font-bold text-slate-800 mb-3 leading-none">8.4B ₫</h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu theo tuần</h3>
            <button className="text-sm font-semibold text-[#001f3f] hover:text-blue-700 transition-colors">Xem chi tiết</button>
          </div>
          <div className="relative h-64 w-full mt-4">
            {/* Y-axis */}
            <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-medium text-slate-400 pb-8">
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">100M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">75M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">50M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">25M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-8 text-right">0</span></div>
            </div>
            
            {/* Bars placeholder - subtle visualization */}
            <div className="absolute inset-0 left-12 bottom-8 flex justify-around items-end px-4">
               <div className="w-8 h-[30%] bg-emerald-100 rounded-t-sm"></div>
               <div className="w-8 h-[45%] bg-emerald-100 rounded-t-sm"></div>
               <div className="w-8 h-[65%] bg-emerald-100 rounded-t-sm"></div>
               <div className="w-8 h-[80%] bg-[#001f3f] rounded-t-sm"></div>
               <div className="w-8 h-[95%] bg-emerald-400 rounded-t-sm shadow-sm shadow-emerald-200/50"></div>
               <div className="w-8 h-[55%] bg-emerald-100 rounded-t-sm"></div>
               <div className="w-8 h-[70%] bg-emerald-100 rounded-t-sm"></div>
            </div>

            {/* X-axis */}
            <div className="absolute bottom-0 left-12 right-0 flex justify-around text-xs font-semibold text-slate-400 px-4">
              <span className="w-8 text-center">T2</span>
              <span className="w-8 text-center">T3</span>
              <span className="w-8 text-center">T4</span>
              <span className="w-8 text-center text-[#001f3f]">T5</span>
              <span className="w-8 text-center text-emerald-500">T6</span>
              <span className="w-8 text-center">T7</span>
              <span className="w-8 text-center">CN</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Phân bổ loại xe</h3>
          <div className="flex-1 flex flex-col items-center justify-center pb-4">
            
            <div className="relative w-44 h-44 mb-8">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Track (Ghế ngồi 10%) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                
                {/* Limousine (25%) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#4ade80" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="0" />
                
                {/* Xe giường nằm (65%) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#001f3f" strokeWidth="6" strokeDasharray="65 35" strokeDashoffset="-25" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#001f3f]">124</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Tổng xe</span>
              </div>
            </div>
            
            <div className="w-full space-y-4 px-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#001f3f]"></div>
                  <span className="font-medium text-slate-600">Xe giường nằm</span>
                </div>
                <span className="font-bold text-slate-800">65%</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#4ade80]"></div>
                  <span className="font-medium text-slate-600">Limousine</span>
                </div>
                <span className="font-bold text-slate-800">25%</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="font-medium text-slate-600">Ghế ngồi</span>
                </div>
                <span className="font-bold text-slate-800">10%</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default CompanyAdminDashboardPage;
