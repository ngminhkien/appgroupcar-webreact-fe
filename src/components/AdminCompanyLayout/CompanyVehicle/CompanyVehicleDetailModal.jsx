import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCompanyVehicleByIdApi } from '@/services/companyVehicleService';
import { VehicleStatus, VehicleType } from '@/types/enums';

const CompanyVehicleDetailModal = ({ isOpen, onClose, vehicle }) => {
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !vehicle?.companyVehicleId) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await getCompanyVehicleByIdApi(vehicle.companyVehicleId);
        const data = response?.data ?? response;
        // In case API returns { items: [...] }, we take the first item
        const item = Array.isArray(data?.items) ? data.items[0] : data;
        if (!cancelled) setDetailData(item);
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.message || 'Không thể tải chi tiết phương tiện.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => { cancelled = true; };
  }, [isOpen, vehicle?.companyVehicleId]);

  if (!isOpen || !vehicle) return null;

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${baseUrl}${formattedUrl}`;
  };

  const formatDate = (value) => {
    if (!value || value.startsWith('0001-01-01')) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatus = (statusValue) => {
    switch (statusValue) {
      case VehicleStatus.Pending: return 'Chờ duyệt';
      case VehicleStatus.Active: return 'Hoạt động';
      case VehicleStatus.Inactive: return 'Không hoạt động';
      case VehicleStatus.Maintenance: return 'Bảo trì';
      case VehicleStatus.Rejected: return 'Bị từ chối';
      default: return 'Không xác định';
    }
  };

  const renderVehicleType = (typeValue) => {
    switch (typeValue) {
      case VehicleType.Car: return 'Ô tô';
      case VehicleType.Truck: return 'Xe tải';
      default: return 'Khác';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl transition-transform duration-300 scale-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chi tiết phương tiện công ty</h2>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-slate-500">Đang tải chi tiết...</span>
            </div>
          ) : detailData ? (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div
                  className="w-96 h-64 rounded-xl border-4 border-white shadow-lg ring-2 ring-slate-100 bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden"
                >
                  {detailData.urlImage ? (
                     <img src={getFullImageUrl(detailData.urlImage)} alt="Phương tiện" className="w-full h-full object-cover" />
                  ) : (
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                       <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                  )}
                </div>
              </div>

              {/* Details Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-500">Biển số</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium font-mono uppercase">
                    {detailData.plateNumber || "--"}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Sức chứa/Số chỗ</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {detailData.seatCapacity ?? "--"}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Loại phương tiện</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {renderVehicleType(detailData.vehicleType)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Trạng thái hiện tại</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {renderStatus(detailData.status)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Ngày đăng ký</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {formatDate(detailData.createdAt)}
                  </div>
                </div>
              </div>

              {/* License Document Image if exists */}
              {detailData.registrationDocumentUrl && (
                 <div className="mt-4 border-t border-slate-100 pt-5">
                    <label className="block text-sm font-medium text-slate-500 mb-3">Giấy đăng ký xe (Cà vẹt xe)</label>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center p-2 min-h-[150px]">
                       <img 
                         src={getFullImageUrl(detailData.registrationDocumentUrl)} 
                         alt="Cà vẹt xe" 
                         className="max-w-full h-auto max-h-[250px] object-contain rounded-lg mx-auto" 
                         onError={(e) => { e.target.parentElement.innerHTML = '<span class="text-slate-400 text-sm">Hình ảnh bị lỗi hoặc không tồn tại</span>'; }}
                       />
                    </div>
                 </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Không tìm thấy thông tin
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyVehicleDetailModal;
