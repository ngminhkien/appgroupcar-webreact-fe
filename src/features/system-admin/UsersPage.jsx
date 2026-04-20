import React, { useCallback, useEffect, useState } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { UserTable, DeleteModal, UserDetailModal } from '@/components/AdminSysLayout/User';
import { getUsersApi, deleteUserApi } from '@/services/userService';
import toast from 'react-hot-toast';

const DEFAULT_PAGE_SIZE = 10;

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getAvatarColor = (seed = '') => {
  const colors = ['blue', 'green', 'purple', 'red'];
  const hash = seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const formatDate = (value) => {
  if (!value || value.startsWith('0001-01-01')) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('vi-VN');
};

const UsersPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [users, setUsers] = useState([]);
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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const fetchUsersList = useCallback(async (ignore = false) => {
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
      const response = await getUsersApi(params);
      const pageData = response?.data ?? {};
      const items = Array.isArray(pageData.items) ? pageData.items : [];

      if (ignore) return;

      const mappedUsers = items.map((item) => {
        const displayName = item.fullName || item.userName || item.email || 'N/A';
        const status = item.deleteAt === null ? 'active' : 'locked';

        return {
          id: item.id,
          name: displayName,
          avatar: getInitials(displayName),
          avatarColor: getAvatarColor(displayName),
          email: item.email || '--',
          phone: item.phoneNumber || '--',
          registerDate: formatDate(item.createAt),
          status,
        };
      });

      setUsers(mappedUsers);
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
      setUsers([]);
      setErrorMessage(error.response?.data?.message || 'Không tải được danh sách người dùng.');
    } finally {
      if (!ignore) {
        setIsLoading(false);
      }
    }
  }, [activeFilter, debouncedKeyword, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    let ignore = false;
    fetchUsersList(ignore);
    return () => {
      ignore = true;
    };
  }, [fetchUsersList]);

  const activeCount = users.filter((user) => user.status === 'active').length;
  const lockedCount = users.filter((user) => user.status !== 'active').length;

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

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const response = await deleteUserApi(selectedUser.id);
      toast.success(response?.message || 'Xóa người dùng thành công!');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsersList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDetailModal = (user) => {
    setDetailUserId(user.id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailUserId(null);
  };

  const handleUserUpdated = () => {
    fetchUsersList();
  };

  return (
    <div className="users-page">
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Quản lý người dùng</h1>
            <p className="admin-page-desc">Xem và quản lý danh sách người dùng trong hệ thống.</p>
          </div>
        </div>
      </div>

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
            <span className="mini-stat-label">Tổng người dùng</span>
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
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Bị khóa (trang hiện tại)</span>
            <span className="mini-stat-value">{lockedCount}</span>
          </div>
        </div>
      </div>

      <div className="admin-table-toolbar">
        <input
          type="text"
          value={searchKeyword}
          onChange={onSearchChange}
          placeholder="Tìm kiếm theo tên, email..."
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
          className={`admin-filter-btn ${activeFilter === 'locked' ? 'admin-filter-btn--active' : ''}`}
          onClick={() => onChangeFilter('locked')}
          type="button"
        >
          Bị khóa
        </button>
      </div>

      <UserTable
        users={users}
        isLoading={isLoading}
        errorMessage={errorMessage}
        pagination={pagination}
        onGoToPage={goToPage}
        onDelete={handleOpenDeleteModal}
        onViewDetail={handleOpenDetailModal}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
        isLoading={isDeleting}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        userId={detailUserId}
        onUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default UsersPage;
