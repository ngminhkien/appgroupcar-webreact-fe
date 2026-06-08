import React from 'react';
import { ShipmentStatus, PaymentStatus } from '@/types/enums';

const ShipmentBookingDetailModal = ({ isOpen, onClose, booking, details, isLoading, error }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}đ` : '0đ';
  };

  const getShipmentStatusLabel = (status) => {
    switch (status) {
      case ShipmentStatus.Created:
        return { text: 'Chờ tài xế lấy hàng', class: 'bg-amber-50 text-amber-700 border-amber-200' };
      case ShipmentStatus.InTransit:
        return { text: 'Đang giao hàng', class: 'bg-blue-50 text-blue-700 border-blue-200' };
      case ShipmentStatus.Delivered:
        return { text: 'Đã giao hàng', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case ShipmentStatus.Cancelled:
        return { text: 'Đã hủy', class: 'bg-rose-50 text-rose-700 border-rose-200' };
      case ShipmentStatus.Return:
        return { text: 'Trả lại hàng', class: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { text: 'Đang xử lý', class: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case PaymentStatus.Unpaid:
        return { text: 'Chờ thanh toán', class: 'text-amber-600 font-bold' };
      case PaymentStatus.Paid:
        return { text: 'Đã thanh toán', class: 'text-emerald-600 font-bold' };
      case PaymentStatus.Refunded:
        return { text: 'Đã hoàn tiền', class: 'text-slate-500 italic' };
      default:
        return { text: 'Chưa thanh toán', class: 'text-slate-500' };
    }
  };

  const request = details?.shipmentRequest;
  const shipment = details?.shipment;
  const offer = details?.shipmentOffer;
  const driver = details?.driver;
  const vehicle = details?.vehicle;

  const statusVal = shipment?.shipmentStatus ?? booking?.shipmentStatus;
  const paymentVal = shipment?.paymentStatus ?? booking?.paymentStatus;

  const statusInfo = getShipmentStatusLabel(statusVal);
  const paymentInfo = getPaymentStatusLabel(paymentVal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Chi tiết gửi hàng
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 text-left">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Đang tải chi tiết đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-rose-600 font-bold mb-1">Không thể tải thông tin gửi hàng</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          ) : details ? (
            <div className="flex flex-col gap-5">
              {/* Route Summary */}
              <div className="bg-lime-50/50 border border-lime-100 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-lime-800 tracking-wider">Lộ trình vận chuyển</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${statusInfo.class}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-base font-extrabold text-slate-900">
                    {booking?.from || 'Điểm gửi'}
                  </span>
                  <span className="text-slate-400 select-none">➔</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {booking?.to || 'Điểm nhận'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Ngày giao dự kiến: {booking?.date} {booking?.timeWindow && booking.timeWindow !== '--' ? `• ${booking.timeWindow}` : ''}
                </div>
              </div>

              {/* Status and Payment Row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/40">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Thanh toán</span>
                  <span className="text-sm font-semibold">{paymentInfo.text}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Chi phí vận chuyển</span>
                  <span className="text-base font-black text-lime-600">
                    {formatPrice(offer?.proposedPrice ?? booking?.budget)}
                  </span>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="flex flex-col gap-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Thông tin hàng hóa</span>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm font-medium">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">Loại hàng / Mô tả</span>
                    <span className="text-slate-800 font-semibold">{request?.description || booking?.cargoType || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">Trọng lượng</span>
                    <span className="text-slate-800 font-semibold">{request?.weight ? `${request.weight} kg` : (booking?.weight || '--')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">Thể tích</span>
                    <span className="text-slate-800 font-semibold">{request?.volume ? `${request.volume} m³` : (booking?.volume || '--')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">Hàng dễ vỡ</span>
                    <span className={request?.isFragile ? 'text-amber-600 font-bold' : 'text-slate-800 font-semibold'}>
                      {request?.isFragile ? 'Có (Cần lưu ý)' : 'Không'}
                    </span>
                  </div>
                </div>
                {request?.handlingNote && (
                  <div className="mt-2 text-xs bg-amber-50 text-amber-800 border border-amber-100 p-2.5 rounded-xl">
                    <strong>Ghi chú bốc xếp: </strong>{request.handlingNote}
                  </div>
                )}
              </div>

              {/* Driver & Vehicle Info */}
              {(driver || vehicle) && (
                <div className="flex flex-col gap-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Tài xế & Phương tiện</span>

                  {driver && (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/50 p-3 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-lime-500 text-white font-black text-base flex items-center justify-center shrink-0">
                        {driver.name ? driver.name.charAt(0).toUpperCase() : 'TX'}
                      </div>
                      <div className="flex-1 text-sm text-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-800">{driver.name || 'Tài xế'}</span>
                          {driver.driverRatingAverage != null && (
                            <span className="text-xs text-amber-500 font-bold">
                              ★ {driver.driverRatingAverage.toFixed(1)} <span className="text-slate-400 font-semibold">({driver.driverRatingCount || 0})</span>
                            </span>
                          )}
                        </div>
                        {/* <div className="text-xs text-slate-500 font-bold mt-0.5">
                          Bằng lái: {driver.licenseClass || '--'} • SĐT/Mã số: {driver.licenseNumber || '--'}
                        </div> */}
                      </div>
                    </div>
                  )}

                  {vehicle && (
                    <div className="flex gap-4 bg-slate-50 border border-slate-200/50 p-3 rounded-2xl items-center">
                      {vehicle.urlImage && (
                        <img
                          src={vehicle.urlImage}
                          alt={vehicle.brand}
                          className="w-16 h-12 rounded-xl object-cover border border-slate-200/60 shrink-0 bg-white"
                        />
                      )}
                      <div className="flex-1 text-sm text-slate-700">
                        <div className="flex justify-between items-center flex-wrap gap-1">
                          <span className="font-extrabold text-slate-800">{vehicle.brand || 'Hyundai'}</span>
                          <span className="bg-slate-200 text-slate-800 text-xs font-black px-2 py-0.5 rounded-lg border border-slate-300">
                            {vehicle.plateNumber}
                          </span>
                        </div>
                        {/* <div className="text-xs text-slate-500 font-bold mt-1">
                          Sức chứa: {vehicle.seatCapacity ? `${vehicle.seatCapacity} chỗ` : '--'}
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Driver & Offer Details */}
              {/* <div className="flex flex-col gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Thông tin tài xế & Đơn hàng</span>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-500">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Mã Shipment</span>
                    <span className="break-all select-all font-bold text-slate-700">{shipment?.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Mã Yêu cầu (Request)</span>
                    <span className="break-all select-all font-bold text-slate-700">{offer?.requestId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">ID Tài xế</span>
                    <span className="break-all select-all font-bold text-slate-700">{offer?.driverId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">ID Phương tiện</span>
                    <span className="break-all select-all font-bold text-slate-700">{offer?.vehicleId}</span>
                  </div>
                </div>
              </div> */}
            </div>
          ) : (
            <div className="text-center text-slate-500 italic py-6">Không có dữ liệu hiển thị</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBookingDetailModal;
