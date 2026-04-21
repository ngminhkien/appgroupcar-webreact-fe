import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import VehicleTable from '@/components/AdminSysLayout/Vehicle/VehicleTable';
import VehicleDetailModal from '@/components/AdminSysLayout/PendingVehicle/VehicleDetailModal';
import { getVehiclesApi } from '@/services/vehicleService';

const DEFAULT_PAGE_SIZE = 10;

const PendingVehiclesPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

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
      setPageNumber(1);
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pendingVehicles', debouncedKeyword, pageNumber],
    queryFn: async () => {
      const response = await getVehiclesApi({
        Search: debouncedKeyword || undefined,
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
        Status: 1, // Status = Pending (1)
      });
      return response?.data ?? {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const vehicles = Array.isArray(data?.items) ? data.items : [];
  
  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  const handleUpdated = () => {
    refetch();
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
        onUpdated={handleUpdated}
      />
    </div>
  );
};

export default PendingVehiclesPage;
