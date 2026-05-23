import React from 'react';

const HistoryPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-slate-50 py-16 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center transition-all duration-300 hover:shadow-2xl">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Lịch Sử Hành Trình</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
          Danh sách lịch sử đặt vé và gửi hàng của bạn sẽ được hiển thị tại đây sau khi hệ thống kết nối cơ sở dữ liệu hoàn tất.
        </p>
        <div className="h-1.5 w-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto animate-pulse" />
      </div>
    </div>
  );
};

export default HistoryPage;
