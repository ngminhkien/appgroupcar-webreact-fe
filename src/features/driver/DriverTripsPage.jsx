import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyOffersApi } from '@/services/offerService';
import { DriverTripCard } from '@/components/DriverComponents';

const DriverTripsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch driver offers using react-query
  const { data: rawOffers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['myOffers'],
    queryFn: async () => {
      const response = await getMyOffersApi();
      return response?.data || response || [];
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Ensure data is array
  const offersList = Array.isArray(rawOffers) ? rawOffers : [];

  // Filter list based on search and selected options
  const filteredOffers = useMemo(() => {
    return offersList.filter((trip) => {
      // 1. Service Type filter
      if (serviceFilter !== 'all' && String(trip.serviceType) !== serviceFilter) {
        return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all' && String(trip.status) !== statusFilter) {
        return false;
      }

      // 3. Location Search filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const startMatch = trip.startPoint?.locationName?.toLowerCase().includes(query);
        const endMatch = trip.endPoint?.locationName?.toLowerCase().includes(query);
        const vehicleMatch = trip.vehicleName?.toLowerCase().includes(query);
        const plateMatch = trip.plateNumber?.toLowerCase().includes(query);
        return startMatch || endMatch || vehicleMatch || plateMatch;
      }

      return true;
    });
  }, [offersList, searchTerm, serviceFilter, statusFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setServiceFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="bg-slate-100 min-h-[85vh] w-full py-12 px-4 sm:px-6 relative text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Title and Top section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Chuyến đi của tôi
            </h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">
              Quản lý, tìm kiếm và theo dõi tất cả các chuyến đi (offers) bạn đã đăng ký làm tài xế.
            </p>
          </div>
          
          <button 
            onClick={() => refetch()}
            className="self-start md:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 11H18.79" />
            </svg>
            Tải lại dữ liệu
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/60 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Tìm địa điểm / xe</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm điểm đi, điểm đến, biển số..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Service Type Filter */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Loại dịch vụ</label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-extrabold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer text-xs shadow-sm"
              >
                <option value="all">Tất cả dịch vụ</option>
                <option value="1">Xe ghép / Đi chung</option>
                <option value="2">Bao xe / Hợp đồng</option>
                <option value="3">Xe tải vận chuyển</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Trạng thái chuyến</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-extrabold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer text-xs shadow-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="2">Tạm dừng</option>
                <option value="3">Đã đóng</option>
                <option value="4">Hoàn thành</option>
              </select>
            </div>

          </div>
        </div>

        {/* List of Trip Cards */}
        <div className="flex flex-col gap-5">
          {isLoading ? (
            // Skeleton Loader
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full h-48 bg-white border border-slate-200 rounded-3xl animate-pulse flex flex-col md:flex-row">
                  <div className="w-full md:w-56 h-full bg-slate-200 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
                  <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-10 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-red-800 font-extrabold text-sm mb-1">Đã xảy ra lỗi khi tải danh sách chuyến đi</h3>
              <p className="text-red-600 text-xs font-semibold">{error?.message || 'Vui lòng kiểm tra lại kết nối mạng.'}</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all shadow-sm"
              >
                Thử lại
              </button>
            </div>
          ) : filteredOffers.length > 0 ? (
            // Trips List
            filteredOffers.map((trip) => (
              <DriverTripCard key={trip.id} trip={trip} />
            ))
          ) : (
            // Empty State
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16v-2a4 4 0 00-3-3.87V11h-4.13M14 8.5h3m-3 3h2.5" />
              </svg>
              <h3 className="text-slate-700 font-extrabold text-base mb-1">Không tìm thấy chuyến đi nào</h3>
              <p className="text-slate-400 text-xs font-semibold">
                {offersList.length === 0 
                  ? 'Bạn chưa tạo chuyến đi (offer) nào trên hệ thống.' 
                  : 'Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.'}
              </p>
              
              {offersList.length > 0 ? (
                <button
                  onClick={clearFilters}
                  className="mt-5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Xóa bộ lọc
                </button>
              ) : null}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DriverTripsPage;
