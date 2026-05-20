import React, { useState, useEffect, useMemo } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery } from '@tanstack/react-query';
import DriverTable from '../../components/AdminSysLayout/Driver/DriverTable';
import DriverDetailModal from '../../components/AdminSysLayout/PendingDriver/DriverDetailModal';
import DeleteModal from '../../components/AdminSysLayout/Driver/DeleteModal';
import UnlockModal from '../../components/AdminSysLayout/Driver/UnlockModal';
import { getMarketDriversApi, lockDriverApi, unlockDriverApi } from '../../services/driverService';
import { getActiveDriversApi, getNewDriversApi } from '@/services/adminSystemStatisticService';
import toast from 'react-hot-toast';

const DEFAULT_PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value || value.startsWith('0001-01-01')) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('vi-VN');
};

const mapStatus = (statusValue) => {
  if (statusValue === 1) return 'pending';
  if (statusValue === 2) return 'active';
  if (statusValue === 3) return 'inactive';
  if (statusValue === 4) return 'rejected';
  return 'pending';
};

const DriversPage = () => {
  const [activeStatusFilter, setActiveStatusFilter] = useState(''); // '' means all
  const [activeLicenseFilter, setActiveLicenseFilter] = useState(''); // '' means all
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Lock/Unlock states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [selectedDeleteDriver, setSelectedDeleteDriver] = useState(null);
  const [selectedUnlockDriver, setSelectedUnlockDriver] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Statistical states
  const [totalDrivers, setTotalDrivers] = useState('...');
  const [newDriversCount, setNewDriversCount] = useState('...');

  const fetchStats = async () => {
    try {
      const activeRes = await getActiveDriversApi();
      if (activeRes?.code === 200) {
        setTotalDrivers(activeRes.data);
      }

      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).toISOString();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

      const newRes = await getNewDriversApi(start, end);
      if (newRes?.code === 200) {
        setNewDriversCount(newRes.data);
      }
    } catch (error) {
      console.error('Error fetching driver stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenDetailModal = (driver) => {
    setSelectedDriver(driver);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDriver(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['drivers', debouncedKeyword, pageNumber, activeStatusFilter, activeLicenseFilter],
    queryFn: async () => {
      let verifyParam = undefined;
      if (activeStatusFilter === 'pending') verifyParam = 1;
      if (activeStatusFilter === 'active') verifyParam = 2;
      if (activeStatusFilter === 'inactive') verifyParam = 3;
      if (activeStatusFilter === 'rejected') verifyParam = 4;

      const response = await getMarketDriversApi({
        search: debouncedKeyword || undefined,
        pageNumber: pageNumber,
        pageSize: DEFAULT_PAGE_SIZE,
        VerificationStatus: verifyParam,
        LicenseClass: activeLicenseFilter || undefined,
      });
      return response?.data ?? {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const drivers = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((item) => ({
      ...item,
      name: item.name || '--',
      licenseClass: item.licenseClass || '--',
      identityNumber: item.identityNumber || '--',
      submissionDate: formatDate(item.createdAt),
      status: mapStatus(item.verificationStatus),
      avatarUrl: item.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'NA')}&background=random`,
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

  const handleDriverUpdated = () => {
    refetch();
    fetchStats();
  };

  const handleOpenDeleteModal = (driver) => {
    setSelectedDeleteDriver(driver);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDeleteDriver(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteDriver) return;
    setIsDeleting(true);
    try {
      const response = await lockDriverApi(selectedDeleteDriver.id);
      toast.success(response?.message || 'Khóa tài xế thành công!');
      setIsDeleteModalOpen(false);
      setSelectedDeleteDriver(null);
      refetch();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi khóa tài xế.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenUnlockModal = (driver) => {
    setSelectedUnlockDriver(driver);
    setIsUnlockModalOpen(true);
  };

  const handleCloseUnlockModal = () => {
    setIsUnlockModalOpen(false);
    setSelectedUnlockDriver(null);
  };

  const handleConfirmUnlock = async () => {
    if (!selectedUnlockDriver) return;
    setIsUnlocking(true);
    try {
      const response = await unlockDriverApi(selectedUnlockDriver.id);
      toast.success(response?.message || 'Mở khóa tài xế thành công!');
      setIsUnlockModalOpen(false);
      setSelectedUnlockDriver(null);
      refetch();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi mở khóa tài xế.');
    } finally {
      setIsUnlocking(false);
    }
  };

  useEffect(() => {
    setPageNumber(1);
  }, [activeStatusFilter, activeLicenseFilter]);

  const activeCount = drivers.filter((d) => d.status === 'active').length;
  const pendingCount = drivers.filter((d) => d.status === 'pending').length;

  return (
    <div className="drivers-page">
      {/* Header Section */}
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Quản lý Tài xế</h1>
            <p className="admin-page-desc">Quản lý toàn bộ danh sách tài xế trên hệ thống.</p>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="admin-mini-stats">
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tổng tài xế</span>
            <span className="mini-stat-value">{totalDrivers}</span>
          </div>
        </div>
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tài xế mới (Tháng này)</span>
            <span className="mini-stat-value">{newDriversCount}</span>
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
          <div className="mini-stat-icon mini-stat-icon--red">
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
          placeholder="Tìm kiếm theo Tên, CCCD..."
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
          <option value="pending">Chờ duyệt</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm dừng</option>
          <option value="rejected">Từ chối</option>
        </select>
        <select
          className="admin-filter-btn"
          value={activeLicenseFilter}
          onChange={(e) => setActiveLicenseFilter(e.target.value)}
        >
          <option value="">Tất cả hạng bằng</option>
          <option value="B1">Hạng B1</option>
          <option value="B2">Hạng B2</option>
          <option value="C">Hạng C</option>
          <option value="D">Hạng D</option>
          <option value="E">Hạng E</option>
          <option value="F">Hạng F</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="admin-data-table-wrapper relative">
         {isLoading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
         )}
         <DriverTable 
           drivers={drivers} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
           onViewDetail={handleOpenDetailModal}
           onDelete={handleOpenDeleteModal}
           onUnlock={handleOpenUnlockModal}
         />
      </div>

      {/* Tái sử dụng DriverDetailModal từ PendingDriver */}
      <DriverDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        driver={selectedDriver}
        onUpdated={handleDriverUpdated}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        driverName={selectedDeleteDriver?.name}
        isLoading={isDeleting}
      />

      <UnlockModal
        isOpen={isUnlockModalOpen}
        onClose={handleCloseUnlockModal}
        onConfirm={handleConfirmUnlock}
        driverName={selectedUnlockDriver?.name}
        isLoading={isUnlocking}
      />
    </div>
  );
};

export default DriversPage;
