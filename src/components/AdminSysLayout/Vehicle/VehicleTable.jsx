import React, { useMemo } from 'react';
import { VehicleStatus, VehicleType } from '@/types/enums';

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);
  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const VehicleTable = ({ vehicles, isLoading, pagination, onGoToPage, onViewDetail }) => {
  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case VehicleStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-1.5"></span>
            Chờ duyệt
          </span>
        );
      case VehicleStatus.Active:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>
            Hoạt động
          </span>
        );
      case VehicleStatus.Inactive:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-1.5"></span>
            Không hoạt động
          </span>
        );
      case VehicleStatus.Maintenance:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-1.5"></span>
            Bảo trì
          </span>
        );
      case VehicleStatus.Rejected:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></span>
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getVehicleTypeName = (typeValue) => {
    switch (typeValue) {
      case VehicleType.Car: return 'Ô tô';
      case VehicleType.Truck: return 'Xe tải';
      default: return 'Khác';
    }
  };

  const currentStart = pagination?.totalCount === 0 ? 0 : (pagination?.pageNumber - 1) * pagination?.pageSize + 1;
  const currentEnd = Math.min((pagination?.pageNumber || 1) * (pagination?.pageSize || 10), pagination?.totalCount || 0);
  const pageNumbers = useMemo(() => buildPageList(pagination?.pageNumber || 1, pagination?.totalPages || 1), [pagination?.pageNumber, pagination?.totalPages]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Ảnh xe</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Hãng xe</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Biển số</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Sức chứa/Số chỗ</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Loại phương tiện</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Trạng thái</th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onViewDetail && onViewDetail(v)}>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                 <div className="flex items-center gap-3">
                    {v.urlImage ? (
                       <img src={v.urlImage} alt="Vehicle" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                    ) : (
                       <div className="w-10 h-10 rounded-md bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                       </div>
                    )}
                 </div>
               </td>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle font-medium">{v.brand || '--'}</td>
               <td className="px-5 py-4 border-b border-slate-50 align-middle">
                 <span className="inline-block px-2.5 py-1 text-[0.85rem] font-mono tracking-wider font-bold bg-white text-slate-800 border-2 border-slate-300 rounded shadow-sm">
                   {v.plateNumber || '--'}
                 </span>
               </td>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">{v.seatCapacity || '--'}</td>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">{getVehicleTypeName(v.vehicleType)}</td>
               <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">{getStatusBadge(v.status)}</td>
               <td className="px-5 py-4 border-b border-slate-50 align-middle">
                  <div className="flex gap-1.5">
                     <button 
                        className="w-8 h-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-blue-900 transition-colors cursor-pointer" 
                        title="Xem chi tiết"
                        onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(v); }}
                     >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                           <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                           <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                     </button>
                  </div>
               </td>
            </tr>
          ))}
          {vehicles.length === 0 && !isLoading && (
            <tr>
              <td colSpan="7" className="px-5 py-8 text-center text-slate-500 text-[0.88rem]">Không tìm thấy phương tiện nào khớp.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Footer */}
      {pagination && pagination.totalCount > 0 && (
         <div className="flex items-center justify-between px-5 py-4">
            <div className="hidden sm:block">
               <span className="text-[0.78rem] text-slate-500 opacity-80">
                  Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} phương tiện
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
export default VehicleTable;
