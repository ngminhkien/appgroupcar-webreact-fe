import React, { useState, useRef } from 'react';

// Steering wheel icon
const SteeringWheelIcon = ({ className = '' }) => (
  <svg className={`${className} text-slate-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
  </svg>
);

// Custom interactive Seat SVG representation matching the design legends
const SeatIcon = ({ className = '', type = 'cuoi', isSelected = false, isBlocked = false }) => {
  if (isBlocked) {
    return (
      <svg className={`${className} w-8 h-8 text-slate-300`} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3.5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (isSelected) {
    return (
      <svg className={`${className} w-8 h-8 text-emerald-500`} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3.5" fill="#DEF7EC" stroke="#31C48D" strokeWidth="2.5" />
        <path d="M9 12l2 2 4-4" fill="none" stroke="#31C48D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Base configurations for outline seats
  let strokeColor = '#7E3AF2'; // Default purple for "Ghế đầu"
  let fillColor = '#F3E8FF';
  if (type === 'cuoi') {
    strokeColor = '#84CC16'; // Lime green
    fillColor = '#ECFDF5';
  } else if (type === 'giua') {
    strokeColor = '#F59E0B'; // Orange
    fillColor = '#FFFBEB';
  }

  return (
    <svg className={`${className} w-8 h-8`} viewBox="0 0 24 24" strokeWidth="2" stroke={strokeColor} fill="none">
      {/* Outer seat shell */}
      <rect x="5" y="4" width="14" height="14" rx="2.5" fill={fillColor} />
      {/* Left armrest */}
      <rect x="3" y="10" width="2" height="7" rx="0.5" fill={fillColor} />
      {/* Right armrest */}
      <rect x="19" y="10" width="2" height="7" rx="0.5" fill={fillColor} />
      {/* Inner seat cushion */}
      <rect x="6" y="12" width="12" height="5" rx="1" fill={fillColor} />
    </svg>
  );
};

const TripBooking = ({ trip, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([
    { code: 'D1', type: 'giua', price: 230000, label: 'D1' } // Default selected seat to match the mockup
  ]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  
  // New States for Step 3 & 4
  const [passengerName, setPassengerName] = useState('Nguyễn Minh Kiên');
  const [passengerPhone, setPassengerPhone] = useState('0987654321');
  const [passengerEmail, setPassengerEmail] = useState('kien@example.com');
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'transfer' or 'cash'
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Map operator specific locations
  const getLocations = (operator) => {
    const defaultLocations = {
      pickups: [
        { id: 'p1', time: '12:00', name: 'Văn phòng 61 Trần Đăng Ninh', address: '61 Trần Đăng Ninh, Phường Dịch Vọng, Cầu Giấy, Hà Nội', isDoorToDoor: false },
        { id: 'p2', time: '12:10', name: '982 Đường Láng', address: 'Đầu đường chùa Láng, sông Tô Lịch, Phường Láng Thượng, Đống Đa, Hà Nội', isDoorToDoor: false, hasNotice: true },
        { id: 'p3', time: '12:15', name: 'Pháo Đài Láng', address: '828 Đ. Láng (điểm bus mặt đường Láng), Láng Thượng, Phường Láng Thượng, Đống Đa, Hà Nội', isDoorToDoor: false }
      ],
      dropoffs: [
        { id: 'd1', time: '14:10', name: 'Văn phòng 68 Lạch Tray', address: 'Văn Phòng 68 Lạch Tray, Phường Lạch Tray, Ngô Quyền, Hải Phòng', isDoorToDoor: false },
        { id: 'd2', time: '14:30', name: 'Bến xe Thượng Lý', address: 'Số 52 đường Hà Nội, Sở Dầu, Hồng Bàng, Hải Phòng', isDoorToDoor: false },
        { id: 'd3', time: '14:45', name: 'VP Hải Phòng Cầu Đất', address: 'VP Hoàng Long Hải Phòng (Cầu Đất), Ngô Quyền, Hải Phòng', isDoorToDoor: false }
      ]
    };

    if (operator === 'Hoàng Long') {
      return {
        pickups: [
          { id: 'p1', time: '14:30', name: 'Bến xe Nước Ngầm', address: 'Bến xe Nước Ngầm, Hoàng Mai, Hà Nội', isDoorToDoor: false },
          { id: 'p2', time: '14:45', name: 'Văn phòng 28 Trần Nhân Tông', address: 'Văn phòng 28 Trần Nhân Tông, Hai Bà Trưng, Hà Nội', isDoorToDoor: false },
          { id: 'p3', time: '15:15', name: 'Bến xe Cổ Điển', address: 'Bến xe Cổ Điển, Gia Lâm, Hà Nội', isDoorToDoor: false }
        ],
        dropoffs: [
          { id: 'd1', time: '16:30', name: 'Nút giao Nam Cầu Bính', address: 'Nút giao Nam Cầu Bính, Hồng Bàng, Hải Phòng', isDoorToDoor: false },
          { id: 'd2', time: '16:45', name: 'Bến xe Thượng Lý', address: 'Bến xe Thượng Lý, Hồng Bàng, Hải Phòng', isDoorToDoor: false },
          { id: 'd3', time: '17:00', name: 'Văn phòng Hoàng Long Cầu Đất', address: 'Văn phòng Hoàng Long Hải Phòng (Cầu Đất), Hải Phòng', isDoorToDoor: false }
        ]
      };
    }

    if (operator === 'Anh Huy Đất Cảng') {
      return {
        pickups: [
          { id: 'p1', time: '15:45', name: 'Bến xe Yên Nghĩa', address: 'Bến xe Yên Nghĩa, Hà Đông, Hà Nội', isDoorToDoor: false },
          { id: 'p2', time: '16:00', name: 'Ngã tư Khuất Duy Tiến', address: 'Hầm đi bộ số 3 Khuất Duy Tiến, Thanh Xuân, Hà Nội', isDoorToDoor: false },
          { id: 'p3', time: '16:30', name: 'Văn phòng Anh Huy Hà Nội', address: 'Văn phòng Anh Huy Hà Nội (Khuất Duy Tiến), Hà Nội', isDoorToDoor: false }
        ],
        dropoffs: [
          { id: 'd1', time: '17:45', name: 'Bến xe Cầu Rào', address: 'Bến xe Cầu Rào, Ngô Quyền, Hải Phòng', isDoorToDoor: false },
          { id: 'd2', time: '18:00', name: 'Văn phòng Anh Huy Hải Phòng', address: 'Văn phòng Anh Huy Hải Phòng (Điện Biên Phủ), Hải Phòng', isDoorToDoor: false }
        ]
      };
    }

    return defaultLocations;
  };

  const locations = getLocations(trip.operator);

  // Default select first item if not chosen yet on step 2 load
  React.useEffect(() => {
    if (step === 2) {
      if (!selectedPickup && locations.pickups.length > 0) {
        setSelectedPickup(locations.pickups[0]);
      }
      if (!selectedDropoff && locations.dropoffs.length > 0) {
        setSelectedDropoff(locations.dropoffs[0]);
      }
    }
  }, [step]);

  // Generate random booking code once
  React.useEffect(() => {
    if (!bookingCode) {
      setBookingCode(`VX${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, []);

  // Static seat layout
  const seatLayout = [
    { code: 'A1', type: 'dau', price: 210000, originalPrice: 250000, isBlocked: false, row: 1 },
    { code: 'A2', type: 'dau', price: 210000, originalPrice: 250000, isBlocked: false, row: 1 },
    { code: 'B1', type: 'blocked', isBlocked: true, row: 2 },
    { code: 'B2', type: 'blocked', isBlocked: true, row: 2 },
    { code: 'C1', type: 'blocked', isBlocked: true, row: 3 },
    { code: 'C2', type: 'giua', price: 230000, originalPrice: 270000, isBlocked: false, row: 3 },
    { code: 'D1', type: 'giua', price: 230000, originalPrice: 270000, isBlocked: false, row: 4 },
    { code: 'D2', type: 'giua', price: 230000, originalPrice: 270000, isBlocked: false, row: 4 },
    { code: 'E1', type: 'cuoi', price: 220000, originalPrice: 260000, isBlocked: false, row: 5 },
    { code: 'E2', type: 'cuoi', price: 220000, originalPrice: 260000, isBlocked: false, row: 5 },
    { code: 'E3', type: 'cuoi', price: 220000, originalPrice: 260000, isBlocked: false, row: 5 }
  ];

  const handleSeatClick = (seat) => {
    if (seat.isBlocked) return;

    const isAlreadySelected = selectedSeats.some(s => s.code === seat.code);
    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => s.code !== seat.code));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
    setErrorMessage('');
  };

  const handleSeatContinue = () => {
    if (selectedSeats.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 chỗ ngồi trước khi tiếp tục.');
      return;
    }
    setStep(2);
    setErrorMessage('');
  };

  const handlePickupContinue = () => {
    if (!selectedPickup || !selectedDropoff) {
      setErrorMessage('Vui lòng chọn đầy đủ 1 điểm đón và 1 điểm trả.');
      return;
    }
    setStep(3);
    setErrorMessage('');
  };

  const handlePassengerContinue = () => {
    if (!passengerName.trim() || !passengerPhone.trim() || !passengerEmail.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên, số điện thoại và email.');
      return;
    }
    // Simple email & phone regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerEmail)) {
      setErrorMessage('Email không đúng định dạng.');
      return;
    }
    if (passengerPhone.length < 9) {
      setErrorMessage('Số điện thoại không hợp lệ.');
      return;
    }
    setStep(4);
    setErrorMessage('');
  };

  const handlePaymentConfirm = () => {
    setBookingSuccess(true);
    setErrorMessage('');
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((acc, curr) => acc + (curr.price || 0), 0);
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()}đ`;
  };

  if (bookingSuccess) {
    return (
      <div className="w-full bg-slate-50 border-t border-slate-200 px-6 py-8 relative animate-fade-in text-left">
        {/* Red Close "X" Button in Top-Right */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-6 w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
          {/* Decorative receipt punch out circles */}
          <div className="absolute left-0 top-1/4 -translate-y-1/2 w-4 h-8 bg-slate-50 border-r border-slate-200 rounded-r-full" />
          <div className="absolute right-0 top-1/4 -translate-y-1/2 w-4 h-8 bg-slate-50 border-l border-slate-200 rounded-l-full" />

          {/* Header Success Status */}
          <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-dashed border-slate-200 mb-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Đặt Vé Thành Công!</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Mã đặt chỗ: <span className="text-blue-600 font-extrabold uppercase">{bookingCode}</span></p>
          </div>

          {/* Receipt Info Body */}
          <div className="flex flex-col gap-3.5 text-xs text-slate-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-400">Nhà xe:</span>
              <span className="font-extrabold text-slate-800">{trip.operator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dịch vụ:</span>
              <span className="font-bold text-slate-800 uppercase text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100">{trip.tag}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Số ghế đã chọn:</span>
              <span className="font-extrabold text-slate-800">{selectedSeats.map(s => s.code).join(', ')}</span>
            </div>
            
            <div className="border-t border-slate-100 my-0.5" />
            
            {/* Passenger Info */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-400">Hành khách:</span>
              <div className="text-slate-800 font-bold">
                {passengerName} • {passengerPhone}
                <div className="text-slate-500 font-medium text-[11px]">{passengerEmail}</div>
              </div>
            </div>

            {/* Selected locations */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400">Điểm đón khách:</span>
              <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100">
                <strong className="text-slate-800 text-xs font-extrabold block">{selectedPickup?.time} • {selectedPickup?.name}</strong>
                <span className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5 block">{selectedPickup?.address}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400">Điểm trả khách:</span>
              <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100">
                <strong className="text-slate-800 text-xs font-extrabold block">{selectedDropoff?.time} • {selectedDropoff?.name}</strong>
                <span className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5 block">{selectedDropoff?.address}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 my-0.5" />

            <div className="flex justify-between">
              <span className="text-slate-400">Thanh toán:</span>
              <span className="font-extrabold text-slate-800">
                {paymentMethod === 'transfer' ? 'Chuyển khoản (Techcombank)' : 'Tiền mặt khi lên xe'}
              </span>
            </div>
            
            <div className="border-t border-slate-100 my-0.5" />
            
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-extrabold text-slate-900 text-sm">Tổng cộng:</span>
              <span className="text-xl font-black text-emerald-600">{formatPrice(calculateTotalPrice())}</span>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-extrabold py-3.5 px-6 rounded-2xl cursor-pointer shadow-md transition-all duration-300 text-center uppercase tracking-wider"
            >
              Hoàn tất giao dịch
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 border-t border-slate-200 px-6 py-6 relative animate-fade-in text-left">
      {/* Red Close "X" Button in Top-Right */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer z-10"
        title="Đóng"
      >
        <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Step Progress Bar Header (4 Steps) */}
      <div className="flex items-center justify-start border-b border-slate-200 pb-4 mb-4 pr-12 overflow-x-auto scrollbar-none gap-2">
        {/* Step 1 */}
        <div className="flex items-center gap-2 shrink-0">
          {step === 1 ? (
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
              <span>Chỗ mong muốn</span>
            </div>
          ) : (
            <button 
              onClick={() => setStep(1)} 
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center bg-white">
                <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Chỗ mong muốn</span>
            </button>
          )}
        </div>

        <div className={`w-10 md:w-16 h-[1.5px] shrink-0 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2 shrink-0">
          {step < 2 ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[11px] font-black flex items-center justify-center">2</span>
              <span>Điểm đón trả</span>
            </div>
          ) : step === 2 ? (
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
              <span>Điểm đón trả</span>
            </div>
          ) : (
            <button 
              onClick={() => setStep(2)} 
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center bg-white">
                <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Điểm đón trả</span>
            </button>
          )}
        </div>

        <div className={`w-10 md:w-16 h-[1.5px] shrink-0 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />

        {/* Step 3 */}
        <div className="flex items-center gap-2 shrink-0">
          {step < 3 ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[11px] font-black flex items-center justify-center">3</span>
              <span>Xác nhận thông tin</span>
            </div>
          ) : step === 3 ? (
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
              <span>Xác nhận thông tin</span>
            </div>
          ) : (
            <button 
              onClick={() => setStep(3)} 
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center bg-white">
                <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Xác nhận thông tin</span>
            </button>
          )}
        </div>

        <div className={`w-10 md:w-16 h-[1.5px] shrink-0 ${step >= 4 ? 'bg-blue-600' : 'bg-slate-200'}`} />

        {/* Step 4 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-2 text-sm ${step === 4 ? 'font-extrabold text-slate-800' : 'font-semibold text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center ${step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>4</span>
            <span>Thanh toán</span>
          </div>
        </div>
      </div>

      {/* STEP 1: CHỖ MONG MUỐN */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          {/* Alert Guarantee Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Vexere cam kết giữ đúng chỗ bạn đã chọn.</span>
          </div>

          {/* Seat Layout and Legend Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-2">
            
            {/* Legends Column */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">Chú thích</h3>
              
              <div className="flex flex-col gap-4">
                {/* Blocked */}
                <div className="flex items-center gap-3">
                  <SeatIcon isBlocked={true} />
                  <span className="text-xs font-semibold text-slate-500">Ghế không bán</span>
                </div>

                {/* Selected */}
                <div className="flex items-center gap-3">
                  <SeatIcon isSelected={true} />
                  <span className="text-xs font-semibold text-slate-500">Đang chọn</span>
                </div>

                {/* Last Row Seat */}
                <div className="flex items-center gap-3">
                  <SeatIcon type="cuoi" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Ghế cuối</span>
                    <span className="text-xs font-semibold text-slate-500">220,000đ <span className="line-through text-slate-400 ml-1">260,000đ</span></span>
                  </div>
                </div>

                {/* Middle Row Seat */}
                <div className="flex items-center gap-3">
                  <SeatIcon type="giua" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Ghế giữa</span>
                    <span className="text-xs font-semibold text-slate-500">230,000đ <span className="line-through text-slate-400 ml-1">270,000đ</span></span>
                  </div>
                </div>

                {/* Front Row Seat */}
                <div className="flex items-center gap-3">
                  <SeatIcon type="dau" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Ghế đầu</span>
                    <span className="text-xs font-semibold text-slate-500">210,000đ <span className="line-through text-slate-400 ml-1">250,000đ</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Map Column */}
            <div className="md:col-span-7 flex justify-center">
              <div className="bg-slate-100/70 p-6 rounded-[32px] border border-slate-200/50 w-full max-w-[260px] flex flex-col items-center">
                
                {/* Steering Wheel Header */}
                <div className="w-full flex justify-between items-center mb-6 px-3">
                  <SteeringWheelIcon className="w-7 h-7" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/40 py-1 px-2.5 rounded-full border border-slate-200">Khoang lái</span>
                </div>

                {/* Seat Grid Layout */}
                <div className="flex flex-col gap-4 w-full">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-3 gap-5 justify-items-center w-full">
                    <div /> {/* Drive side column blank */}
                    <div 
                      onClick={() => handleSeatClick(seatLayout[0])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[0].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[0].code)} 
                      />
                    </div>
                    <div 
                      onClick={() => handleSeatClick(seatLayout[1])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[1].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[1].code)} 
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-3 gap-5 justify-items-center w-full">
                    <div /> {/* Corridor blank */}
                    <div>
                      <SeatIcon isBlocked={true} />
                    </div>
                    <div>
                      <SeatIcon isBlocked={true} />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-3 gap-5 justify-items-center w-full">
                    <div /> {/* Corridor blank */}
                    <div>
                      <SeatIcon isBlocked={true} />
                    </div>
                    <div 
                      onClick={() => handleSeatClick(seatLayout[5])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[5].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[5].code)} 
                      />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-3 gap-5 justify-items-center w-full">
                    <div /> {/* Corridor blank */}
                    <div 
                      onClick={() => handleSeatClick(seatLayout[6])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[6].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[6].code)} 
                      />
                    </div>
                    <div 
                      onClick={() => handleSeatClick(seatLayout[7])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[7].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[7].code)} 
                      />
                    </div>
                  </div>

                  {/* Row 5 - Last row (3 seats side-by-side) */}
                  <div className="grid grid-cols-3 gap-5 justify-items-center w-full pt-2 border-t border-slate-200/60 mt-1">
                    <div 
                      onClick={() => handleSeatClick(seatLayout[8])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[8].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[8].code)} 
                      />
                    </div>
                    <div 
                      onClick={() => handleSeatClick(seatLayout[9])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[9].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[9].code)} 
                      />
                    </div>
                    <div 
                      onClick={() => handleSeatClick(seatLayout[10])}
                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <SeatIcon 
                        type={seatLayout[10].type} 
                        isSelected={selectedSeats.some(s => s.code === seatLayout[10].code)} 
                      />
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 font-bold text-xs mt-2 text-center animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Số ghế chọn</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                {selectedSeats.length > 0 ? selectedSeats.map(s => s.code).join(', ') : 'Chưa chọn'}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng cộng</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handleSeatContinue}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all duration-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ĐIỂM ĐON TRẢ */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          {/* Guarantee Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>An tâm được đón đúng nơi, trả đúng chỗ đã chọn và dễ dàng thay đổi khi cần.</span>
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column Pickups */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center gap-4 mb-4">
                <h4 className="text-base font-extrabold text-slate-900">Điểm đón</h4>
              </div>

              <div className="flex flex-col max-h-[300px] overflow-y-auto pr-1">
                {locations.pickups.map((item) => {
                  const isSelected = selectedPickup?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPickup(item)}
                      className={`flex items-start justify-between gap-4 p-4 border-b border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'border-l-4 border-l-blue-600 pl-3' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center shrink-0">
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">{item.time}</span>
                            <span className="font-extrabold text-slate-800 text-sm">{item.name}</span>
                            {item.hasNotice && (
                              <span className="text-red-500 font-extrabold text-[10px] animate-pulse">
                                • Lưu ý quan trọng
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 font-medium leading-relaxed mt-1">{item.address}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-800 shrink-0 select-none cursor-pointer mt-0.5"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="underline">Bản đồ</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column Dropoffs */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center gap-4 mb-4">
                <h4 className="text-base font-extrabold text-slate-900">Điểm trả</h4>
              </div>

              <div className="flex flex-col max-h-[300px] overflow-y-auto pr-1">
                {locations.dropoffs.map((item) => {
                  const isSelected = selectedDropoff?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDropoff(item)}
                      className={`flex items-start justify-between gap-4 p-4 border-b border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'border-l-4 border-l-blue-600 pl-3' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center shrink-0">
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">{item.time}</span>
                            <span className="font-extrabold text-slate-800 text-sm">{item.name}</span>
                          </div>
                          <p className="text-slate-500 font-medium leading-relaxed mt-1">{item.address}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-800 shrink-0 select-none cursor-pointer mt-0.5"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="underline">Bản đồ</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 font-bold text-xs mt-2 text-center animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <button
              onClick={() => setStep(1)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-black py-3.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng cộng ({selectedSeats.length} vé)</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handlePickupContinue}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all duration-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: XÁC NHẬN THÔNG TIN */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          {/* Info Alert Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 text-blue-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Vui lòng kiểm tra kỹ thông tin liên hệ để nhận vé qua SMS và Email.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Passenger Info Form */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Thông tin hành khách</h4>
              
              <div className="flex flex-col gap-1.5 text-xs text-left">
                <label className="font-extrabold text-slate-500">Họ và tên hành khách <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={passengerName}
                  onChange={(e) => { setPassengerName(e.target.value); setErrorMessage(''); }}
                  placeholder="Nhập họ và tên hành khách"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Số điện thoại <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    value={passengerPhone}
                    onChange={(e) => { setPassengerPhone(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập số điện thoại"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Địa chỉ Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    value={passengerEmail}
                    onChange={(e) => { setPassengerEmail(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập địa chỉ email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Review Summary */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-xs text-slate-700">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Tóm tắt chuyến xe</h4>
              
              <div className="flex flex-col gap-3 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hành trình:</span>
                  <span className="font-bold text-slate-800">{trip.from} ➔ {trip.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nhà xe:</span>
                  <span className="font-bold text-slate-800">{trip.operator} ({trip.tag})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Giờ xuất phát:</span>
                  <span className="font-bold text-slate-800">{trip.departureTime} (Thời gian đi: {trip.duration})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vị trí ghế:</span>
                  <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{selectedSeats.map(s => s.code).join(', ')}</span>
                </div>

                <div className="border-t border-slate-100 my-1" />

                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Địa điểm đón:</span>
                  <span className="text-slate-800 font-extrabold">{selectedPickup?.time} • {selectedPickup?.name}</span>
                  <span className="text-slate-500 leading-normal">{selectedPickup?.address}</span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Địa điểm trả:</span>
                  <span className="text-slate-800 font-extrabold">{selectedDropoff?.time} • {selectedDropoff?.name}</span>
                  <span className="text-slate-500 leading-normal">{selectedDropoff?.address}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 font-bold text-xs mt-2 text-center animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <button
              onClick={() => setStep(2)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-black py-3.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng tiền thanh toán</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handlePassengerContinue}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all duration-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: PHƯƠNG THỨC THANH TOÁN */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          {/* Info Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span>Vui lòng chọn 1 phương thức thanh toán phù hợp bên dưới.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Payment Selection Methods */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Phương thức thanh toán</h4>
              
              <div className="flex flex-col gap-3">
                {/* Bank Transfer Option */}
                <div 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50/60 transition-all ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}
                >
                  <div className="mt-1 flex items-center justify-center shrink-0">
                    {paymentMethod === 'transfer' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <h5 className="font-extrabold text-slate-900 text-sm">Chuyển khoản Ngân hàng (Internet Banking)</h5>
                    <p className="text-slate-400 font-medium mt-0.5">Quét mã QR hoặc chuyển khoản thông tin tài khoản ngân hàng Techcombank nhanh chóng.</p>
                  </div>
                </div>

                {/* Cash Option */}
                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50/60 transition-all ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}
                >
                  <div className="mt-1 flex items-center justify-center shrink-0">
                    {paymentMethod === 'cash' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <h5 className="font-extrabold text-slate-900 text-sm">Thanh toán bằng Tiền mặt khi lên xe</h5>
                    <p className="text-slate-400 font-medium mt-0.5">Thanh toán trực tiếp cho phụ xe hoặc tài xế khi xe đón bạn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Details Panel */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center text-xs">
              {paymentMethod === 'transfer' ? (
                <div className="flex flex-col items-center justify-center text-center gap-4">
                  <h4 className="text-sm font-extrabold text-slate-900">Thông tin chuyển khoản</h4>
                  
                  {/* QR Code Graphic Placeholder */}
                  <div className="w-36 h-36 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-3 relative shadow-inner">
                    {/* Inner QR patterns */}
                    <div className="w-full h-full border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 select-none font-bold">
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span className="text-[10px] text-slate-400">QR TECHCOMBANK</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full text-left font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ngân hàng:</span>
                      <span className="font-extrabold text-slate-800">Techcombank (TCB)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Số tài khoản:</span>
                      <span className="font-extrabold text-blue-600">1903 9019 2830 18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tên tài khoản:</span>
                      <span className="font-extrabold text-slate-800 uppercase">CONG TY CP VEXERE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nội dung CK:</span>
                      <span className="font-extrabold text-slate-800 text-[13px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">{bookingCode}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 gap-4">
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Thanh toán khi lên xe</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs">Bạn sẽ thanh toán trực tiếp số tiền vé cho tài xế hoặc phụ xe khi lên xe. Nhà xe sẽ liên hệ xác nhận chuyến trước giờ đi 30 phút.</p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <button
              onClick={() => setStep(3)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-black py-3.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng tiền thanh toán</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handlePaymentConfirm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-emerald-600/10 transition-all duration-300"
              >
                Đặt vé &amp; Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripBooking;
