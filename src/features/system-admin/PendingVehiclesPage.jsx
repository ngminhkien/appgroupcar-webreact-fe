import React from 'react';

const PendingVehiclesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 font-['Inter']">Danh sách Phương tiện chờ duyệt</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
        <p className="text-gray-500 text-lg">Chưa có phương tiện nào đang chờ duyệt</p>
      </div>
    </div>
  );
};

export default PendingVehiclesPage;
