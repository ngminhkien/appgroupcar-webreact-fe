import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getPendingBookingsApi, confirmBookingApi, cancelBookingApi } from '@/services/offerService';

// ─── Inline Confirm Modal ───────────────────────────────────────────────────
const ConfirmRejectModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Xác nhận từ chối</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Bạn có chắc muốn từ chối yêu cầu đặt chuyến này?</p>
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

const PendingBookingModal = ({ offerId, onClose }) => {
  const [processingId, setProcessingId] = useState(null);
  const [confirmReject, setConfirmReject] = useState({ open: false, bookingId: null });

  // Fetch pending bookings using react-query
  const { data: rawBookings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pendingBookings', offerId],
    queryFn: async () => {
      const response = await getPendingBookingsApi(offerId);
      return response?.data || response || [];
    },
  });

  const bookingsList = Array.isArray(rawBookings) ? rawBookings : [];

  // Helper to format currency
  const formatPrice = (price) => {
    return `${price?.toLocaleString()}đ`;
  };

  // Helper for customer avatar URL
  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  };

  // Handle Approve Booking
  const handleApprove = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await confirmBookingApi(bookingId);
      toast.success('Duyệt yêu cầu đặt chuyến thành công!');
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

  // Handle Reject Booking (after confirmation)
  const handleRejectConfirmed = async () => {
    const bookingId = confirmReject.bookingId;
    setConfirmReject({ open: false, bookingId: null });
    setProcessingId(bookingId);
    try {
      await cancelBookingApi(bookingId);
      toast.success('Từ chối yêu cầu đặt chuyến thành công!');
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
              Duyệt yêu cầu đặt chuyến
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Danh sách hành khách đang chờ tài xế duyệt cho mã chuyến #{offerId?.substring(0, 8).toUpperCase()}</p>
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
              <p className="text-red-800 font-extrabold text-sm mb-1">Không thể tải danh sách đặt chuyến</p>
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
              <p className="text-slate-400 text-xs mt-0.5">Các yêu cầu đặt chỗ của khách sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookingsList.map((booking) => {
                const customer = booking.customer || {};
                const isProcessing = processingId === booking.bookingId;
                
                // Extract points
                const startPt = booking.routePoints?.find(pt => pt.stopType === 'Start')?.locationName;
                const endPt = booking.routePoints?.find(pt => pt.stopType === 'End')?.locationName;

                return (
                  <div 
                    key={booking.bookingId} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col md:flex-row gap-5 items-stretch"
                  >
                    {/* Customer Profile Column */}
                    <div className="flex items-center md:items-start gap-4 md:w-56 shrink-0 text-left border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                      <img 
                        src={getAvatarUrl(customer.avatarUrl)} 
                        alt={customer.fullName || 'Khách hàng'}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-800 truncate">{customer.fullName || 'Ẩn danh'}</h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{customer.email || 'Không có email'}</p>
                        {customer.phoneNumber && (
                          <a 
                            href={`tel:${customer.phoneNumber}`} 
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-bold mt-1.5 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.099.281l-.675.675a10.024 10.024 0 003.81 3.81l.675-.675a1 1 0 01.24-.1c.325.077.671.077.997.098l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {customer.phoneNumber}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Column */}
                    <div className="flex-1 flex flex-col justify-between gap-3 text-left">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold">Số lượng:</span>
                          <strong className="text-slate-800 font-bold block mt-0.5">{booking.quantity} người/kiện</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold">Thành tiền:</span>
                          <strong className="text-emerald-600 font-black block mt-0.5">{formatPrice(booking.totalPrice)}</strong>
                        </div>
                      </div>

                      {/* Render Route details */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5">
                        {/* Overall Booking Route */}
                        {(startPt || endPt) && (
                          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span className="text-slate-800 font-bold">{startPt || 'Điểm đi'}</span>
                            <span>➔</span>
                            <span className="text-slate-800 font-bold">{endPt || 'Điểm đến'}</span>
                          </div>
                        )}

                        {/* Cargo items if present */}
                        {booking.items && booking.items.length > 0 && (
                          <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-slate-200/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hành trình chi tiết:</span>
                            {booking.items.map((item, idx) => (
                              <div key={item.itemId || idx} className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                                <span className="truncate max-w-[200px]">
                                  {item.pickupLocation?.locationName || 'Trạm đi'} ➔ {item.dropoffLocation?.locationName || 'Trạm đến'}
                                </span>
                                <span className="text-emerald-600 font-bold">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex md:flex-col justify-end items-end gap-2.5 md:w-32 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                      {/* Confirm Button */}
                      <button
                        onClick={() => handleApprove(booking.bookingId)}
                        disabled={isProcessing || processingId !== null}
                        className="flex-1 md:flex-initial w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer shadow-sm hover:shadow-emerald-600/10 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing && processingId === booking.bookingId ? (
                          <svg className="animate-spin h-4.5 w-4.5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          'Duyệt'
                        )}
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => openRejectConfirm(booking.bookingId)}
                        disabled={isProcessing || processingId !== null}
                        className="flex-1 md:flex-initial w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer border border-rose-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Từ chối
                      </button>
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

      {/* ─── Confirm Reject Modal ─── */}
      <ConfirmRejectModal
        isOpen={confirmReject.open}
        onConfirm={handleRejectConfirmed}
        onCancel={() => setConfirmReject({ open: false, bookingId: null })}
      />
    </div>
  );
};

export default PendingBookingModal;
