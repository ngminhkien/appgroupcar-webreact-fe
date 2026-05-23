import React from 'react';
import { useSearchParams } from 'react-router-dom';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const serviceCode = searchParams.get('service') || '';

  const serviceLabels = {
    express: 'Gửi hàng',
    bus: 'Đặt vé xe khách',
    carpool: 'Đi chung xe'
  };

  const serviceTitles = {
    express: 'Dịch Vụ Gửi Hàng',
    bus: 'Đặt Vé Xe Khách',
    carpool: 'Dịch Vụ Đi Chung Xe'
  };

  const serviceDescs = {
    express: 'Hệ thống quản lý và gửi hàng trực tuyến đang được đồng bộ hóa và cập nhật dữ liệu. Vui lòng quay lại sau!',
    bus: 'Hệ thống đặt vé xe khách trực tuyến đang được đồng bộ và cập nhật dữ liệu các chuyến đi. Vui lòng quay lại sau!',
    carpool: 'Hệ thống kết nối đi chung xe trực tuyến đang được đồng bộ và cập nhật dữ liệu các chuyến đi. Vui lòng quay lại sau!'
  };

  const hasParams = from || to || date || serviceCode;
  const currentTitle = serviceTitles[serviceCode] || 'Đặt Vé Xe Khách';
  const currentDesc = serviceDescs[serviceCode] || 'Hệ thống đang được đồng bộ và cập nhật dữ liệu. Vui lòng quay lại sau!';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-slate-50 py-16 px-6">
      {/* Search Summary Panel */}
      {hasParams && (
        <div className="w-full max-w-4xl mb-10 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-2xl border border-emerald-100 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-bold tracking-wide">
                {serviceLabels[serviceCode] || 'Đặt vé'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-800 font-semibold text-sm sm:text-base w-full">
              {from && (
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400">ĐIỂM ĐI:</span>
                  <span className="text-slate-900">{from}</span>
                </div>
              )}
              {from && to && (
                <svg className="w-5 h-5 text-slate-400 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
              {to && (
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400">ĐIỂM ĐẾN:</span>
                  <span className="text-slate-900">{to}</span>
                </div>
              )}
              {date && (
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-900">{date}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 whitespace-nowrap"
          >
            Thay đổi tìm kiếm
          </button>
        </div>
      )}

      {/* Main Info Card */}
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center transition-all duration-300 hover:shadow-2xl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
          {currentTitle}
        </h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
          {currentDesc}
        </p>
        <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mx-auto animate-pulse" />
      </div>
    </div>
  );
};

export default BookingPage;
