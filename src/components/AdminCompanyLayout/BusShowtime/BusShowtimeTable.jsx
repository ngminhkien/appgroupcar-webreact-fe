import React, { useMemo } from 'react';
import { BusShowtimeStatus } from '@/types/enums';

const getStatusBadge = (status) => {
  switch (status) {
    case BusShowtimeStatus.Scheduled:
      return <span className="px-2.5 py-1 text-[0.75rem] font-medium rounded-md bg-blue-50 text-blue-600">Lên lịch</span>;
    case BusShowtimeStatus.Active:
      return <span className="px-2.5 py-1 text-[0.75rem] font-medium rounded-md bg-emerald-50 text-emerald-600">Hoạt động</span>;
    case BusShowtimeStatus.Delayed:
      return <span className="px-2.5 py-1 text-[0.75rem] font-medium rounded-md bg-orange-50 text-orange-600">Bị hoãn</span>;
    case BusShowtimeStatus.Cancelled:
      return <span className="px-2.5 py-1 text-[0.75rem] font-medium rounded-md bg-red-50 text-red-600">Đã hủy</span>;
    case BusShowtimeStatus.Hidden:
      return <span className="px-2.5 py-1 text-[0.75rem] font-medium rounded-md bg-slate-100 text-slate-500">Đã ẩn</span>;
    default:
      return <span className="px-2.5 py-1 text-[0.75rem] font-medium rounded-md bg-slate-100 text-slate-600">Chưa xác định</span>;
  }
};

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);
  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const BusShowtimeTable = ({ showtimes, isLoading, pagination, onGoToPage, onViewDetail, onEdit, onDelete }) => {
  const currentStart = pagination?.totalCount === 0 ? 0 : (pagination?.pageNumber - 1) * pagination?.pageSize + 1;
  const currentEnd = Math.min((pagination?.pageNumber || 1) * (pagination?.pageSize || 10), pagination?.totalCount || 0);
  const pageNumbers = useMemo(() => buildPageList(pagination?.pageNumber || 1, pagination?.totalPages || 1), [pagination?.pageNumber, pagination?.totalPages]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Mã lịch trình</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Biển số xe</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Khởi hành</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Số ghế</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Giá vé</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Trạng thái</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.map((item, index) => {
            return (
              <tr key={item.id || index} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onViewDetail && onViewDetail(item)}>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800 font-mono">
                   {item.id ? item.id.substring(0, 8).toUpperCase() : '--'}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800 font-medium">
                   {item.plateNumber || '--'}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800">
                   <div className="flex flex-col">
                     <span className="font-medium text-slate-900">{item.departureTime}</span>
                     <span className="text-[0.8rem] text-slate-500">{item.departureDate}</span>
                   </div>
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800">
                   {item.seatCount ?? '--'}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800">
                   {item.price != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) : '--'}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800">
                    {getStatusBadge(item.status)}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle">
                    <div className="flex gap-1.5">
                       <button 
                          className="w-8 h-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-blue-900 transition-colors cursor-pointer" 
                          title="Xem chi tiết"
                          onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(item); }}
                       >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                             <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                             <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                       </button>
                       <button 
                          className="w-8 h-8 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer" 
                          title="Sửa lịch trình"
                          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                       >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L5.39 18.25l.441-3.294a4.5 4.5 0 011.13-1.897l8.901-8.902z" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
                          </svg>
                       </button>
                       <button 
                          className="w-8 h-8 rounded-md bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer" 
                          title="Xóa lịch trình"
                          onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item); }}
                       >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                       </button>
                    </div>
                 </td>
              </tr>
            );
          })}
          {showtimes.length === 0 && !isLoading && (
            <tr>
              <td colSpan="7" className="px-5 py-8 text-center text-slate-500 text-[0.88rem]">Không tìm thấy lịch trình nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Footer */}
      {pagination && pagination.totalCount > 0 && (
         <div className="flex items-center justify-between px-5 py-4">
            <div className="hidden sm:block">
               <span className="text-[0.78rem] text-slate-500 opacity-80">
                  Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} lịch trình
               </span>
            </div>
            <div className="flex gap-1">
               <button onClick={() => onGoToPage(pagination.pageNumber - 1)} disabled={pagination.pageNumber <= 1 || isLoading} className="w-8 h-8 rounded-md flex items-center justify-center text-[0.75rem] font-semibold text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed">Trước</button>
               {pageNumbers.map(page => (
                  <button key={page} onClick={() => onGoToPage(page)} disabled={isLoading} className={`w-8 h-8 rounded-md flex items-center justify-center text-[0.82rem] font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${page === pagination.pageNumber ? 'bg-[#001f3f] text-white hover:bg-blue-900 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>{page}</button>
               ))}
               <button onClick={() => onGoToPage(pagination.pageNumber + 1)} disabled={pagination.pageNumber >= pagination.totalPages || isLoading} className="w-8 h-8 rounded-md flex items-center justify-center text-[0.75rem] font-semibold text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed">Tiếp</button>
            </div>
         </div>
      )}
    </div>
  );
};

export default BusShowtimeTable;
