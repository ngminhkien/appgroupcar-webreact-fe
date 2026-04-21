import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import DriverApprovalTable from '../../components/AdminSysLayout/PendingDriver/PendingDriverTable';
import DriverDetailModal from '../../components/AdminSysLayout/PendingDriver/DriverDetailModal';
import { getMarketDriversApi } from '../../services/driverService';

const DEFAULT_PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value || value.startsWith('0001-01-01')) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('vi-VN');
};

const mapStatus = (statusValue) => {
  if (statusValue === 1) return 'pending';
  if (statusValue === 2) return 'active';
  if (statusValue === 3) return 'inactive';
  if (statusValue === 4) return 'rejected';
  return 'pending';
};

const PendingDriversPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleOpenDetailModal = (driver) => {
    setSelectedDriver(driver);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDriver(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword.trim());
      setPageNumber(1);
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pendingDrivers', debouncedKeyword, pageNumber],
    queryFn: async () => {
      const response = await getMarketDriversApi({
        search: debouncedKeyword || undefined,
        pageNumber: pageNumber,
        pageSize: DEFAULT_PAGE_SIZE,
        VerificationStatus: 1, // Always fetch Pending
      });
      return response?.data ?? {};
    },
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const drivers = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((item) => ({
      ...item,
      name: item.name || '--',
      licenseClass: item.licenseClass || '--',
      identityNumber: item.identityNumber || '--',
      submissionDate: formatDate(item.createdAt),
      status: mapStatus(item.verificationStatus),
      avatarUrl: item.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'NA')}&background=random`,
    }));
  }, [data]);

  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  const goToPage = (nextPage) => {
    setPageNumber(nextPage);
  };

  const handleDriverUpdated = () => {
    refetch();
  };

  const filteredDrivers = drivers.filter(driver => {
    if (activeFilter === 'all') return true;
    return driver.status === activeFilter;
  });
  console.log(filteredDrivers)
  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Inter']">
            Phê duyệt Tài xế
          </h1>
          <p className="text-slate-500 mt-2 font-medium font-['Inter']">
            Quản lý và xem xét các hồ sơ đăng ký mới trong hệ thống.
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
         <DriverApprovalTable 
           drivers={filteredDrivers} 
           isLoading={isLoading}
           pagination={pagination}
           onGoToPage={goToPage}
           onViewDetail={handleOpenDetailModal}
         />
      </div>

      <DriverDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        driver={selectedDriver}
        onUpdated={handleDriverUpdated}
      />
    </div>
  );
};

export default PendingDriversPage;
