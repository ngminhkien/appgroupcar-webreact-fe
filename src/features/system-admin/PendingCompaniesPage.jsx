import React from 'react';

const PendingCompaniesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 font-['Inter']">Danh sách Công ty chờ duyệt</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p className="text-gray-500 text-lg">Chưa có công ty nào đang chờ duyệt</p>
      </div>
    </div>
  );
};

export default PendingCompaniesPage;
