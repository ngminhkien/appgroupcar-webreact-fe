import React, { useMemo } from 'react';

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const UserTable = ({ 
  users, 
  isLoading, 
  errorMessage, 
  pagination, 
  onGoToPage,
  onDelete,
  onViewDetail
}) => {
  const currentStart = pagination.totalCount === 0
    ? 0
    : (pagination.pageNumber - 1) * pagination.pageSize + 1;
  const currentEnd = Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount);
  const pageNumbers = useMemo(
    () => buildPageList(pagination.pageNumber, pagination.totalPages),
    [pagination.pageNumber, pagination.totalPages]
  );

  return (
    <div className="admin-data-table-wrapper">
      <table className="admin-data-table">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày đăng ký</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          )}

          {!isLoading && errorMessage && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--error-color)' }}>
                {errorMessage}
              </td>
            </tr>
          )}

          {!isLoading && !errorMessage && users.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                Không có dữ liệu phù hợp.
              </td>
            </tr>
          )}

          {!isLoading && !errorMessage && users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="table-cell-main">
                  <div className={`table-avatar table-avatar--${user.avatarColor}`}>
                    {user.avatar}
                  </div>
                  <span className="table-name">{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.registerDate}</td>
              <td>
                <span className={`status-badge status-badge--${user.status}`}>
                  <span className="status-badge-dot" />
                  {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button 
                    className="table-action-btn" 
                    aria-label="Xem chi tiết & Chỉnh sửa" 
                    type="button"
                    onClick={() => onViewDetail(user)}
                    title="Xem chi tiết & Chỉnh sửa"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    className="table-action-btn" 
                    aria-label="Khóa mở" 
                    type="button"
                    onClick={() => onDelete(user)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
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
          Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} người dùng
        </span>
        <div className="pagination-controls">
          <button
            className="pagination-btn pagination-btn--nav"
            onClick={() => onGoToPage(pagination.pageNumber - 1)}
            disabled={!pagination.hasPreviousPage || isLoading}
            type="button"
          >
            Trước
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`pagination-btn ${page === pagination.pageNumber ? 'pagination-btn--active' : ''}`}
              onClick={() => onGoToPage(page)}
              disabled={isLoading}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-btn pagination-btn--nav"
            onClick={() => onGoToPage(pagination.pageNumber + 1)}
            disabled={!pagination.hasNextPage || isLoading}
            type="button"
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
