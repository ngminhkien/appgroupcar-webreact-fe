import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getBusShowtimeByIdApi } from '@/services/busShowtimeService';
import { getShowtimeSeatMapApi } from '@/services/showtimeService';
import { BusShowtimeStatus } from '@/types/enums';

// Steering wheel icon
const SteeringWheelIcon = ({ className = '' }) => (
  <svg className={`${className} text-slate-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
  </svg>
);

// Custom Seat SVG representation
const SeatIcon = ({ className = '', isBlocked = false }) => {
  if (isBlocked) {
    return (
      <svg className={`${className} w-8 h-8 text-slate-300`} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3.5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  let strokeColor = '#3B82F6'; // Blue
  let fillColor = '#EFF6FF';   // Light blue

  return (
    <svg className={`${className} w-8 h-8`} viewBox="0 0 24 24" strokeWidth="2" stroke={strokeColor} fill="none">
      <rect x="5" y="4" width="14" height="14" rx="2.5" fill={fillColor} />
      <rect x="3" y="10" width="2" height="7" rx="0.5" fill={fillColor} />
      <rect x="19" y="10" width="2" height="7" rx="0.5" fill={fillColor} />
      <rect x="6" y="12" width="12" height="5" rx="1" fill={fillColor} />
    </svg>
  );
};

const BusShowtimeDetailModal = ({ isOpen, onClose, showtime }) => {
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'seatMap'

  // Seat map states
  const [seatLayout, setSeatLayout] = useState([]);
  const [layoutRows, setLayoutRows] = useState(8);
  const [layoutCols, setLayoutCols] = useState(5);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [seatsError, setSeatsError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('info');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !showtime?.id) return;

    let cancelled = false;
    const fetchDetailAndSeatMap = async () => {
      setIsLoading(true);
      setIsLoadingSeats(true);
      setSeatsError(null);
      try {
        const [detailRes, seatMapRes] = await Promise.all([
          getBusShowtimeByIdApi(showtime.id),
          getShowtimeSeatMapApi(showtime.id).catch(err => {
            console.error("Error fetching seat map:", err);
            return null;
          })
        ]);

        if (cancelled) return;

        // Process details
        const data = detailRes?.data ?? detailRes;
        const item = Array.isArray(data?.items) ? data.items[0] : data;
        setDetailData(item);

        // Process seat map
        if (seatMapRes) {
          const seatData = seatMapRes?.data ?? seatMapRes;
          const seatLayoutData = seatData?.seatLayout;
          const layoutJson = seatLayoutData?.layoutJson;
          const layoutSeats = Array.isArray(layoutJson?.seats) ? layoutJson.seats : [];
          const dynamicSeats = Array.isArray(seatData?.seats) ? seatData.seats : [];

          const maxRows = typeof layoutJson?.rows === 'number' ? layoutJson.rows : 8;
          const maxCols = typeof layoutJson?.cols === 'number' ? layoutJson.cols : 5;

          const statusMap = {};
          dynamicSeats.forEach(ds => {
            if (ds.seatNumber) {
              statusMap[ds.seatNumber] = ds.status;
            }
          });

          setLayoutRows(maxRows);
          setLayoutCols(maxCols);

          let mappedSeats = [];
          if (layoutSeats.length > 0) {
            mappedSeats = layoutSeats.map((seat) => {
              const seatNumber = seat.seatNumber;
              const status = statusMap[seatNumber] || 'Available';
              const isBlocked = seat.type === 'driver' || status !== 'Available';

              let type = 'giua';
              if (seat.type === 'driver') {
                type = 'driver';
              } else if (seat.isLastRow) {
                type = 'cuoi';
              } else if (seat.row <= 1) {
                type = 'dau';
              }

              return {
                ...seat,
                code: seatNumber,
                type,
                isBlocked,
                status
              };
            });
          }
          setSeatLayout(mappedSeats);
        } else {
          setSeatsError("Không thể tải sơ đồ ghế từ hệ thống.");
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.message || 'Không thể tải chi tiết lịch trình.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingSeats(false);
        }
      }
    };

    fetchDetailAndSeatMap();
    return () => { cancelled = true; };
  }, [isOpen, showtime?.id]);

  if (!isOpen || !showtime) return null;

  const renderStatus = (statusValue) => {
    switch (statusValue) {
      case BusShowtimeStatus.Scheduled: return 'Lên lịch (Scheduled)';
      case BusShowtimeStatus.Active: return 'Hoạt động (Active)';
      case BusShowtimeStatus.Delayed: return 'Bị hoãn (Delayed)';
      case BusShowtimeStatus.Cancelled: return 'Đã hủy (Cancelled)';
      case BusShowtimeStatus.Hidden: return 'Đã ẩn (Hidden)';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (value) => {
    if (value == null) return '--';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chi tiết lịch trình</h2>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              onClick={onClose}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs selector */}
        <div className="flex border-b border-slate-100 shrink-0 px-6 bg-slate-50/50">
          <button
            type="button"
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin chung
          </button>
          <button
            type="button"
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'seatMap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setActiveTab('seatMap')}
          >
            Sơ đồ ghế
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-slate-500">Đang tải thông tin...</span>
            </div>
          ) : activeTab === 'info' ? (
            detailData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500">Mã lịch trình</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium font-mono">
                      {detailData.id || "--"}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500">Biển số xe</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium uppercase font-mono tracking-wider">
                      {detailData.plateNumber || "--"}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500">Trạng thái</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                      {renderStatus(detailData.status)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500">Ngày khởi hành</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                      {detailData.departureDate || "--"}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500">Giờ khởi hành</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                      {detailData.departureTime || "--"}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500">Số ghế</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                      {detailData.seatCount ?? "--"}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-500">Giá vé</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                      {formatCurrency(detailData.price)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Không tìm thấy thông tin
              </div>
            )
          ) : (
            /* Sơ đồ ghế tab */
            <div className="space-y-6">
              {isLoadingSeats ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-500 font-semibold text-sm mt-2">Đang tải sơ đồ ghế...</span>
                </div>
              ) : seatsError ? (
                <div className="text-red-500 text-sm font-semibold text-center py-12">
                  {seatsError}
                </div>
              ) : seatLayout.length === 0 ? (
                <div className="text-slate-500 text-sm font-semibold text-center py-12">
                  Không có sơ đồ ghế cho lịch trình này.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Legends Column */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">Chú thích</h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <SeatIcon isBlocked={true} />
                        <span className="text-xs font-semibold text-slate-500">Đã được đặt / Khóa</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <SeatIcon />
                        <span className="text-xs font-semibold text-slate-500">Ghế trống (Còn trống)</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Map Column */}
                  <div className="md:col-span-7 flex justify-center">
                    <div className="bg-slate-100/70 p-6 rounded-[32px] border border-slate-200/50 w-full max-w-[260px] flex flex-col items-center min-h-[250px]">
                      <div className="w-full flex justify-between items-center mb-6 px-3">
                        <SteeringWheelIcon className="w-7 h-7" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/40 py-1 px-2.5 rounded-full border border-slate-200">Khoang lái</span>
                      </div>

                      <div className="flex flex-col gap-4 w-full">
                        {Array.from({ length: layoutRows }).map((_, rowNum) => (
                          <div key={rowNum} className="grid gap-3 justify-items-center w-full" style={{ gridTemplateColumns: `repeat(${layoutCols}, minmax(0, 1fr))` }}>
                            {Array.from({ length: layoutCols }).map((_, colIdx) => {
                              const seat = seatLayout.find(s => s.row === rowNum && s.col === colIdx);
                              if (!seat) {
                                return <div key={colIdx} className="w-8 h-8" />;
                              }
                              if (seat.type === 'driver') {
                                return (
                                  <div key={colIdx} className="w-8 h-8 flex items-center justify-center">
                                    <SteeringWheelIcon className="w-7 h-7" />
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={seat.code}
                                  className="transition-transform hover:scale-105"
                                  title={`Ghế ${seat.code}: ${seat.isBlocked ? 'Đã đặt' : 'Còn trống'}`}
                                >
                                  <SeatIcon
                                    isBlocked={seat.isBlocked}
                                  />
                                  <div className="text-[10px] text-center font-bold text-slate-500 mt-1 select-none">
                                    {seat.code}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusShowtimeDetailModal;
