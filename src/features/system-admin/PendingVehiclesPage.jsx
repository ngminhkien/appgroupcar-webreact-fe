import React, { useState, useEffect, useCallback } from 'react';
import VehicleTable from '@/components/AdminSysLayout/Vehicle/VehicleTable';
import VehicleDetailModal from '@/components/AdminSysLayout/PendingVehicle/VehicleDetailModal';
import { getVehiclesApi } from '@/services/vehicleService';

const DEFAULT_PAGE_SIZE = 10;

const PendingVehiclesPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleOpenDetailModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVehicle(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const fetchVehicles = useCallback(async (ignore = false) => {
    setIsLoading(true);
    try {
      const response = await getVehiclesApi({
        Search: debouncedKeyword || undefined,
        PageNumber: pagination.pageNumber,
        PageSize: pagination.pageSize,
        Status: 1, // Status = Pending (1)
      });
      const pageData = response?.data ?? {};
      const items = Array.isArray(pageData.items) ? pageData.items : [];

      if (ignore) return;

      setVehicles(items);
      setPagination(prev => ({
        ...prev,
        totalCount: pageData.totalCount ?? 0,
        pageNumber: pageData.pageNumber ?? 1,
        pageSize: pageData.pageSize ?? DEFAULT_PAGE_SIZE,
        totalPages: pageData.totalPages ?? 1,
      }));
    } catch (error) {
      if (ignore) return;
      console.error("Failed to fetch vehicles", error);
      setVehicles([]);
    } finally {
      if (!ignore) setIsLoading(false);
    }
  }, [debouncedKeyword, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    let ignore = false;
    fetchVehicles(ignore);
    return () => { ignore = true; };
  }, [fetchVehicles]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.pageNumber) return;
    setPagination(prev => ({ ...prev, pageNumber: nextPage }));
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Inter']">
            Phê duyệt Phương tiện
          </h1>
          <p className="text-slate-500 mt-2 font-medium font-['Inter']">
            Quản lý và xem xét các hồ sơ phương tiện mới đăng ký.
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
         {isLoading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
         )}
         <VehicleTable 
           vehicles={vehicles} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
           onViewDetail={handleOpenDetailModal}
         />
      </div>

      <VehicleDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        vehicle={selectedVehicle}
        onUpdated={fetchVehicles}
      />
    </div>
  );
};

export default PendingVehiclesPage;
