import React, { useState } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CompanyUserTable from '@/components/AdminCompanyLayout/CompanyUser/CompanyUserTable';
import AddCompanyUserModal from '@/components/AdminCompanyLayout/CompanyUser/AddCompanyUserModal';
import { getCompanyUsersApi } from '@/services/companyUserService';

const DEFAULT_PAGE_SIZE = 10;

const AccountsPage = () => {
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['company-users', pageNumber],
    queryFn: async () => {
      const response = await getCompanyUsersApi({
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
      });
      // response format is { code: 200, data: { items: [], totalCount: ... } }
      return response?.data || {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const users = Array.isArray(data?.items) ? data.items : [];
  
  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="vehicles-page">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Tài khoản nhân sự</h1>
            <p className="admin-page-desc">Quản lý danh sách các tài khoản nhân sự trực thuộc công ty.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001f3f] text-white text-sm font-medium rounded-xl hover:bg-blue-900 transition-all shadow-sm active:scale-95 whitespace-nowrap" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm mới tài khoản
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="admin-mini-stats">
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tổng nhân sự</span>
            <span className="mini-stat-value">{pagination.totalCount}</span>
          </div>
        </div>
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Đang hoạt động (trang hiện tại)</span>
            <span className="mini-stat-value">{activeCount}</span>
          </div>
        </div>
      </div>

      <div className="admin-data-table-wrapper relative mt-6">
         {isLoading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
         )}
         <CompanyUserTable 
           users={users} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
         />
      </div>

      <AddCompanyUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={() => {
          queryClient.invalidateQueries(['company-users']);
        }}
      />
    </div>
  );
};

export default AccountsPage;
