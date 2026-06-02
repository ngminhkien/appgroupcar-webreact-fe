import React, { useState } from 'react';
import TripDetails from './TripDetails';
import TripBooking from './TripBooking';
import logoGroupCar from '@/assets/logoGroupCar.png';

const TripCard = ({ trip }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const formatPrice = (price) => {
    return `${price.toLocaleString()}đ`;
  };

  // Determine badge colors based on tag
  const getTagStyles = (tag) => {
    switch (tag) {
      case 'LIMOUSINE':
        return 'bg-emerald-500 text-white';
      case 'GIƯỜNG NẰM':
        return 'bg-slate-900 text-white';
      default:
        return 'bg-green-600 text-white';
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col hover:shadow-lg transition-all duration-300 group">

      {/* Upper main info row */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Vehicle Image with Tag */}
        <div className="relative w-full md:w-56 h-48 shrink-0 overflow-hidden bg-slate-100">
          <img
            src={(() => {
              const img = trip.image;
              if (!img || img === 'string' || img === '') return logoGroupCar;
              if (img.startsWith('/') || (!img.startsWith('http') && !img.startsWith('data:'))) {
                let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
                const formattedUrl = img.startsWith('/') ? img : `/${img}`;
                return `${baseUrl}${formattedUrl}`;
              }
              return img;
            })()}
            alt={trip.operator}
            loading="lazy"
            onError={(e) => { e.target.src = logoGroupCar; }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${getTagStyles(trip.tag)}`}>
            {trip.tag}
          </span>
        </div>

        {/* Main Details Panel */}
        <div className="flex-1 p-6 flex flex-col justify-between gap-4">

          {/* Row 1: Operator Name & Stars */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{trip.operator}</h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                <span className="text-amber-500 font-bold text-base">★</span>
                <span className="font-bold text-slate-700">{trip.rating}</span>
                <span className="text-slate-400">({trip.reviewsCount} đánh giá)</span>
              </div>
            </div>

            {/* Price displayed inline for mobile only */}
            <div className="md:hidden mt-2 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-emerald-600">{formatPrice(trip.price)}</span>
              <span className="text-xs text-slate-500">/vé</span>
            </div>
          </div>

          {/* Row 2: Departure, Timeline, Arrival */}
          <div className="flex items-center justify-between gap-4 py-2 border-y border-slate-200">

            {/* Departure */}
            <div className="text-left shrink-0">
              <div className="text-lg font-extrabold text-slate-900">{trip.departureTime}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{trip.from}</div>
            </div>

            {/* Timeline center graphic */}
            <div className="flex-grow flex flex-col items-center relative">
              <span className="text-[11px] font-bold text-slate-400">{trip.duration}</span>
              <div className="w-full flex items-center gap-1.5 my-1.5">
                <div className="w-1.5 h-1.5 rounded-full border border-slate-400 bg-white" />
                <div className="flex-1 h-[1.5px] bg-slate-400 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {trip.stopoverType}
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right shrink-0">
              <div className="text-lg font-extrabold text-slate-900">{trip.arrivalTime}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{trip.to}</div>
            </div>

          </div>

          {/* Row 3: Available Seats & Mobile Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-slate-500 font-medium">
                <strong className="text-slate-800 font-bold">{trip.availableSeats}</strong> ghế trống
              </span>
            </div>

            {/* CTA buttons for Mobile view only */}
            <div className="flex md:hidden items-center gap-2.5 w-full sm:w-auto">
              <button 
                onClick={() => {
                  setShowBooking(!showBooking);
                  setShowDetails(false);
                }}
                className="flex-1 sm:flex-initial bg-slate-950 hover:bg-black text-white text-xs font-extrabold py-3 px-5 rounded-xl cursor-pointer shadow-md transition-all duration-300"
              >
                {showBooking ? 'Đóng chọn' : 'Chọn chuyến'}
              </button>
              <button
                onClick={() => {
                  setShowDetails(!showDetails);
                  setShowBooking(false);
                }}
                className="flex-1 sm:flex-initial bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-xs font-extrabold py-3 px-5 rounded-xl cursor-pointer transition-colors duration-300"
              >
                {showDetails ? 'Ẩn chi tiết' : 'Chi tiết'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Price and CTA (Desktop only) */}
        <div className="hidden md:flex w-44 border-l border-slate-200 p-6 flex-col justify-between items-center text-center shrink-0 bg-slate-50">
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">{formatPrice(trip.price)}</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">/vé</div>
          </div>

          <div className="flex flex-col gap-2 w-full mt-4">
            <button 
              onClick={() => {
                setShowBooking(!showBooking);
                setShowDetails(false);
              }}
              className="w-full bg-slate-950 hover:bg-black text-white text-xs font-extrabold py-3 px-4 rounded-xl cursor-pointer shadow-md hover:shadow-slate-950/15 transition-all duration-300"
            >
              {showBooking ? 'Đóng chọn' : 'Chọn chuyến'}
            </button>
            <button
              onClick={() => {
                setShowDetails(!showDetails);
                setShowBooking(false);
              }}
              className="w-full bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-xs font-extrabold py-3 px-4 rounded-xl cursor-pointer transition-colors duration-300"
            >
              {showDetails ? 'Ẩn chi tiết' : 'Chi tiết'}
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally rendered trip details drop-down container */}
      {showDetails && (
        <TripDetails trip={trip} onClose={() => setShowDetails(false)} />
      )}

      {/* Conditionally rendered trip booking flow dropdown container */}
      {showBooking && (
        <TripBooking trip={trip} onClose={() => setShowBooking(false)} />
      )}

    </div>
  );
};

export default TripCard;
