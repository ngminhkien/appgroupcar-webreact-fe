import React from 'react';
import { BusBookingStatus } from '@/types/enums';

const BusBookingDetailModal = ({ isOpen, onClose, bookingDetails, isLoading, error }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}đ` : '0đ';
  };

  const getStatusLabel = (status) => {
    const statusVal = typeof status === 'number' ? status : parseInt(status, 10);
    switch (statusVal) {
      case BusBookingStatus.Cash:
        return { text: 'Thanh toán tiền mặt', class: 'bg-amber-50 text-amber-700 border-amber-200' };
      case BusBookingStatus.Paid:
        return { text: 'Đã thanh toán', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case BusBookingStatus.Cancelled:
        return { text: 'Đã hủy', class: 'bg-rose-50 text-rose-700 border-rose-200' };
      case BusBookingStatus.Expired:
        return { text: 'Đã hết hạn', class: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { text: 'Không xác định', class: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const statusInfo = bookingDetails ? getStatusLabel(bookingDetails.status) : { text: '', class: '' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Chi tiết vé xe khách
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
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Đang tải chi tiết vé...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-rose-600 font-bold mb-1">Không thể tải thông tin vé</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          ) : bookingDetails ? (
            <div className="flex flex-col gap-5">
              {/* Route Summary */}
              <div className="bg-[#dff0e1] border border-emerald-100 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Hành trình</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${statusInfo.class}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-base font-extrabold text-slate-900">
                    {bookingDetails.startPoint?.locationName || 'Điểm xuất phát'}
                  </span>
                  <span className="text-slate-400 select-none">➔</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {bookingDetails.endPoint?.locationName || 'Điểm kết thúc'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Khởi hành: {bookingDetails.departureDate} • {bookingDetails.departureTime?.substring(0, 5)}
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Mã đặt vé</span>
                  <span className="text-sm font-extrabold text-slate-800 break-all select-all">
                    {bookingDetails.bookingId}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Số lượng ghế</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {bookingDetails.seatCount} ghế
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Tổng thanh toán</span>
                  <span className="text-base font-black text-emerald-600">
                    {formatPrice(bookingDetails.totalPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Mã chuyến đi (Showtime)</span>
                  <span className="text-xs font-bold text-slate-500 break-all">
                    {bookingDetails.showtimeId}
                  </span>
                </div>
              </div>

              {/* Seats Info */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Danh sách ghế đặt</span>
                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                  {bookingDetails.seats && bookingDetails.seats.length > 0 ? (
                    bookingDetails.seats.map((seat, index) => (
                      <div key={seat.seatId || index} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-slate-800">Ghế số: {seat.seatNumber}</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 break-all select-all">
                            Mã vé: {seat.ticketCode}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            seat.isCheckedIn 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {seat.isCheckedIn ? 'Đã lên xe' : 'Chưa lên xe'}
                          </span>
                          {seat.checkedInAt && (
                            <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                              {new Date(seat.checkedInAt).toLocaleString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic">Chưa có thông tin số ghế</span>
                  )}
                </div>
              </div>
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

export default BusBookingDetailModal;
