import React from 'react';
import { useSearchParams } from 'react-router-dom';

const BookingPage = () => {
  const [searchParams] = useSearchParams();

  const serviceCode = searchParams.get('service') || '';

  const serviceTitles = {
    bus: 'Đặt Vé Xe Khách',
    carpool: 'Dịch Vụ Đi Chung Xe',
    express: 'Dịch Vụ Gửi Hàng'

  };

  const serviceDescs = {
    express: 'Hệ thống quản lý và gửi hàng trực tuyến đang được đồng bộ hóa và cập nhật dữ liệu. Vui lòng quay lại sau!',
    bus: 'Hệ thống đặt vé xe khách trực tuyến đang được đồng bộ và cập nhật dữ liệu các chuyến đi. Vui lòng quay lại sau!',
    carpool: 'Hệ thống kết nối đi chung xe trực tuyến đang được đồng bộ và cập nhật dữ liệu các chuyến đi. Vui lòng quay lại sau!'
  };

  const currentTitle = serviceTitles[serviceCode] || 'Đặt Vé Xe Khách';
  const currentDesc = serviceDescs[serviceCode] || 'Hệ thống đang được đồng bộ và cập nhật dữ liệu. Vui lòng quay lại sau!';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-start bg-slate-50 py-8 px-6 w-full">

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
