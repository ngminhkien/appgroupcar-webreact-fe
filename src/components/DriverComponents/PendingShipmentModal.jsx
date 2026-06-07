import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getPendingShipmentsApi,
  driverAcceptShipmentApi,
  driverCancelShipmentApi,
  getShipmentDetailApi
} from '@/services/offerService';
import UserDetailModal from '@/components/UserPublicLayout/UserDetailModal';
import ShipmentDetailModal from './ShipmentDetailModal';



// ─── Inline Confirm Modal ───────────────────────────────────────────────────
const ConfirmRejectModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Xác nhận từ chối</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Bạn có chắc muốn từ chối yêu cầu vận chuyển này?</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-black text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-sm shadow-rose-500/20"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};
// ───────────────────────────────────────────────────────────────────────────

const PendingShipmentModal = ({ offerId, onClose }) => {
  const [processingId, setProcessingId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [confirmReject, setConfirmReject] = useState({ open: false, bookingId: null });

  // Fetch pending shipment proposals using react-query
  const { data: rawBookings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pendingShipmentProposals', offerId],
    queryFn: async () => {
      const response = await getPendingShipmentsApi(offerId);
      return response?.data || response || [];
    },
  });

  // Fetch the offer details to get routePoints for location lookup
  const { data: offerDetail } = useQuery({
    queryKey: ['shipmentOfferDetailForPending', offerId],
    queryFn: async () => {
      const response = await getShipmentDetailApi(offerId);
      return response?.data || response;
    },
  });

  const routePoints = offerDetail?.routePoints || [];
  const bookingsList = Array.isArray(rawBookings) ? rawBookings : [];

  // Helper to format currency
  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}đ` : '0đ';
  };

  // Helper to format date-time
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

  // Handle Approve Shipment proposal
  const handleApprove = async (shipmentOfferId) => {
    setProcessingId(shipmentOfferId);
    try {
      await driverAcceptShipmentApi(shipmentOfferId, offerId);
      toast.success('Duyệt yêu cầu vận chuyển thành công!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt yêu cầu.');
    } finally {
      setProcessingId(null);
    }
  };

  // Open confirm modal before rejecting
  const openRejectConfirm = (bookingId) => {
    setConfirmReject({ open: true, bookingId });
  };

  // Handle Reject Shipment proposal (after confirmation)
  const handleRejectConfirmed = async () => {
    const shipmentOfferId = confirmReject.bookingId;
    setConfirmReject({ open: false, bookingId: null });
    setProcessingId(shipmentOfferId);
    try {
      await driverCancelShipmentApi(shipmentOfferId);
      toast.success('Từ chối yêu cầu vận chuyển thành công!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi từ chối yêu cầu.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between text-left">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Danh sách khách hàng
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Danh sách yêu cầu đang chờ tài xế duyệt cho mã chuyến #{offerId?.substring(0, 8).toUpperCase()}</p>
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-left">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-8 w-8 text-emerald-500 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Đang tải danh sách chờ...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-800 font-extrabold text-sm mb-1">Không thể tải danh sách yêu cầu vận chuyển</p>
              <p className="text-red-600 text-xs font-semibold">{error?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : bookingsList.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-500 font-bold text-sm">Không có yêu cầu nào đang chờ duyệt</p>
              <p className="text-slate-400 text-xs mt-0.5">Các yêu cầu gửi hàng của khách sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookingsList.map((booking) => {
                const isProcessing = processingId === booking.id;
                const shipmentRequest = booking.shipmentRequest || {};

                // Lookup start and end points in routePoints
                const startLocation = routePoints.find(pt => pt.locationId === shipmentRequest.pickupLocationId);
                const endLocation = routePoints.find(pt => pt.locationId === shipmentRequest.dropoffLocationId);
                const startPt = startLocation ? startLocation.locationName : 'Điểm nhận hàng';
                const endPt = endLocation ? endLocation.locationName : 'Điểm giao hàng';

                return (
                  <div
                    key={booking.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col md:flex-row gap-5 items-stretch"
                  >
                    {/* Customer Profile Column */}
                    <div
                      onClick={() => shipmentRequest.customerId && setSelectedUserId(shipmentRequest.customerId)}
                      className="flex items-center md:items-start gap-4 md:w-56 shrink-0 text-left border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4 cursor-pointer hover:bg-slate-50 rounded-2xl p-1 transition-all duration-200"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 font-black">
                        SR
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-800 truncate hover:text-slate-900">Khách gửi hàng</h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Mã KH: {shipmentRequest.customerId ? shipmentRequest.customerId.substring(0, 8).toUpperCase() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Shipment Details Column */}
                    <div className="flex-1 flex flex-col justify-between gap-3 text-left">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold block">Khối lượng:</span>
                          <strong className="text-slate-800 font-bold block mt-0.5">{shipmentRequest.weight} kg</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Thể tích:</span>
                          <strong className="text-slate-800 font-bold block mt-0.5">{shipmentRequest.volume} m³</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Giá đề xuất:</span>
                          <strong className="text-emerald-600 font-black block mt-0.5">{formatPrice(booking.proposedPrice)}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Ngày giao hàng:</span>
                          <strong className="text-slate-700 font-bold block mt-0.5">{formatDateTime(shipmentRequest.deliveryDate)}</strong>
                        </div>
                      </div>

                      {/* Pickup & Dropoff location names */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs mt-2">
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-800 font-bold">{startPt}</span>
                          <span>➔</span>
                          <span className="text-slate-800 font-bold">{endPt}</span>
                        </div>
                      </div>

                      {/* Description & Handling Note */}
                      {(shipmentRequest.description || shipmentRequest.handlingNote) && (
                        <div className="border-t border-slate-100 pt-2 mt-2 space-y-1 text-xs">
                          {shipmentRequest.description && (
                            <div className="text-slate-600 font-semibold">
                              <span className="text-slate-400">Mô tả:</span> {shipmentRequest.description}
                            </div>
                          )}
                          {shipmentRequest.handlingNote && (
                            <div className="text-slate-600 font-semibold">
                              <span className="text-slate-400">Ghi chú:</span> {shipmentRequest.handlingNote}
                            </div>
                          )}
                          {shipmentRequest.isFragile !== undefined && (
                            <div className="text-slate-600 font-semibold">
                              <span className="text-slate-400">Hàng dễ vỡ:</span> {shipmentRequest.isFragile ? <span className="text-rose-600 font-extrabold">Có</span> : 'Không'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="flex md:flex-col justify-end items-center md:items-end gap-2.5 md:w-32 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                      {booking.status === 1 ? (
                        <>
                          {/* Confirm Button */}
                          <button
                            onClick={() => handleApprove(booking.id)}
                            disabled={isProcessing || processingId !== null}
                            className="flex-1 md:flex-initial w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer shadow-sm hover:shadow-emerald-600/10 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <svg className="animate-spin h-4.5 w-4.5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            ) : (
                              'Duyệt'
                            )}
                          </button>

                          {/* Cancel/Reject Button */}
                          <button
                            onClick={() => openRejectConfirm(booking.id)}
                            disabled={isProcessing || processingId !== null}
                            className="flex-1 md:flex-initial w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer border border-rose-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Từ chối
                          </button>
                        </>
                      ) : booking.status === 2 ? (
                        <div className="flex flex-col gap-2 w-full">
                          <span className="px-3 py-1.5 rounded-xl text-xs font-black border bg-emerald-50 text-emerald-700 border-emerald-200 w-full text-center">
                            Đã duyệt
                          </span>
                          <button
                            onClick={() => setSelectedShipmentId(booking.id)}
                            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-2 px-3 rounded-xl cursor-pointer transition-colors"
                          >
                            Chi tiết đơn hàng
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-black border bg-rose-50 text-rose-700 border-rose-200 w-full text-center">
                          Đã từ chối
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {/* Shipment Detail Modal */}
      {selectedShipmentId && (
        <ShipmentDetailModal
          shipmentId={selectedShipmentId}
          onClose={() => setSelectedShipmentId(null)}
        />
      )}

      {/* ─── Confirm Reject Modal ─── */}
      <ConfirmRejectModal
        isOpen={confirmReject.open}
        onConfirm={handleRejectConfirmed}
        onCancel={() => setConfirmReject({ open: false, bookingId: null })}
      />
    </div>
  );
};

export default PendingShipmentModal;
