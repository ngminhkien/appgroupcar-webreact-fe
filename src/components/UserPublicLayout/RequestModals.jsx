import React, { useState, useEffect } from 'react';

// 1. CARPOOL REQUEST MODAL
export const CarpoolRequestModal = ({ isOpen, onClose, onSubmit, initialFrom = '', initialTo = '' }) => {
  const [carpoolFrom, setCarpoolFrom] = useState(initialFrom);
  const [carpoolTo, setCarpoolTo] = useState(initialTo);
  const [carpoolDate, setCarpoolDate] = useState('');
  const [carpoolTime, setCarpoolTime] = useState('');
  const [carpoolSeats, setCarpoolSeats] = useState(1);
  const [carpoolNote, setCarpoolNote] = useState('');
  const [carpoolBudget, setCarpoolBudget] = useState(150000);

  // Sync with initial values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setCarpoolFrom(initialFrom);
      setCarpoolTo(initialTo);
    }
  }, [isOpen, initialFrom, initialTo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!carpoolFrom.trim() || !carpoolTo.trim() || !carpoolDate) {
      alert('Vui lòng nhập đầy đủ Điểm khởi hành, Điểm đến và Ngày đi.');
      return;
    }

    const newReq = {
      id: Date.now(),
      type: 'carpool',
      serviceLabel: 'Xe ghép',
      from: carpoolFrom,
      to: carpoolTo,
      date: carpoolDate,
      timeWindow: carpoolTime ? `Lúc ${carpoolTime}` : 'Sáng (06:00 - 12:00)',
      passengerName: 'Nguyễn Minh Kiên',
      passengerPhone: '0987.654.xxx',
      seatsNeeded: carpoolSeats,
      budget: Number(carpoolBudget) || 150000,
      status: 'Đang đợi xe',
      createdAt: 'Vừa xong',
      note: carpoolNote
    };

    onSubmit(newReq);
    
    // reset form fields
    setCarpoolDate('');
    setCarpoolTime('');
    setCarpoolSeats(1);
    setCarpoolNote('');
    setCarpoolBudget(150000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto text-left">
        
        {/* Modal Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-6 w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3 mb-2">Tạo yêu cầu xe ghép</h3>
          
          {/* carpoolFrom */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Điểm khởi hành</label>
            <div className="relative">
              <input 
                type="text" 
                value={carpoolFrom}
                onChange={(e) => setCarpoolFrom(e.target.value)}
                placeholder="Nhập địa chỉ bắt đầu..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* carpoolTo */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Điểm đến</label>
            <div className="relative">
              <input 
                type="text" 
                value={carpoolTo}
                onChange={(e) => setCarpoolTo(e.target.value)}
                placeholder="Bạn muốn đi đâu?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Ngày đi</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={carpoolDate}
                  onChange={(e) => setCarpoolDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                  required
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Giờ đi</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={carpoolTime}
                  onChange={(e) => setCarpoolTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Counter controls for seats */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Số ghế cần đặt</label>
            <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-2.5 w-32 border border-slate-200/50 shadow-inner">
              <button
                type="button"
                onClick={() => setCarpoolSeats(Math.max(1, carpoolSeats - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 flex items-center justify-center font-bold text-sm select-none cursor-pointer"
              >
                －
              </button>
              <span className="font-extrabold text-slate-800 text-sm">{carpoolSeats}</span>
              <button
                type="button"
                onClick={() => setCarpoolSeats(carpoolSeats + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 flex items-center justify-center font-bold text-sm select-none cursor-pointer"
              >
                ＋
              </button>
            </div>
          </div>

          {/* carpoolBudget */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Ngân sách đề xuất (đ)</label>
            <input 
              type="number" 
              value={carpoolBudget}
              onChange={(e) => setCarpoolBudget(e.target.value)}
              placeholder="Ví dụ: 150000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              required
            />
          </div>

          {/* driverNote */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Lưu ý cho tài xế</label>
            <textarea 
              value={carpoolNote}
              onChange={(e) => setCarpoolNote(e.target.value)}
              placeholder="Ví dụ: Có mang theo hành lý lớn, đi cùng trẻ em..."
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="bg-slate-950 hover:bg-black text-white text-sm font-black py-4 rounded-2xl w-full cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all mt-4 text-center uppercase tracking-wider"
          >
            Tạo yêu cầu xe ghép
          </button>
        </form>
      </div>
    </div>
  );
};


// 2. EXPRESS CARGO REQUEST MODAL
export const ExpressRequestModal = ({ isOpen, onClose, onSubmit, initialFrom = '', initialTo = '' }) => {
  const [expressFrom, setExpressFrom] = useState(initialFrom);
  const [expressTo, setExpressTo] = useState(initialTo);
  const [expressCargoType, setExpressCargoType] = useState('Hàng tiêu dùng');
  const [expressWeight, setExpressWeight] = useState('');
  const [expressDimensions, setExpressDimensions] = useState('');
  const [expressVehicle, setExpressVehicle] = useState('truck'); // 'truck' or 'van'
  const [expressDate, setExpressDate] = useState('');
  const [expressBudget, setExpressBudget] = useState(200000);

  // Sync with initial values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setExpressFrom(initialFrom);
      setExpressTo(initialTo);
    }
  }, [isOpen, initialFrom, initialTo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expressFrom.trim() || !expressTo.trim() || !expressDate) {
      alert('Vui lòng nhập đầy đủ Địa điểm lấy hàng, Địa điểm giao hàng và Ngày vận chuyển.');
      return;
    }

    const newReq = {
      id: Date.now(),
      type: 'express',
      serviceLabel: 'Gửi hàng',
      from: expressFrom,
      to: expressTo,
      date: expressDate,
      timeWindow: 'Sáng (06:00 - 12:00)',
      passengerName: 'Nguyễn Minh Kiên',
      passengerPhone: '0987.654.xxx',
      cargoType: expressCargoType,
      weight: `${expressWeight || '0.0'} kg`,
      budget: Number(expressBudget) || 200000,
      status: 'Chờ ghép xe',
      createdAt: 'Vừa xong',
      note: `Kích thước: ${expressDimensions || 'N/A'} cm • Phương tiện: ${expressVehicle === 'truck' ? 'Xe tải' : 'Xe van'}`
    };

    onSubmit(newReq);
    
    // reset form fields
    setExpressCargoType('Hàng tiêu dùng');
    setExpressWeight('');
    setExpressDimensions('');
    setExpressVehicle('truck');
    setExpressDate('');
    setExpressBudget(200000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto text-left">
        
        {/* Modal Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-6 w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3 mb-2">Tạo yêu cầu gửi hàng</h3>
          
          {/* pickupAddress */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Địa điểm lấy hàng</label>
            <div className="relative">
              <input 
                type="text" 
                value={expressFrom}
                onChange={(e) => setExpressFrom(e.target.value)}
                placeholder="Nhập địa chỉ lấy hàng..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* deliveryAddress */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Địa điểm giao hàng</label>
            <div className="relative">
              <input 
                type="text" 
                value={expressTo}
                onChange={(e) => setExpressTo(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>

          {/* cargoType */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Loại hàng hóa</label>
            <select 
              value={expressCargoType}
              onChange={(e) => setExpressCargoType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-colors"
            >
              <option value="Hàng tiêu dùng">Hàng tiêu dùng</option>
              <option value="Đồ điện tử">Đồ điện tử</option>
              <option value="Trái cây / Thực phẩm">Trái cây / Thực phẩm</option>
              <option value="Hàng cồng kềnh">Hàng cồng kềnh</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Weight & Dimensions Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Khối lượng (KG)</label>
              <input 
                type="number" 
                value={expressWeight}
                onChange={(e) => setExpressWeight(e.target.value)}
                placeholder="0.0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Kích thước (D-R-C)</label>
              <input 
                type="text" 
                value={expressDimensions}
                onChange={(e) => setExpressDimensions(e.target.value)}
                placeholder="cm"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* preferredVehicle Selection */}
          <div className="flex flex-col gap-2 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Phương tiện ưu tiên</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Truck Option */}
              <button
                type="button"
                onClick={() => setExpressVehicle('truck')}
                className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${
                  expressVehicle === 'truck'
                    ? 'bg-[#5cfc9b] text-slate-900 border-[#5cfc9b] font-black shadow-md'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h10zm0 0h6l3-3v-3a1 1 0 00-1-1h-2v-3a1 1 0 00-1-1h-6v11z" />
                </svg>
                <span className="text-xs uppercase tracking-wide">Truck</span>
              </button>
              {/* Van Option */}
              <button
                type="button"
                onClick={() => setExpressVehicle('van')}
                className={`flex flex-col items-center justify-center py-4 border rounded-2xl transition-all cursor-pointer ${
                  expressVehicle === 'van'
                    ? 'bg-[#5cfc9b] text-slate-900 border-[#5cfc9b] font-black shadow-md'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="6" width="18" height="10" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18M7 6v5M17 6v5" />
                </svg>
                <span className="text-xs uppercase tracking-wide">Van</span>
              </button>
            </div>
          </div>

          {/* shippingDate & budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Ngày vận chuyển</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={expressDate}
                  onChange={(e) => setExpressDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                  required
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Ngân sách đề xuất (đ)</label>
              <input 
                type="number" 
                value={expressBudget}
                onChange={(e) => setExpressBudget(e.target.value)}
                placeholder="Ví dụ: 200000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="bg-slate-950 hover:bg-black text-white text-sm font-black py-4 rounded-2xl w-full cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all mt-4 text-center uppercase tracking-wider"
          >
            Tạo yêu cầu gửi hàng
          </button>
        </form>
      </div>
    </div>
  );
};
