import React, { useEffect, useState, useRef } from 'react';
import { getCompanyDetailApi, updateCompanyApi } from '@/services/companyService';
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
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Editable fields
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [businessLicenseNo, setBusinessLicenseNo] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const fileInputRef = useRef(null);

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
        setCompanyName(data.companyName || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setProvinceCode(data.provinceCode || '');
        setDistrictCode(data.districtCode || '');
        setBusinessLicenseNo(data.businessLicenseNo || '');
        setLogoPreview(data.logoUrl || null);
        setLogoFile(null);
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

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('CompanyName', companyName);
      formData.append('Phone', phone);
      formData.append('Address', address);
      formData.append('ProvinceCode', provinceCode);
      formData.append('DistrictCode', districtCode);
      formData.append('BusinessLicenseNo', businessLicenseNo);
      if (logoFile) {
        formData.append('Logo', logoFile);
      }
      const response = await updateCompanyApi(companyId, formData);
      toast.success(response?.message || 'Cập nhật thành công!');
      if (onUpdated) onUpdated();
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.';
      toast.error(msg);
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setCompanyData(null);
    setErrorMessage('');
    setLogoFile(null);
    setLogoPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  const getLogoSrc = () => {
    if (logoPreview && logoPreview.startsWith('data:')) return logoPreview;
    if (logoPreview) {
      if (logoPreview.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const domainUrl = baseUrl.replace(/\/api\/?$/, '');
        return `${domainUrl}${logoPreview}`;
      }
      return logoPreview;
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
                <div className="relative group">
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
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    onClick={() => fileInputRef.current?.click()}
                    title="Thay đổi logo"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
                {logoFile && (
                  <span className="mt-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                    Logo mới đã chọn: {logoFile.name}
                  </span>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Tên công ty
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập tên công ty"
                  />
                </div>

                {/* Phone - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Số điện thoại
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Address - Editable (full width) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Địa chỉ
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                {/* Province Code - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Mã tỉnh/thành
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={provinceCode}
                    onChange={(e) => setProvinceCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập mã tỉnh/thành"
                  />
                </div>

                {/* District Code - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Mã quận/huyện
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={districtCode}
                    onChange={(e) => setDistrictCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập mã quận/huyện"
                  />
                </div>

                {/* Business License No - Editable */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Số GPKD
                    <span className="ml-1 text-xs text-indigo-500 font-normal">(có thể sửa)</span>
                  </label>
                  <input
                    type="text"
                    value={businessLicenseNo}
                    onChange={(e) => setBusinessLicenseNo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Nhập số GPKD"
                  />
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
              disabled={isSaving}
            >
              Đóng
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailModal;
