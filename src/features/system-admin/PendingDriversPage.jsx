import React from 'react';

const PendingDriversPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 font-['Inter']">Danh sách Tài xế chờ duyệt</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <p className="text-gray-500 text-lg">Chưa có tài xế nào đang chờ duyệt</p>
      </div>
    </div>
  );
};

export default PendingDriversPage;
