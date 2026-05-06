import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSeatLayoutByIdApi } from '@/services/seatLayoutService';

const SeatLayout = ({ layoutId, selectedSeats = [], onSeatSelect, bookedSeats = [] }) => {
  const [layoutData, setLayoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!layoutId) return;

    let cancelled = false;
    const fetchLayout = async () => {
      setIsLoading(true);
      try {
        const response = await getSeatLayoutByIdApi(layoutId);
        if (!cancelled) {
          const data = response?.data || response;
          setLayoutData(data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error('Không thể tải sơ đồ ghế.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchLayout();
    return () => { cancelled = true; };
  }, [layoutId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!layoutData || !layoutData.layoutJson) {
    return (
      <div className="text-center py-8 text-slate-500">
        Không có thông tin sơ đồ ghế.
      </div>
    );
  }

  const { rows, cols, seats } = layoutData.layoutJson;

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="mb-5 text-center">
        <h3 className="text-lg font-bold text-slate-800">{layoutData.seatLayoutName}</h3>
        <p className="text-sm text-slate-500">{layoutData.description}</p>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-6 pt-8 pb-8 shadow-sm relative mx-auto w-fit min-w-[250px]">
        {/* Lái xe / Đầu xe */}
        <div className="w-full flex justify-center mb-8 pb-4 border-b-2 border-slate-100 border-dashed relative">
          <div className="absolute top-0 left-0 w-full h-2 rounded-t-full bg-slate-100 -mt-8"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">Đầu xe</span>
        </div>

        <div 
          className="grid gap-x-4 gap-y-6 relative justify-center mx-auto"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            const seat = seats.find(s => s.row === r && s.col === c);

            if (!seat) {
              return <div key={idx} className="w-[44px] h-[44px]"></div>; // Lối đi hoặc trống
            }

            if (seat.type === 'driver') {
              return (
                <div key={idx} className="w-[44px] h-[44px] flex flex-col items-center justify-center text-slate-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="2" x2="12" y2="9" />
                    <line x1="12" y1="15" x2="18.5" y2="19" />
                    <line x1="12" y1="15" x2="5.5" y2="19" />
                  </svg>
                  <span className="text-[9px] font-medium mt-0.5 uppercase tracking-wider">Lái xe</span>
                </div>
              );
            }

            const isSelected = selectedSeats.includes(seat.seatNumber);
            const isBooked = bookedSeats.includes(seat.seatNumber);

            let seatClass = 'bg-white border-slate-300 text-slate-600 hover:border-green-500 hover:text-green-600 cursor-pointer shadow-sm';
            
            if (isBooked) {
              seatClass = 'bg-slate-400 border-slate-500 text-white cursor-not-allowed opacity-75';
            } else if (isSelected) {
              seatClass = 'bg-green-600 border-green-600 text-white shadow-md scale-105';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isBooked && onSeatSelect && onSeatSelect(seat)}
                disabled={isBooked}
                className={`w-[44px] h-[44px] flex items-center justify-center rounded-lg border-2 font-bold text-xs transition-all outline-none ${seatClass}`}
                title={isBooked ? `Ghế ${seat.seatNumber} đã được đặt` : `Chọn ghế ${seat.seatNumber}`}
              >
                {seat.seatNumber}
              </button>
            );
          })}
        </div>

        {/* Đuôi xe */}
        <div className="w-full flex justify-center mt-8 pt-4 border-t-2 border-slate-100 border-dashed relative">
           <div className="absolute bottom-0 left-0 w-full h-2 rounded-b-full bg-slate-100 -mb-8"></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2">Cuối xe</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 w-fit">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg border-2 border-slate-300 bg-white"></div>
          <span className="text-sm font-medium text-slate-600">Trống</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg border-2 border-green-600 bg-green-600 shadow-sm"></div>
          <span className="text-sm font-medium text-slate-600">Đang chọn</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg border-2 border-slate-500 bg-slate-400 opacity-75"></div>
          <span className="text-sm font-medium text-slate-600">Đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
