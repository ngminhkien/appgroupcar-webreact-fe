import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PendingCompanyTable from '../../components/AdminSysLayout/PendingCompany/PendingCompanyTable';
import CompanyDetailModal from '../../components/AdminSysLayout/Company/DetailModal';
import { getCompaniesApi } from '../../services/companyService';

const DEFAULT_PAGE_SIZE = 10;

const PendingCompaniesPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleOpenDetailModal = (company) => {
    setSelectedCompany(company);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCompany(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pendingCompanies', debouncedKeyword, pageNumber],
    queryFn: async () => {
      const response = await getCompaniesApi({
        Search: debouncedKeyword || undefined,
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
        CompanyStatus: 0, // Pending
      });
      return response?.data ?? response ?? {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const companies = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((item) => ({
      ...item,
      id: item.id || item.companyId,
      companyName: item.companyName || '--',
      companyCode: item.companyCode || '--',
      phone: item.phone || '--',
      email: item.email || '--',
      status: item.status, 
      logoUrl: item.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.companyName || 'C')}&background=random`,
    }));
  }, [data]);

  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  const handleCompanyUpdated = () => {
    refetch();
  };

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

      {/* Toolbar Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Tìm kiếm công ty..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-sm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <PendingCompanyTable 
          companies={companies} 
          isLoading={isLoading}
          pagination={pagination}
          onGoToPage={goToPage}
          onViewDetail={handleOpenDetailModal}
        />
      </div>

      {selectedCompany && (
        <CompanyDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          companyId={selectedCompany.id}
          onUpdated={handleCompanyUpdated}
        />
      )}
    </div>
  );
};

export default PendingCompaniesPage;
