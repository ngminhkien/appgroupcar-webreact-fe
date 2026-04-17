import React, { useState } from 'react';
import PendingCompanyTable from '../../components/AdminSysLayout/PendingCompany/PendingCompanyTable';

const FAKE_COMPANIES = [
  { id: 1, name: 'Công ty TNHH Vận tải ABC', taxCode: '0101234567', representative: 'Nguyễn Văn A', status: 'pending', logoUrl: 'https://ui-avatars.com/api/?name=ABC&background=0D8ABC&color=fff' },
  { id: 2, name: 'CTCP Dịch vụ Logistics XYZ', taxCode: '0312987654', representative: 'Trần Thị B', status: 'pending', logoUrl: 'https://ui-avatars.com/api/?name=XYZ&background=4CAF50&color=fff' },
  { id: 3, name: 'Hợp tác xã Vận tải Hùng Cường', taxCode: '0405678901', representative: 'Lê Văn C', status: 'rejected', logoUrl: 'https://ui-avatars.com/api/?name=HC&background=FF9800&color=fff' },
  { id: 4, name: 'Công ty TNHH MTV Minh Phát', taxCode: '0203456789', representative: 'Hoàng Minh D', status: 'approved', logoUrl: 'https://ui-avatars.com/api/?name=MP&background=E91E63&color=fff' },
];

const PendingCompaniesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCompanies = FAKE_COMPANIES.filter(company => {
    if (activeFilter === 'all') return true;
    return company.status === activeFilter;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Inter']">
            Phê duyệt Công ty
          </h1>
          <p className="text-slate-500 mt-2 font-medium font-['Inter']">
            Quản lý và xem xét các hồ sơ đăng ký đối tác doanh nghiệp.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Tổng công ty</p>
            <p className="text-2xl font-bold text-slate-800">{FAKE_COMPANIES.length}</p>
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
               {FAKE_COMPANIES.filter(c => c.status === 'pending').length}
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
               {FAKE_COMPANIES.filter(c => c.status === 'approved').length}
             </p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <PendingCompanyTable companies={filteredCompanies} />
      </div>
    </div>
  );
};

export default PendingCompaniesPage;
