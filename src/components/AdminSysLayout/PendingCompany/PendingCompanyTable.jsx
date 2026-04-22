import React, { useMemo } from 'react';
import { CompanyStatus } from '@/types/enums';

const buildPageList = (currentPage, totalPages) => {
  if (totalPages <= 1) return [1];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);
  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

const PendingCompanyTable = ({ companies, isLoading, pagination, onGoToPage, onViewDetail }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case CompanyStatus.Pending:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-1.5"></span>
            Chờ duyệt
          </span>
        );
      case CompanyStatus.Approved:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>
            Đã duyệt
          </span>
        );
      case CompanyStatus.Rejected:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></span>
            Từ chối
          </span>
        );
      case CompanyStatus.Suspended:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-1.5"></span>
            Tạm ngưng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
             Chưa xác định
          </span>
        );
    }
  };

  const currentStart = pagination?.totalCount === 0
    ? 0
    : (pagination?.pageNumber - 1) * pagination?.pageSize + 1;
  const currentEnd = Math.min((pagination?.pageNumber || 1) * (pagination?.pageSize || 10), pagination?.totalCount || 0);
  const pageNumbers = useMemo(
    () => buildPageList(pagination?.pageNumber || 1, pagination?.totalPages || 1),
    [pagination?.pageNumber, pagination?.totalPages]
  );

  return (
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">
              Công ty
            </th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">
              Mã công ty
            </th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">
              Liên hệ
            </th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">
              Trạng thái
            </th>
            <th className="px-5 py-3.5 text-left text-[0.72rem] font-bold uppercase tracking-[0.5px] text-slate-500/60 border-b border-slate-100 whitespace-nowrap">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
              <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                <div className="flex items-center gap-3">
                  {company.logoUrl && (
                    <img 
                      src={company.logoUrl} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100" 
                    />
                  )}
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-semibold text-slate-800">{company.companyName}</span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                <code className="text-[0.78rem] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  {company.companyCode || '--'}
                </code>
              </td>
              <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{company.phone || '--'}</span>
                  <span className="text-[0.78rem] text-slate-500 opacity-70">{company.email || '--'}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-[0.88rem] text-slate-800 border-b border-slate-50 align-middle">
                {getStatusBadge(company.status)}
              </td>
              <td className="px-5 py-4 border-b border-slate-50 align-middle">
                <div className="flex gap-1.5">
                  <button 
                    className="w-8 h-8 rounded-md bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 hover:text-blue-900 transition-colors cursor-pointer" 
                    title="Xem chi tiết"
                    onClick={() => onViewDetail(company)}
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
          {companies.length === 0 && !isLoading && (
            <tr>
              <td colSpan="5" className="px-5 py-8 text-center text-slate-500 text-[0.88rem]">
                Không tìm thấy công ty nào khớp.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {pagination && pagination.totalCount > 0 && (
        <div className="flex items-center justify-between px-5 py-4">
          <div className="hidden sm:block">
            <span className="text-[0.78rem] text-slate-500 opacity-80">
              Hiển thị {currentStart}-{currentEnd} trên {pagination.totalCount} công ty
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onGoToPage(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1 || isLoading}
              className="w-8 h-8 rounded-md flex items-center justify-center text-[0.75rem] font-semibold text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onGoToPage(page)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-[0.82rem] font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed
                  ${page === pagination.pageNumber 
                    ? 'bg-[#001f3f] text-white hover:bg-blue-900 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onGoToPage(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages || isLoading}
              className="w-8 h-8 rounded-md flex items-center justify-center text-[0.75rem] font-semibold text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCompanyTable;
