import React, { useMemo } from 'react';

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);
  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const getRouteEndpoints = (routePoints) => {
  if (!routePoints || routePoints.length === 0) {
    return { start: '--', end: '--', count: 0 };
  }
  const sorted = [...routePoints].sort((a, b) => a.sequence - b.sequence);
  return {
    start: sorted[0].locationName,
    end: sorted[sorted.length - 1].locationName,
    count: routePoints.length
  };
};

const BusRouteTable = ({ routes, isLoading, pagination, onGoToPage }) => {
  const currentStart = pagination?.totalCount === 0 ? 0 : (pagination?.pageNumber - 1) * pagination?.pageSize + 1;
  const currentEnd = Math.min((pagination?.pageNumber || 1) * (pagination?.pageSize || 10), pagination?.totalCount || 0);
  const pageNumbers = useMemo(() => buildPageList(pagination?.pageNumber || 1, pagination?.totalPages || 1), [pagination?.pageNumber, pagination?.totalPages]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Tên Tuyến</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Điểm đi</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Điểm đến</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Số trạm</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r, index) => {
            const endpoints = getRouteEndpoints(r.routePoints);
            return (
              <tr key={r.id || index} className="hover:bg-slate-50 transition-colors group">
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800 font-medium">
                   {r.name || '--'}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800">
                   {endpoints.start}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800">
                   {endpoints.end}
                 </td>
                 <td className="px-5 py-4 border-b border-slate-50 align-middle text-[0.88rem] text-slate-800 font-mono">
                   {endpoints.count}
                 </td>
              </tr>
            );
          })}
          {routes.length === 0 && !isLoading && (
            <tr>
              <td colSpan="4" className="px-5 py-8 text-center text-slate-500 text-[0.88rem]">Không tìm thấy tuyến xe nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Footer */}
      {pagination && pagination.totalCount > 0 && (
         <div className="flex items-center justify-between px-5 py-4">
            <div className="hidden sm:block">
               <span className="text-[0.78rem] text-slate-500 opacity-80">
                  Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} tuyến
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
export default BusRouteTable;
