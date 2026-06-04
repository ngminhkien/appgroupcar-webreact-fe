import React from 'react';
import { ServiceType, OfferStatus } from '@/types/enums';
import logoGroupCar from '@/assets/logoGroupCar.png';

const DriverTripCard = ({ trip }) => {
  const {
    id,
    vehicleName,
    vehicleUrlImage,
    plateNumber,
    serviceType,
    departureTime,
    estimatedDurationMinutes,
    basePrice,
    status,
    startPoint,
    endPoint,
  } = trip;

  // Format price helper
  const formatPrice = (price) => {
    return `${price?.toLocaleString()}đ`;
  };

  // Format date helper: "2026-06-05T04:13:42.035" -> "04:13 • 05/06/2026"
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

  // Format duration helper: 600 -> "10 giờ"
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

  // Service Type label and styling
  const getServiceTypeInfo = (type) => {
    switch (type) {
      case ServiceType.Shared:
        return {
          label: 'Xe ghép / Đi chung',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      case ServiceType.Contract:
        return {
          label: 'Bao xe / Hợp đồng',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          dotClass: 'bg-blue-500',
        };
      case ServiceType.Truck:
        return {
          label: 'Xe tải vận chuyển',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
          dotClass: 'bg-purple-500',
        };
      default:
        return {
          label: 'Dịch vụ khác',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          dotClass: 'bg-slate-500',
        };
    }
  };

  // Status label and styling
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

  const serviceInfo = getServiceTypeInfo(serviceType);
  const statusInfo = getStatusInfo(status);

  // Full Image Url resolver
  const getFullImageUrl = (img) => {
    if (!img || img === 'string' || img === '') return logoGroupCar;
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = img.startsWith('/') ? img : `/${img}`;
    return `${baseUrl}${formattedUrl}`;
  };

  return (
    <div className="w-full bg-[#f8fafc] rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group text-left relative pl-2.5">
      {/* Side Accent line to draw attention */}
      <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${serviceInfo.dotClass}`} />
      
      {/* Vehicle Image with Service Badge */}
      <div className="relative w-full md:w-56 h-48 shrink-0 overflow-hidden bg-slate-50 border-r border-slate-100">
        <img
          src={getFullImageUrl(vehicleUrlImage)}
          alt={vehicleName || 'Phương tiện'}
          loading="lazy"
          onError={(e) => { e.target.src = logoGroupCar; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase border ${serviceInfo.badgeClass}`}>
          {serviceInfo.label}
        </span>
      </div>

      {/* Main Trip Details */}
      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
        
        {/* Header: Vehicle Name & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              {vehicleName || 'Vinfast'} 
              <span className="text-xs font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md border border-slate-200">
                {plateNumber || 'Chưa có BKS'}
              </span>
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Mã chuyến: #{id?.substring(0, 8).toUpperCase()}</p>
          </div>
          
          {/* Status Badge */}
          <span className={`self-start sm:self-auto px-3.5 py-1 rounded-full text-xs font-extrabold border ${statusInfo.badgeClass}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Route: Start Point ➔ End Point */}
        <div className="flex items-center gap-3 py-2.5 border-y border-dashed border-slate-200 flex-wrap">
          <div className="flex flex-col text-left">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Điểm đi</span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5">{startPoint?.locationName || 'Chưa rõ'}</span>
          </div>
          <span className="text-slate-400 text-xs px-2 select-none self-end pb-0.5">➔</span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Điểm đến</span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5">{endPoint?.locationName || 'Chưa rõ'}</span>
          </div>
        </div>

        {/* Bottom Metadata Info */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Thời gian: <strong className="text-slate-700">{formatDateTime(departureTime)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Dự kiến: <strong className="text-slate-700">{formatDuration(estimatedDurationMinutes)}</strong></span>
          </div>
        </div>

      </div>

      {/* Right Column: Base Price (Desktop / Tablet view) */}
      <div className="flex md:w-44 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex-row md:flex-col justify-between items-center md:text-center shrink-0 bg-slate-50/50">
        <div className="text-left md:text-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Giá cơ bản</span>
          <span className="text-xl font-black text-emerald-600 block mt-0.5">{formatPrice(basePrice)}</span>
        </div>

        <div className="flex gap-2 w-auto md:w-full md:mt-4">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer shadow-sm hover:shadow-emerald-600/10 transition-all duration-200">
            Chi tiết
          </button>
        </div>
      </div>

    </div>
  );
};

export default DriverTripCard;
