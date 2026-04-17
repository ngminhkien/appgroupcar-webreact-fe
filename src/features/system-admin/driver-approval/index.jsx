import React, { useState } from 'react';
import DriverApprovalTable from '../../../components/AdminSysLayout/PendingDriver/PendingDriver';

const FAKE_DRIVERS = [
  { id: 1, name: 'Nguyễn Văn An', licenseClass: 'Hạng B2', submissionDate: '12/10/2023', status: 'pending', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Trần Minh Tâm', licenseClass: 'Hạng C', submissionDate: '11/10/2023', status: 'pending', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Lê Thị Mai', licenseClass: 'Hạng B1', submissionDate: '10/10/2023', status: 'rejected', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Hoàng Long', licenseClass: 'Hạng B2', submissionDate: '09/10/2023', status: 'approved', avatarUrl: 'https://i.pravatar.cc/150?u=4' },
];

const DriverApprovalPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredDrivers = FAKE_DRIVERS.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchKeyword.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && driver.status === activeFilter;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Inter']">
            Phê duyệt Tài xế
          </h1>
          <p className="text-slate-500 mt-2 font-medium font-['Inter']">
            Quản lý và xem xét các hồ sơ đăng ký mới trong hệ thống.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition duration-200 font-medium font-['Inter'] flex items-center space-x-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Thêm tài xế (Nội bộ)</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
             </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Tổng hồ sơ</p>
            <p className="text-2xl font-bold text-slate-800">{FAKE_DRIVERS.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Chờ duyệt</p>
             <p className="text-2xl font-bold text-slate-800">
               {FAKE_DRIVERS.filter(d => d.status === 'pending').length}
             </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Đã Phê duyệt</p>
             <p className="text-2xl font-bold text-slate-800">
               {FAKE_DRIVERS.filter(d => d.status === 'approved').length}
             </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-['Inter'] transition-colors"
            placeholder="Tìm kiếm tài xế..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'approved', label: 'Đã duyệt' },
            { id: 'rejected', label: 'Từ chối' },
          ].map(filter => (
             <button
               key={filter.id}
               onClick={() => setActiveFilter(filter.id)}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-['Inter'] whitespace-nowrap ${
                 activeFilter === filter.id 
                 ? 'bg-slate-800 text-white' 
                 : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
               }`}
             >
               {filter.label}
             </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <DriverApprovalTable drivers={filteredDrivers} />
      </div>
    </div>
  );
};

export default DriverApprovalPage;
