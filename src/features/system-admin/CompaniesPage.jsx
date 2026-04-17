import React, { useEffect, useMemo, useState } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import DetailModal from '@/components/AdminSysLayout/Company/DetailModal';
import DeleteModal from '@/components/AdminSysLayout/Company/DeleteModal';
import { getCompaniesApi, deleteCompanyApi } from '@/services/companyService';
import { CompanyStatus } from '@/types/enums';
import toast from 'react-hot-toast';

const DEFAULT_PAGE_SIZE = 10;

const getStatusMeta = (status) => {
  switch (status) {
    case CompanyStatus.Approved:
      return { key: 'active', label: 'Đã duyệt' };
    case CompanyStatus.Pending:
      return { key: 'inactive', label: 'Chờ duyệt' };
    case CompanyStatus.Rejected:
      return { key: 'locked', label: 'Từ chối' };
    case CompanyStatus.Suspended:
      return { key: 'locked', label: 'Tạm ngưng' };
    default:
      return { key: 'inactive', label: 'Không xác định' };
  }
};

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const CompaniesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

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
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const fetchCompanies = async (ignore = false) => {
    const isActive = activeFilter === 'all' ? undefined : activeFilter === 'active';

    const params = {
      search: debouncedKeyword || undefined,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      isActive,
    };

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getCompaniesApi(params);
      const pageData = response?.data ?? {};
      const items = Array.isArray(pageData.items) ? pageData.items : [];

      if (ignore) return;

      const mappedCompanies = items.map((item) => {
        const statusMeta = getStatusMeta(item.status);
        return {
          id: item.id,
          companyName: item.companyName || '--',
          companyCode: item.companyCode || '--',
          phone: item.phone || '--',
          email: item.email || '--',
          status: statusMeta.key,
          statusLabel: statusMeta.label,
        };
      });

      setCompanies(mappedCompanies);
      setPagination({
        totalCount: pageData.totalCount ?? 0,
        pageNumber: pageData.pageNumber ?? 1,
        pageSize: pageData.pageSize ?? DEFAULT_PAGE_SIZE,
        totalPages: pageData.totalPages ?? 1,
        hasPreviousPage: Boolean(pageData.hasPreviousPage),
        hasNextPage: Boolean(pageData.hasNextPage),
      });
    } catch (error) {
      if (ignore) return;
      setCompanies([]);
      setErrorMessage(error.response?.data?.message || 'Không tải được danh sách công ty.');
    } finally {
      if (!ignore) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchCompanies(ignore);
    return () => {
      ignore = true;
    };
  }, [activeFilter, debouncedKeyword, pagination.pageNumber, pagination.pageSize]);

  const currentStart = pagination.totalCount === 0
    ? 0
    : (pagination.pageNumber - 1) * pagination.pageSize + 1;
  const currentEnd = Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount);
  const pageNumbers = useMemo(
    () => buildPageList(pagination.pageNumber, pagination.totalPages),
    [pagination.pageNumber, pagination.totalPages]
  );

  const approvedCount = companies.filter((company) => company.statusLabel === 'Đã duyệt').length;
  const pendingCount = companies.filter((company) => company.statusLabel === 'Chờ duyệt').length;

  const onChangeFilter = (nextFilter) => {
    setActiveFilter(nextFilter);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const onSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.pageNumber) return;
    setPagination((prev) => ({ ...prev, pageNumber: nextPage }));
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
    fetchCompanies();
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
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa công ty.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="companies-page">
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Danh sách công ty</h1>
            <p className="admin-page-desc">Quản lý danh sách công ty trong hệ thống.</p>
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
        <input
          type="text"
          value={searchKeyword}
          onChange={onSearchChange}
          placeholder="Tìm kiếm theo tên, mã, email..."
          className="admin-table-search-input"
        />
        <button
          className={`admin-filter-btn ${activeFilter === 'all' ? 'admin-filter-btn--active' : ''}`}
          onClick={() => onChangeFilter('all')}
          type="button"
        >
          Tất cả
        </button>
        <button
          className={`admin-filter-btn ${activeFilter === 'active' ? 'admin-filter-btn--active' : ''}`}
          onClick={() => onChangeFilter('active')}
          type="button"
        >
          Hoạt động
        </button>
        <button
          className={`admin-filter-btn ${activeFilter === 'inactive' ? 'admin-filter-btn--active' : ''}`}
          onClick={() => onChangeFilter('inactive')}
          type="button"
        >
          Tạm dừng
        </button>
        <span className="admin-table-info">
          Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} công ty
        </span>
      </div>

      <div className="admin-data-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Tên công ty</th>
              <th>Mã công ty</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Đang tải dữ liệu...</td>
              </tr>
            )}

            {!isLoading && errorMessage && (
              <tr>
                <td colSpan={6}>{errorMessage}</td>
              </tr>
            )}

            {!isLoading && !errorMessage && companies.length === 0 && (
              <tr>
                <td colSpan={6}>Không có dữ liệu phù hợp.</td>
              </tr>
            )}

            {!isLoading && !errorMessage && companies.map((company) => (
              <tr key={company.id}>
                <td>{company.companyName}</td>
                <td>{company.companyCode}</td>
                <td>{company.phone}</td>
                <td>{company.email}</td>
                <td>
                  <span className={`status-badge status-badge--${company.status}`}>
                    <span className="status-badge-dot" />
                    {company.statusLabel}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="table-action-btn"
                      aria-label="Xem chi tiết & Chỉnh sửa"
                      type="button"
                      onClick={() => openCompanyDetailModal(company.id)}
                      title="Xem chi tiết & Chỉnh sửa"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button 
                      className="table-action-btn" 
                      aria-label="Xóa" 
                      type="button"
                      onClick={() => handleOpenDeleteModal(company)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-pagination">
          <span className="pagination-info">
            Trang {pagination.pageNumber} / {pagination.totalPages}
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn pagination-btn--nav"
              onClick={() => goToPage(pagination.pageNumber - 1)}
              disabled={!pagination.hasPreviousPage || isLoading}
              type="button"
            >
              Trước
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                className={`pagination-btn ${page === pagination.pageNumber ? 'pagination-btn--active' : ''}`}
                onClick={() => goToPage(page)}
                disabled={isLoading}
                type="button"
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn pagination-btn--nav"
              onClick={() => goToPage(pagination.pageNumber + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              type="button"
            >
              Tiếp
            </button>
          </div>
        </div>
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
