import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getSharedRideDetailApi,
  getShipmentDetailApi,
  cancelOfferApi,
  completeOfferApi
} from '@/services/offerService';
import logoGroupCar from '@/assets/logoGroupCar.png';
import { ServiceType, OfferStatus } from '@/types/enums';

const TripDetailModal = ({ id, serviceType, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [processingId, setProcessingId] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const handleCompleteOffer = async () => {
    setProcessingAction(true);
    try {
      await completeOfferApi(id);
      toast.success('Cập nhật hoàn thành chuyến đi thành công!');
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });
      queryClient.invalidateQueries({ queryKey: ['sharedRideDetail', id] });
      setShowCompleteConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi hoàn thành chuyến.');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCancelOffer = async () => {
    setProcessingAction(true);
    try {
      await cancelOfferApi(id);
      toast.success('Hủy chuyến đi thành công!');
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });
      queryClient.invalidateQueries({ queryKey: ['sharedRideDetail', id] });
      setShowCancelConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi hủy chuyến.');
    } finally {
      setProcessingAction(false);
    }
  };

  // Fetch details (either shared-ride or shipment)
  const { data: rawDetail, isLoading: isLoadingDetail, error: detailError, refetch: refetchDetail } = useQuery({
    queryKey: ['sharedRideDetail', id, serviceType],
    queryFn: async () => {
      const response = serviceType === ServiceType.Truck
        ? await getShipmentDetailApi(id)
        : await getSharedRideDetailApi(id);
      return response?.data || response;
    },
    staleTime: 30 * 1000,
  });

  const detail = rawDetail || {};
  const driver = detail.driver || {};
  const vehicle = detail.vehicle || {};
  const sharedRideDetail = detail.sharedRideDetail || {};
  const routePoints = detail.routePoints || [];

  // Format price helper
  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}đ` : '0đ';
  };

  // Format date helper: "2026-06-05T06:39:00" -> "06:39 • 05/06/2026"
  const formatDateTime = (isoString) => {
    if (!isoString) return '--:-- • --/--/----';
    try {
      const date = new Date(isoString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} • ${day}/${month}/${year}`;
    } catch (e) {
      return isoString;
    }
  };

  // Format duration helper: 60 -> "1 giờ"
  const formatDuration = (minutes) => {
    if (!minutes) return 'Chưa xác định';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) {
      return `${hrs} giờ ${mins} phút`;
    } else if (hrs > 0) {
      return `${hrs} giờ`;
    }
    return `${mins} phút`;
  };

  // Resolve service type info
  const getServiceTypeInfo = (type) => {
    switch (type) {
      case ServiceType.Shared:
        return {
          label: 'Xe ghép / Đi chung',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case ServiceType.Contract:
        return {
          label: 'Bao xe / Hợp đồng',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case ServiceType.Truck:
        return {
          label: 'Xe tải vận chuyển',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      default:
        return {
          label: 'Dịch vụ khác',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  // Resolve status info
  const getStatusInfo = (stat) => {
    switch (stat) {
      case OfferStatus.Active:
        return {
          label: 'Đang hoạt động',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100',
        };
      case OfferStatus.Paused:
        return {
          label: 'Tạm dừng',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100',
        };
      case OfferStatus.Closed:
        return {
          label: 'Đã đóng',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100',
        };
      case OfferStatus.Complete:
        return {
          label: 'Hoàn thành',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-100',
        };
      default:
        return {
          label: 'Không xác định',
          badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
        };
    }
  };

  // Full Image Url resolver
  const getFullImageUrl = (img) => {
    if (!img || img === 'string' || img === '') return logoGroupCar;
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5039';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = img.startsWith('/') ? img : `/${img}`;
    return `${baseUrl}${formattedUrl}`;
  };

  // Sort route points by sequence
  const sortedPoints = useMemo(() => {
    if (!routePoints) return [];
    return [...routePoints].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  }, [routePoints]);

  // Determine start & end locations dynamically from route points
  const startPointName = useMemo(() => {
    const start = sortedPoints[0];
    return start ? start.locationName : 'Chưa rõ';
  }, [sortedPoints]);

  const endPointName = useMemo(() => {
    const end = sortedPoints[sortedPoints.length - 1];
    return end ? end.locationName : 'Chưa rõ';
  }, [sortedPoints]);

  const serviceInfo = getServiceTypeInfo(detail.serviceType);
  const statusInfo = getStatusInfo(detail.status);



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 text-left">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Chi tiết chuyến đi
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Mã chuyến: #{id?.substring(0, 8).toUpperCase()} • Quản lý bởi tài xế
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 border-b border-slate-100 flex gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-1.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`py-3 px-1.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${activeTab === 'route'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            Lộ trình & Điểm dừng ({sortedPoints.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoadingDetail ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-emerald-500 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-400 font-extrabold text-xs uppercase tracking-wider">Đang tải chi tiết chuyến đi...</span>
            </div>
          ) : detailError ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-red-800 font-extrabold text-sm mb-1">Đã xảy ra lỗi khi tải dữ liệu</h3>
              <p className="text-red-600 text-xs font-semibold">{detailError?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}</p>
              <button
                onClick={() => refetchDetail()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all shadow-sm"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Trip, Driver & Vehicle Info */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Route Details Card */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Hành trình chính</h3>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Hành trình</span>
                        <span className="text-sm font-extrabold text-slate-800 mt-1">
                          {sortedPoints.map(pt => pt.locationName || pt.name).join(' ➔ ') || 'Chưa rõ'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-slate-200">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase">Giờ xuất phát</span>
                          <span className="block text-xs font-bold text-slate-700 mt-1">{formatDateTime(detail.departureTime)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase">Dự kiến di chuyển</span>
                          <span className="block text-xs font-bold text-slate-700 mt-1">{formatDuration(detail.estimatedDurationMinutes)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info Card */}
                    {vehicle.vehicleId && (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-40 h-28 bg-white border border-slate-100 rounded-2xl overflow-hidden shrink-0">
                          <img
                            src={getFullImageUrl(vehicle.urlImage)}
                            alt={vehicle.brand || 'Phương tiện'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = logoGroupCar; }}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Thông tin phương tiện</h3>
                          <h4 className="text-base font-extrabold text-slate-800">
                            {vehicle.brand || 'Tên phương tiện'}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                            <span className="bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                              Biển kiểm soát: {vehicle.plateNumber || 'Chưa có BKS'}
                            </span>
                            <span className="bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                              Sức chứa: {vehicle.seatCapacity || 0} chỗ
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Driver Info Card */}
                    {driver.driverId && (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col sm:flex-row gap-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-white">
                          <img
                            src={driver.avatarUrl ? getFullImageUrl(driver.avatarUrl) : logoGroupCar}
                            alt={driver.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = logoGroupCar; }}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Tài xế chuyến đi</h3>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-800">{driver.name}</h4>
                            {driver.licenseClass && (
                              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-slate-300">
                                Bằng {driver.licenseClass}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 flex-wrap">
                            <span>SĐT: <strong className="text-slate-800">{driver.phoneNumber || 'Chưa cập nhật'}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              Đánh giá: <strong className="text-slate-800">{driver.ratingAverage || 5}★</strong> ({driver.ratingCount || 0} lượt)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Pricing, Seats & Status Summary */}
                  <div className="space-y-6">
                    {/* Status & Service Badges */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Dịch vụ</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${serviceInfo.badgeClass}`}>
                          {serviceInfo.label}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Trạng thái chuyến</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusInfo.badgeClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Seat or Cargo availability card */}
                    {serviceType === ServiceType.Truck ? (
                      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 space-y-3">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">Trọng tải & Thể tích tối đa</span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white border border-blue-100 rounded-2xl p-2.5">
                            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Trọng tải</span>
                            <span className="text-sm font-black text-slate-800">
                              {(detail.cargoDetail?.maxWeight || detail.cargo?.maxWeight || detail.shipmentDetail?.maxWeight || detail.maxWeight || 0).toLocaleString()} kg
                            </span>
                          </div>
                          <div className="bg-white border border-blue-100 rounded-2xl p-2.5">
                            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Thể tích</span>
                            <span className="text-sm font-black text-emerald-600">
                              {detail.cargoDetail?.maxVolume || detail.cargo?.maxVolume || detail.shipmentDetail?.maxVolume || detail.maxVolume || 0} m³
                            </span>
                          </div>
                        </div>
                        {(detail.cargoDetail?.acceptFragile || detail.cargo?.acceptFragile || detail.shipmentDetail?.acceptFragile || detail.acceptFragile) && (
                          <div className="text-[10px] font-bold text-slate-600 bg-white/60 border border-slate-200/50 rounded-lg p-2 text-center">
                            ✓ Nhận vận chuyển hàng dễ vỡ
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 space-y-3">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">Trạng thái chỗ ngồi</span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white border border-blue-100 rounded-2xl p-2.5">
                            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Tổng ghế</span>
                            <span className="text-lg font-black text-slate-800">{sharedRideDetail.totalSeats ?? 0}</span>
                          </div>
                          <div className="bg-white border border-blue-100 rounded-2xl p-2.5">
                            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Còn trống</span>
                            <span className="text-lg font-black text-emerald-600">{sharedRideDetail.availableSeats ?? 0}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pricing details */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-1">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Giá cơ bản / Khách</span>
                      <div className="text-2xl font-black text-emerald-600">{formatPrice(detail.basePrice)}</div>
                      <p className="text-[10px] font-bold text-emerald-500 leading-normal pt-1">
                        * Giá cơ bản thiết lập cho hành trình Hà Nội - Sơn La hoặc ngược lại.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ROUTE POINTS */}
              {activeTab === 'route' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-xs font-medium leading-relaxed text-slate-600">
                    Lộ trình hiển thị danh sách các trạm và điểm đón/trả dọc đường của chuyến đi theo thứ tự di chuyển.
                  </div>

                  {sortedPoints.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-3xl text-slate-400 text-sm font-semibold">
                      Chưa cấu hình các điểm dừng chi tiết cho chuyến đi này.
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider border-b border-slate-200">
                              <th className="py-3.5 px-4 w-12">Thứ tự</th>
                              <th className="py-3.5 px-4">Tên trạm / Điểm dừng</th>

                              <th className="py-3.5 px-4 w-28">Loại điểm</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                            {sortedPoints.map((pt, index) => {
                              let typeBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                              let typeLabel = 'Điểm dừng';

                              if (pt.stopType === 1 || pt.stopType === 'Start') {
                                typeBadge = 'bg-blue-100 text-blue-800 border-blue-200';
                                typeLabel = 'Khởi hành';
                              } else if (pt.stopType === 5 || pt.stopType === 'End') {
                                typeBadge = 'bg-purple-100 text-purple-800 border-purple-200';
                                typeLabel = 'Kết thúc';
                              } else if (pt.stopType === 2 || pt.stopType === 'Pickup') {
                                typeBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                                typeLabel = 'Điểm đón';
                              } else if (pt.stopType === 4 || pt.stopType === 'Dropoff') {
                                typeBadge = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                                typeLabel = 'Điểm trả';
                              } else if (pt.stopType === 3 || pt.stopType === 'Hub') {
                                typeBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                                typeLabel = 'Trung chuyển';
                              }

                              const showAddress = pt.address && pt.address !== 'string' ? pt.address : '--';

                              return (
                                <tr key={pt.routePointId || pt.id || index} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-4 text-slate-400 font-extrabold">{pt.sequence ?? (index + 1)}</td>
                                  <td className="py-3.5 px-4 text-slate-800">{pt.locationName || pt.name}</td>
                                  <td className="py-3.5 px-4">
                                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase border ${typeBadge}`}>
                                      {typeLabel}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}



            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2">
            {detail.status === OfferStatus.Active && (
              <>
                <button
                  onClick={() => setShowCompleteConfirm(true)}
                  disabled={processingAction}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Hoàn thành chuyến
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={processingAction}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Hủy chuyến
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Confirmation Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={() => setShowCancelConfirm(false)}
          />
          {/* Confirmation Dialog Box */}
          <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in-95 duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Xác nhận hủy chuyến đi</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Bạn có chắc chắn muốn hủy chuyến đi này không? Hành động này không thể hoàn tác và hành khách đặt chỗ sẽ được thông báo.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={processingAction}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleCancelOffer}
                disabled={processingAction}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {processingAction ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Confirmation Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={() => setShowCompleteConfirm(false)}
          />
          {/* Confirmation Dialog Box */}
          <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in-95 duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Xác nhận hoàn thành chuyến đi</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Bạn có chắc chắn muốn hoàn thành chuyến đi này không? Hành động này sẽ thay đổi trạng thái chuyến đi thành Hoàn thành.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                disabled={processingAction}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleCompleteOffer}
                disabled={processingAction}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {processingAction ? 'Đang cập nhật...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TripDetailModal;
