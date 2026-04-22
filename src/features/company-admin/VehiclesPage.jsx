import React, { useState, useEffect } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CompanyVehicleTable from '@/components/AdminCompanyLayout/CompanyVehicle/CompanyVehicleTable';
import CompanyVehicleDetailModal from '@/components/AdminCompanyLayout/CompanyVehicle/CompanyVehicleDetailModal';
import AddCompanyVehicleModal from '@/components/AdminCompanyLayout/CompanyVehicle/AddCompanyVehicleModal';
import DeleteCompanyVehicleModal from '@/components/AdminCompanyLayout/CompanyVehicle/DeleteCompanyVehicleModal';
import { getCompanyVehiclesApi } from '@/services/companyVehicleService';
import { VehicleStatus, VehicleType } from '@/types/enums';

const DEFAULT_PAGE_SIZE = 10;

const VehiclesPage = () => {
  const queryClient = useQueryClient();
  const [activeStatusFilter, setActiveStatusFilter] = useState(''); // '' means all
  const [activeTypeFilter, setActiveTypeFilter] = useState('');
  const [activeSeatFilter, setActiveSeatFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleOpenDetailModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleOpenDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVehicleToDelete(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const { data, isLoading } = useQuery({
    queryKey: ['company-vehicles', debouncedKeyword, pageNumber, activeStatusFilter, activeTypeFilter, activeSeatFilter],
    queryFn: async () => {
      const response = await getCompanyVehiclesApi({
        Search: debouncedKeyword || undefined,
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
        Status: activeStatusFilter ? Number(activeStatusFilter) : undefined,
        VehicleType: activeTypeFilter ? Number(activeTypeFilter) : undefined,
        SeatCapacity: activeSeatFilter ? Number(activeSeatFilter) : undefined,
      });
      return response || {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const vehicles = Array.isArray(data?.items) ? data.items : [];
  
  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  useEffect(() => {
    setPageNumber(1);
  }, [activeStatusFilter, activeTypeFilter, activeSeatFilter]);

  const activeCount = vehicles.filter((v) => v.status === VehicleStatus.Active).length;
  const pendingCount = vehicles.filter((v) => v.status === VehicleStatus.Pending).length;

  return (
    <div className="vehicles-page">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Phương tiện công ty</h1>
            <p className="admin-page-desc">Quản lý danh sách các phương tiện (xe ô tô, xe tải...) thuộc công ty.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001f3f] text-white text-sm font-medium rounded-xl hover:bg-blue-900 transition-all shadow-sm active:scale-95 whitespace-nowrap" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm mới phương tiện
          </button>
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
         <CompanyVehicleTable 
           vehicles={vehicles} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
           onViewDetail={handleOpenDetailModal}
           onDelete={handleOpenDeleteModal}
         />
      </div>

      {/* Detail Modal */}
      <CompanyVehicleDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        vehicle={selectedVehicle}
      />

      {/* Add Modal */}
      <AddCompanyVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={() => {
          queryClient.invalidateQueries(['company-vehicles']);
        }}
      />

      {/* Delete Modal */}
      <DeleteCompanyVehicleModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDeleted={() => {
          queryClient.invalidateQueries(['company-vehicles']);
        }}
        vehicleId={vehicleToDelete?.companyVehicleId}
        plateNumber={vehicleToDelete?.plateNumber}
      />
    </div>
  );
};

export default VehiclesPage;
