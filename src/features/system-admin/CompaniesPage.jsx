import React, { useEffect, useMemo, useState } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery } from '@tanstack/react-query';
import DetailModal from '@/components/AdminSysLayout/Company/DetailModal';
import DeleteModal from '@/components/AdminSysLayout/Company/DeleteModal';
import CompanyTable from '@/components/AdminSysLayout/Company/CompanyTable';
import { getCompaniesApi, deleteCompanyApi } from '@/services/companyService';
import { CompanyStatus } from '@/types/enums';
import toast from 'react-hot-toast';

const DEFAULT_PAGE_SIZE = 10;



const CompaniesPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPageNumber(1);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['companies', debouncedKeyword, pageNumber, statusFilter],
    queryFn: async () => {
      const params = {
        Search: debouncedKeyword || undefined,
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
        CompanyStatus: statusFilter !== '' ? statusFilter : undefined,
      };
      const response = await getCompaniesApi(params);
      return response?.data ?? {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const companies = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((item) => {
      let statusLabel = 'Không xác định';

      if (item.status === CompanyStatus.Approved) {
        statusLabel = 'Đã duyệt';
      } else if (item.status === CompanyStatus.Pending) {
        statusLabel = 'Chờ duyệt';
      } else if (item.status === CompanyStatus.Rejected) {
        statusLabel = 'Từ chối';
      } else if (item.status === CompanyStatus.Suspended) {
        statusLabel = 'Tạm ngưng';
      }

      return {
        id: item.id,
        companyName: item.companyName || '--',
        companyCode: item.companyCode || '--',
        phone: item.phone || '--',
        email: item.email || '--',
        status: item.status, // Pass the raw integer status
        statusLabel: statusLabel,
      };
    });
  }, [data]);

  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
    hasPreviousPage: Boolean(data?.hasPreviousPage),
    hasNextPage: Boolean(data?.hasNextPage),
  };

  const errorMessage = isError ? (error.response?.data?.message || 'Không tải được danh sách công ty.') : '';

  const approvedCount = companies.filter((company) => company.statusLabel === 'Đã duyệt').length;
  const pendingCount = companies.filter((company) => company.statusLabel === 'Chờ duyệt').length;

  const onChangeFilter = (nextStatus) => {
    setStatusFilter(nextStatus);
    setPageNumber(1);
  };

  const onSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setPageNumber(1);
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  const openCompanyDetailModal = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsDetailModalOpen(true);
  };

  const closeCompanyDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCompanyId('');
  };

  const handleCompanyUpdated = () => {
    refetch();
  };

  const handleOpenDeleteModal = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCompany(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return;

    setIsDeleting(true);
    try {
      const response = await deleteCompanyApi(selectedCompany.id);
      toast.success(response?.message || 'Xóa công ty thành công!');
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa công ty.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="companies-page p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Inter'] uppercase">Danh sách công ty</h2>
            <p className="text-slate-500 mt-2 font-medium font-['Inter']">Quản lý danh sách công ty trong hệ thống.</p>
          </div>
        </div>
      </div>

      <div className="admin-mini-stats">
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V17h4v4M12 3l9 4M12 3L3 7" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tổng số công ty</span>
            <span className="mini-stat-value">{pagination.totalCount}</span>
          </div>
        </div>
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Đã duyệt (trang hiện tại)</span>
            <span className="mini-stat-value">{approvedCount}</span>
          </div>
        </div>
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Chờ duyệt (trang hiện tại)</span>
            <span className="mini-stat-value">{pendingCount}</span>
          </div>
        </div>
      </div>

      <div className="admin-table-toolbar">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchKeyword}
              onChange={onSearchChange}
              placeholder="Tìm kiếm theo tên, mã, email..."
              className="admin-table-search-input w-full pl-10"
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
          
          <select
            className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNumber(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value={CompanyStatus.Pending}>Chờ duyệt</option>
            <option value={CompanyStatus.Approved}>Đã duyệt</option>
            <option value={CompanyStatus.Rejected}>Từ chối</option>
            <option value={CompanyStatus.Suspended}>Tạm ngưng</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
         <CompanyTable
            companies={companies}
            isLoading={isLoading}
            pagination={pagination}
            onGoToPage={goToPage}
            onViewDetail={openCompanyDetailModal}
            onDelete={handleOpenDeleteModal}
         />
      </div>

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={closeCompanyDetailModal}
        companyId={selectedCompanyId}
        onUpdated={handleCompanyUpdated}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        companyName={selectedCompany?.companyName}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CompaniesPage;
