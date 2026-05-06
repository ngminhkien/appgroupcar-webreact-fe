import React, { useState, useRef } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BusRouteTable from '@/components/AdminCompanyLayout/BusRoute/BusRouteTable';
import AddBusRouteModal from '@/components/AdminCompanyLayout/BusRoute/AddBusRouteModal';
import { getBusRoutesApi } from '@/services/busRouteService';

const DEFAULT_PAGE_SIZE = 10;

const RoutesPage = () => {
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchTimeoutRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['bus-routes', pageNumber, keyword],
    queryFn: async () => {
      const response = await getBusRoutesApi({
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
        ...(keyword && { Search: keyword })
      });
      return response?.data || {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const routes = Array.isArray(data?.items) ? data.items : [];
  
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
            <h1 className="admin-page-title">Tuyến xe</h1>
            <p className="admin-page-desc">Quản lý danh sách các tuyến đường xe chạy.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001f3f] text-white text-sm font-medium rounded-xl hover:bg-blue-900 transition-all shadow-sm active:scale-95 whitespace-nowrap" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm tuyến xe
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="admin-mini-stats">
        <div className="admin-mini-stat">
          <div className="mini-stat-icon mini-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div className="mini-stat-info">
            <span className="mini-stat-label">Tổng số tuyến</span>
            <span className="mini-stat-value">{pagination.totalCount}</span>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f] focus:bg-white transition-colors"
            placeholder="Tìm kiếm theo tên tuyến, mã tuyến..."
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="admin-data-table-wrapper relative mt-4">
         {isLoading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
         )}
         <BusRouteTable 
           routes={routes} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
         />
      </div>

      <AddBusRouteModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdded={() => {
          queryClient.invalidateQueries(['bus-routes']);
        }}
      />
    </div>
  );
};

export default RoutesPage;
