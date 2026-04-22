import React, { useMemo } from 'react';

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);
  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const CompanyUserTable = ({ users, isLoading, pagination, onGoToPage }) => {
  const currentStart = pagination?.totalCount === 0 ? 0 : (pagination?.pageNumber - 1) * pagination?.pageSize + 1;
  const currentEnd = Math.min((pagination?.pageNumber || 1) * (pagination?.pageSize || 10), pagination?.totalCount || 0);
  const pageNumbers = useMemo(() => buildPageList(pagination?.pageNumber || 1, pagination?.totalPages || 1), [pagination?.pageNumber, pagination?.totalPages]);

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">ID Nhân sự</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Company ID</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">User ID</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Ngày tham gia</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id || index} className="hover:bg-slate-50 transition-colors group">
               <td className="px-5 py-4 border-b border-slate-50 align-middle">
                 <span className="inline-block px-2.5 py-1 text-[0.85rem] font-mono tracking-wider font-bold bg-white text-slate-800 border border-slate-200 rounded shadow-sm" title={u.id}>
                   {u.id ? u.id.split('-')[0] + '...' : '--'}
                 </span>
               </td>
               <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-500 font-mono" title={u.companyId}>
                 {u.companyId ? u.companyId.split('-')[0] + '...' : '--'}
               </td>
               <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800 font-mono" title={u.userId}>
                 {u.userId || '--'}
               </td>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                 {formatDate(u.joinedAt)}
               </td>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                 {u.isActive ? (
                   <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                     <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>
                     Đang hoạt động
                   </span>
                 ) : (
                   <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                     <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-1.5"></span>
                     Ngừng hoạt động
                   </span>
                 )}
               </td>
            </tr>
          ))}
          {users.length === 0 && !isLoading && (
            <tr>
              <td colSpan="5" className="px-5 py-8 text-center text-slate-500 text-[0.88rem]">Không tìm thấy tài khoản nhân sự nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Footer */}
      {pagination && pagination.totalCount > 0 && (
         <div className="flex items-center justify-between px-5 py-4">
            <div className="hidden sm:block">
               <span className="text-[0.78rem] text-slate-500 opacity-80">
                  Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} tài khoản
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
export default CompanyUserTable;
