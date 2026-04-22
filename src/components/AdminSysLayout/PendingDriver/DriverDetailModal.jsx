import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { approveDriverApi, getDriverByIdApi } from '@/services/driverService';

const DriverDetailModal = ({ isOpen, onClose, driver, onUpdated }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !driver?.id) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await getDriverByIdApi(driver.id);
        const data = response?.data ?? response;
        if (!cancelled) setDetailData(data);
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.message || 'Không thể tải chi tiết tài xế.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    console.log(driver)
    fetchDetail();
    return () => { cancelled = true; };
  }, [isOpen, driver?.id]);

  if (!isOpen || !driver) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const res = await approveDriverApi(driver.id);
      toast.success(res?.message || 'Phê duyệt tài xế thành công!');
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt.');
    } finally {
      setIsProcessing(false);
    }
  };

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
      case 1: return 'Chờ duyệt';
      case 2: return 'Hoạt động';
      case 3: return 'Tạm dừng';
      case 4: return 'Bị từ chối';
      default: return 'Không xác định';
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
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chi tiết hồ sơ tài xế</h2>
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
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg ring-2 ring-slate-100 bg-slate-100 flex items-center justify-center text-slate-400"
                >
                  {/* Tạm thời để trống avatar theo yêu cầu */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>

              {/* Details Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-500">Tên tài xế</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {detailData.name || "--"}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Số CMND/CCCD</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {detailData.identityNumber || "--"}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Trạng thái hiện tại</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {renderStatus(detailData.verificationStatus)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Số bằng lái</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {detailData.licenseNumber || "--"}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Hạng bằng lái</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {detailData.licenseClass || "Chưa cập nhật"}
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-500">Ngày đăng ký</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {formatDate(detailData.createdAt)}
                  </div>
                </div>
              </div>

              {/* License Document Image if exists */}
              {detailData.licenseDocumentUrl && (
                 <div className="mt-4 border-t border-slate-100 pt-5">
                    <label className="block text-sm font-medium text-slate-500 mb-3">Ảnh chứng chỉ / Bằng lái</label>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center p-2 min-h-[150px]">
                       <img 
                         src={getFullImageUrl(detailData.licenseDocumentUrl)} 
                         alt="Bằng lái" 
                         className="max-w-full h-auto max-h-[400px] object-contain rounded-lg" 
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
            disabled={isProcessing}
          >
            Đóng
          </button>
          
          {detailData?.verificationStatus === 1 && (
             <>
               <button
                 type="button"
                 className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                 onClick={handleApprove}
                 disabled={isProcessing}
               >
                 {isProcessing && (
                   <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                 )}
                 {isProcessing ? 'Đang xử lý...' : 'Xác nhận Phê duyệt'}
               </button>
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
