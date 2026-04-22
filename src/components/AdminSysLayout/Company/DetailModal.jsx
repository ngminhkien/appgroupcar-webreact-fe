import React, { useEffect, useState } from 'react';
import { getCompanyDetailApi, updateCompanyStatusApi } from '@/services/companyService';
import { CompanyType, CompanyStatus } from '@/types/enums';
import toast from 'react-hot-toast';

const getCompanyTypeLabel = (companyType) => {
  switch (companyType) {
    case CompanyType.Bus:
      return 'Xe khách';
    case CompanyType.CarRental:
      return 'Cho thuê xe';
    case CompanyType.RideSharing:
      return 'Ghép chuyến';
    default:
      return 'Không xác định';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case CompanyStatus.Approved:
      return { label: 'Đã duyệt', color: 'text-emerald-600 bg-emerald-50' };
    case CompanyStatus.Pending:
      return { label: 'Chờ duyệt', color: 'text-amber-600 bg-amber-50' };
    case CompanyStatus.Rejected:
      return { label: 'Từ chối', color: 'text-red-600 bg-red-50' };
    case CompanyStatus.Suspended:
      return { label: 'Tạm ngưng', color: 'text-slate-600 bg-slate-100' };
    default:
      return { label: 'Không xác định', color: 'text-slate-500 bg-slate-50' };
  }
};

const formatDateTime = (value) => {
  if (!value || value.startsWith('0001-01-01')) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('vi-VN');
};

const DetailModal = ({ isOpen, onClose, companyId, onUpdated }) => {
  const [companyData, setCompanyData] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Status update
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmDescription, setConfirmDescription] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!isOpen || !companyId) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setIsLoadingDetail(true);
      setErrorMessage('');
      try {
        const response = await getCompanyDetailApi(companyId);
        const data = response?.data ?? response;
        if (cancelled) return;
        setCompanyData(data);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error.response?.data?.message || 'Không thể tải thông tin công ty.');
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    };

    fetchDetail();
    return () => { cancelled = true; };
  }, [isOpen, companyId]);

  const handleOpenConfirm = (status) => {
    setConfirmAction(status);
    setConfirmDescription('');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatus = async () => {
    if (!confirmAction) return;
    setIsUpdatingStatus(true);
    try {
      const response = await updateCompanyStatusApi(companyId, {
        status: confirmAction,
        description: confirmDescription,
      });
      toast.success(response?.message || 'Cập nhật trạng thái thành công!');
      setIsConfirmModalOpen(false);
      onClose();
      if (onUpdated) onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleClose = () => {
    setCompanyData(null);
    setErrorMessage('');
    setIsConfirmModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  const getLogoSrc = () => {
    const logoUrl = companyData?.logoUrl;
    if (logoUrl) {
      if (logoUrl.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const domainUrl = baseUrl.replace(/\/api\/?$/, '');
        return `${domainUrl}${logoUrl}`;
      }
      return logoUrl;
    }
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClose}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V17h4v4M12 3l9 4M12 3L3 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chi tiết công ty</h2>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              onClick={handleClose}
              aria-label="Đóng"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {isLoadingDetail && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-slate-500">Đang tải thông tin...</span>
            </div>
          )}

          {!isLoadingDetail && errorMessage && !companyData && (
            <div className="text-center py-12">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-100 text-red-500 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <p className="text-red-500">{errorMessage}</p>
            </div>
          )}

          {!isLoadingDetail && companyData && (
            <div className="space-y-6">
              {/* Logo Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {getLogoSrc() ? (
                    <img
                      src={getLogoSrc()}
                      alt="Logo"
                      className="w-40 h-40 rounded-2xl object-contain border-4 border-white shadow-lg ring-2 ring-indigo-100 bg-slate-50 p-2"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-2 ring-indigo-100">
                      {(companyData.companyName || 'C')[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Tên công ty</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.companyName || '--'}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Số điện thoại</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.phone || '--'}
                  </div>
                </div>

                {/* Address (full width) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600">Địa chỉ</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.address || '--'}
                  </div>
                </div>

                {/* Province Code */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Mã tỉnh/thành</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.provinceCode || '--'}
                  </div>
                </div>

                {/* District Code */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Mã quận/huyện</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.districtCode || '--'}
                  </div>
                </div>

                {/* Business License No */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Số GPKD</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.businessLicenseNo || '--'}
                  </div>
                </div>

                {/* Company Code - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Mã công ty</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.companyCode || '--'}
                  </div>
                </div>

                {/* Email - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Email</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.email || '--'}
                  </div>
                </div>

                {/* Description - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Mô tả</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.description || '--'}
                  </div>
                </div>

                {/* Tax Code - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Mã số thuế</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.taxCode || '--'}
                  </div>
                </div>

                {/* License Issued Date - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Ngày cấp phép</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {formatDateTime(companyData.licenseIssuedDate)}
                  </div>
                </div>

                {/* License Issued By - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Nơi cấp phép</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {companyData.licenseIssuedBy || '--'}
                  </div>
                </div>

                {/* Company Type - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Loại công ty</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {getCompanyTypeLabel(companyData.companyType)}
                  </div>
                </div>

                {/* Status - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Trạng thái</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm cursor-not-allowed">
                    {(() => {
                      const statusInfo = getStatusLabel(companyData.status);
                      return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Created At - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Ngày tạo</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {formatDateTime(companyData.createdAt)}
                  </div>
                </div>

                {/* Approved At - Read Only */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">Ngày duyệt</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed">
                    {formatDateTime(companyData.approvedAt)}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoadingDetail && companyData && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
              onClick={handleClose}
              disabled={isUpdatingStatus}
            >
              Đóng
            </button>
            {companyData.status === CompanyStatus.Pending && (
              <>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50 flex items-center shadow-sm"
                  onClick={() => handleOpenConfirm(CompanyStatus.Rejected)}
                  disabled={isUpdatingStatus}
                >
                  Từ chối
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  onClick={() => handleOpenConfirm(CompanyStatus.Approved)}
                  disabled={isUpdatingStatus}
                >
                  Duyệt
                </button>
              </>
            )}
            {companyData.status === CompanyStatus.Approved && (
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                onClick={() => handleOpenConfirm(CompanyStatus.Suspended)}
                disabled={isUpdatingStatus}
              >
                Tạm ngưng hoạt động
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal Overlay */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsConfirmModalOpen(false)}>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {confirmAction === CompanyStatus.Approved ? 'Xác nhận duyệt' : confirmAction === CompanyStatus.Suspended ? 'Xác nhận tạm ngưng' : 'Xác nhận từ chối'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Vui lòng nhập lý do/ghi chú định trạng thái này của công ty (có thể bỏ trống nếu duyệt).
            </p>
            <textarea
              className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none mb-6"
              placeholder="Nhập ghi chú hoặc lý do..."
              value={confirmDescription}
              onChange={(e) => setConfirmDescription(e.target.value)}
            />
            <div className="flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isUpdatingStatus}
              >
                Hủy
              </button>
              <button
                type="button"
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 ${confirmAction === CompanyStatus.Approved ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : confirmAction === CompanyStatus.Suspended ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'} shadow-lg`}
                onClick={handleConfirmStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {confirmAction === CompanyStatus.Approved ? 'Xác nhận duyệt' : confirmAction === CompanyStatus.Suspended ? 'Xác nhận tạm ngưng' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailModal;
