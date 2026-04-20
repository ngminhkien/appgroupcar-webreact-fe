import React, { useState, useEffect, useCallback } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import VehicleTable from '@/components/AdminSysLayout/Vehicle/VehicleTable';
import { getVehiclesApi } from '@/services/vehicleService';
import { VehicleStatus, VehicleType } from '@/types/enums';

const DEFAULT_PAGE_SIZE = 10;

const VehiclesPage = () => {
  const [activeStatusFilter, setActiveStatusFilter] = useState(''); // '' means all
  const [activeTypeFilter, setActiveTypeFilter] = useState('');
  const [activeSeatFilter, setActiveSeatFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const fetchVehicles = useCallback(async (ignore = false) => {
    setIsLoading(true);
    try {
      const response = await getVehiclesApi({
        Search: debouncedKeyword || undefined,
        PageNumber: pagination.pageNumber,
        PageSize: pagination.pageSize,
        Status: activeStatusFilter ? Number(activeStatusFilter) : undefined,
        VehicleType: activeTypeFilter ? Number(activeTypeFilter) : undefined,
        SeatCapacity: activeSeatFilter ? Number(activeSeatFilter) : undefined,
      });
      const pageData = response?.data ?? {};
      const items = Array.isArray(pageData.items) ? pageData.items : [];

      if (ignore) return;

      setVehicles(items);
      setPagination(prev => ({
        ...prev,
        totalCount: pageData.totalCount ?? 0,
        pageNumber: pageData.pageNumber ?? 1,
        pageSize: pageData.pageSize ?? DEFAULT_PAGE_SIZE,
        totalPages: pageData.totalPages ?? 1,
      }));
    } catch (error) {
      if (ignore) return;
      console.error("Failed to fetch vehicles", error);
      setVehicles([]);
    } finally {
      if (!ignore) setIsLoading(false);
    }
  }, [debouncedKeyword, pagination.pageNumber, pagination.pageSize, activeStatusFilter, activeTypeFilter, activeSeatFilter]);

  // Reset pagination when filters change
  useEffect(() => {
      setPagination(prev => ({ ...prev, pageNumber: 1 }));
  }, [debouncedKeyword, activeStatusFilter, activeTypeFilter, activeSeatFilter]);

  useEffect(() => {
    let ignore = false;
    fetchVehicles(ignore);
    return () => { ignore = true; };
  }, [fetchVehicles]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.pageNumber) return;
    setPagination(prev => ({ ...prev, pageNumber: nextPage }));
  };

  const activeCount = vehicles.filter((v) => v.status === VehicleStatus.Active).length;
  const pendingCount = vehicles.filter((v) => v.status === VehicleStatus.Pending).length;

  return (
    <div className="vehicles-page">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Quản lý Phương tiện</h1>
            <p className="admin-page-desc">Quản lý toàn bộ danh sách phương tiện trên hệ thống.</p>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="admin-mini-stats">
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tổng phương tiện</span>
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
            <span className="mini-stat-label">Hoạt động (trang hiện tại)</span>
            <span className="mini-stat-value">{activeCount}</span>
          </div>
        </div>
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Chờ duyệt (trang hiện tại)</span>
            <span className="mini-stat-value">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-table-toolbar">
        <input
          type="text"
          placeholder="Tìm kiếm theo Biển số, Hãng xe..."
          className="admin-table-search-input"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select
          className="admin-filter-btn"
          value={activeStatusFilter}
          onChange={(e) => setActiveStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value={VehicleStatus.Pending}>Chờ duyệt</option>
          <option value={VehicleStatus.Active}>Hoạt động</option>
          <option value={VehicleStatus.Inactive}>Không hoạt động</option>
          <option value={VehicleStatus.Maintenance}>Bảo trì</option>
        </select>
        <select
          className="admin-filter-btn"
          value={activeTypeFilter}
          onChange={(e) => setActiveTypeFilter(e.target.value)}
        >
          <option value="">Loại phương tiện</option>
          <option value={VehicleType.Car}>Ô tô</option>
          <option value={VehicleType.Truck}>Xe tải</option>
        </select>
        <select
          className="admin-filter-btn"
          value={activeSeatFilter}
          onChange={(e) => setActiveSeatFilter(e.target.value)}
        >
          <option value="">Sức chứa</option>
          <option value="4">4 chỗ</option>
          <option value="5">5 chỗ</option>
          <option value="7">7 chỗ</option>
          <option value="16">16 chỗ</option>
          <option value="29">29 chỗ</option>
          <option value="45">45 chỗ</option>
          <option value="50">50 chỗ</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="admin-data-table-wrapper relative">
         {isLoading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
         )}
         <VehicleTable 
           vehicles={vehicles} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
         />
      </div>
    </div>
  );
};

export default VehiclesPage;
