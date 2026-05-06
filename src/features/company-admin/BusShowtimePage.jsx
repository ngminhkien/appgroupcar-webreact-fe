import React, { useState, useRef } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BusShowtimeTable from '@/components/AdminCompanyLayout/BusShowtime/BusShowtimeTable';
import AddBusShowtimeModal from '@/components/AdminCompanyLayout/BusShowtime/AddBusShowtimeModal';
import EditBusShowtimeModal from '@/components/AdminCompanyLayout/BusShowtime/EditBusShowtimeModal';
import BusShowtimeDetailModal from '@/components/AdminCompanyLayout/BusShowtime/BusShowtimeDetailModal';
import DeleteBusShowtimeModal from '@/components/AdminCompanyLayout/BusShowtime/DeleteBusShowtimeModal';
import { getBusShowtimesApi } from '@/services/busShowtimeService';

const DEFAULT_PAGE_SIZE = 10;

const BusShowtimePage = () => {
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchTimeoutRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showtimeToEdit, setShowtimeToEdit] = useState(null);

  const handleOpenDetailModal = (showtime) => {
    setSelectedShowtime(showtime);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedShowtime(null);
  };

  const handleOpenEditModal = (showtime) => {
    setShowtimeToEdit(showtime);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setShowtimeToEdit(null);
  };

  const handleOpenDeleteModal = (showtime) => {
    setShowtimeToDelete(showtime);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setShowtimeToDelete(null);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['bus-showtimes', pageNumber, keyword, filterDate, filterStatus],
    queryFn: async () => {
      const response = await getBusShowtimesApi({
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
        ...(keyword && { Search: keyword }),
        ...(filterDate && { DepartureDate: filterDate }),
        ...(filterStatus && { Status: filterStatus })
      });
      return response?.data || response || {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const showtimes = Array.isArray(data?.items) ? data.items : [];
  
  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setKeyword(val);
      setPageNumber(1);
    }, 500);
  };

  return (
    <div className="vehicles-page">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Lịch trình xe</h1>
            <p className="admin-page-desc">Quản lý danh sách các lịch trình chạy của công ty.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001f3f] text-white text-sm font-medium rounded-xl hover:bg-blue-900 transition-all shadow-sm active:scale-95 whitespace-nowrap" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm lịch trình
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="admin-mini-stats">
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tổng số lịch trình</span>
            <span className="mini-stat-value">{pagination.totalCount}</span>
          </div>
        </div>
      </div>
      
      {/* Filter and Search Bar */}
      <div className="admin-table-toolbar">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên tuyến..."
          className="admin-table-search-input"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <input 
          type="date" 
          className="admin-filter-btn"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setPageNumber(1);
          }}
        />
        <select
          className="admin-filter-btn"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Lên lịch</option>
          <option value="2">Hoạt động</option>
          <option value="3">Bị hoãn</option>
          <option value="4">Đã hủy</option>
          <option value="5">Ẩn</option>
        </select>
      </div>

      <div className="admin-data-table-wrapper relative mt-4">
         {isLoading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
         )}
         <BusShowtimeTable 
           showtimes={showtimes} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
           onViewDetail={handleOpenDetailModal}
           onEdit={handleOpenEditModal}
           onDelete={handleOpenDeleteModal}
         />
      </div>

      <AddBusShowtimeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={() => {
          queryClient.invalidateQueries(['bus-showtimes']);
        }}
      />

      <BusShowtimeDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        showtime={selectedShowtime}
      />

      <EditBusShowtimeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        showtime={showtimeToEdit}
        onUpdated={() => {
          queryClient.invalidateQueries(['bus-showtimes']);
        }}
      />

      <DeleteBusShowtimeModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDeleted={() => {
          queryClient.invalidateQueries(['bus-showtimes']);
        }}
        showtimeId={showtimeToDelete?.id}
        displayCode={showtimeToDelete?.id ? showtimeToDelete.id.substring(0, 8).toUpperCase() : ''}
      />
    </div>
  );
};

export default BusShowtimePage;
