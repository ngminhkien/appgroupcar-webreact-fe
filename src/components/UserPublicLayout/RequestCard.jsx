import React, { useState } from 'react';

const RequestCard = ({ request }) => {
  const [hasContacted, setHasContacted] = useState(false);

  const formatPrice = (price) => {
    return `${price.toLocaleString()}đ`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const isCarpool = request.type === 'carpool';

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
        
        {/* Left Column: User Info & Service Badge */}
        <div className="flex items-start gap-4 shrink-0 md:w-56 text-left">
          {/* Initials Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
            {getInitials(request.passengerName)}
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="font-extrabold text-slate-800 text-base leading-tight">
              {request.passengerName}
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              SĐT: {request.passengerPhone}
            </span>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 py-0.5 px-2 rounded-md w-max mt-1">
              Đăng {request.createdAt}
            </span>
            
            {/* Service Badge */}
            <span className={`text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-full w-max mt-2 border ${
              isCarpool 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-lime-50 text-lime-700 border-lime-100'
            }`}>
              {request.serviceLabel}
            </span>
          </div>
        </div>

        {/* Center Column: Route & Details */}
        <div className="flex-1 flex flex-col justify-between gap-4 text-left md:border-l md:border-slate-100 md:pl-6">
          
          {/* Departure Date & Time Window */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Thời gian mong muốn:</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg">
              {request.timeWindow} • {request.date}
            </span>
          </div>

          {/* Journey Path */}
          <div className="flex items-center gap-3.5 my-1">
            <span className="text-base font-extrabold text-slate-900">{request.from}</span>
            <span className="text-slate-400 text-sm select-none">➔</span>
            <span className="text-base font-extrabold text-slate-900">{request.to}</span>
          </div>

          {/* Details & Notes */}
          <div className="flex flex-col gap-2 bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
            <div className="text-xs font-medium text-slate-600">
              {isCarpool ? (
                <span>Cần ghép: <strong className="text-slate-800 font-extrabold">{request.seatsNeeded} chỗ ngồi</strong></span>
              ) : (
                <div className="flex items-center gap-4 flex-wrap">
                  <span>Mặt hàng: <strong className="text-slate-800 font-extrabold">{request.cargoType}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Khối lượng: <strong className="text-slate-800 font-extrabold">{request.weight}</strong></span>
                </div>
              )}
            </div>
            
            {request.note && (
              <p className="text-xs italic text-slate-500 font-medium leading-relaxed border-t border-slate-200/60 pt-2 mt-1">
                &ldquo;{request.note}&rdquo;
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Price Offered & CTA */}
        <div className="shrink-0 flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:w-44 text-right border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Ngân sách chi trả:</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {formatPrice(request.budget)}
            </span>
          </div>

          <div className="w-full sm:w-auto md:w-full">
            {hasContacted ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-center font-bold py-2.5 px-4 rounded-xl text-xs animate-fade-in">
                ✓ Đã liên hệ nhận
              </div>
            ) : (
              <button
                onClick={() => setHasContacted(true)}
                className="w-full bg-slate-900 hover:bg-black text-white text-xs font-extrabold py-3 px-5 rounded-xl cursor-pointer shadow-md hover:shadow-slate-950/15 transition-all duration-300 text-center"
              >
                Nhận chuyến
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Interactive Success Toast Feedback */}
      {hasContacted && (
        <div className="mt-4 bg-emerald-500 text-white rounded-2xl py-3 px-4 flex items-center justify-between text-xs font-bold shadow-md animate-slide-up">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Gửi liên hệ thành công! Thông tin của bạn đã được chuyển đến khách hàng.</span>
          </span>
          <button 
            onClick={() => setHasContacted(false)}
            className="text-white hover:text-slate-200 font-extrabold pl-3"
          >
            Đóng
          </button>
        </div>
      )}

    </div>
  );
};

export default RequestCard;
