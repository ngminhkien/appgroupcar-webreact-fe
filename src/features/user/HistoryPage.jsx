import React, { useState, useMemo } from 'react';

const MOCK_BUS_HISTORY = [
  {
    id: 'bus-1',
    ticketCode: 'BUS-HD928A',
    operator: 'Hải Âu VIP',
    from: 'Hà Nội (Bến xe Gia Lâm)',
    to: 'Hải Phòng (Bến xe Cầu Rào)',
    date: '2026-05-20',
    time: '14:00',
    seat: 'Ghế 08B (Tầng 1)',
    price: 250000,
    status: 'completed',
    statusLabel: 'Hoàn thành',
    duration: '1h 30m',
    vehicleType: 'Limousine 9 chỗ VIP'
  },
  {
    id: 'bus-2',
    ticketCode: 'BUS-HL482B',
    operator: 'Hoàng Long',
    from: 'Hà Nội (Bến xe Nước Ngầm)',
    to: 'Hải Phòng (Bến xe Niệm Nghĩa)',
    date: '2026-05-18',
    time: '08:30',
    seat: 'Ghế 12A (Tầng 2)',
    price: 180000,
    status: 'cancelled',
    statusLabel: 'Đã hủy',
    duration: '2h 00m',
    vehicleType: 'Xe giường nằm 40 chỗ'
  },
  {
    id: 'bus-3',
    ticketCode: 'BUS-AH105C',
    operator: 'Anh Huy Đất Cảng',
    from: 'Hà Nội (Bến xe Giáp Bát)',
    to: 'Hải Phòng (Bến xe Thượng Lý)',
    date: '2026-05-10',
    time: '17:30',
    seat: 'Ghế 04C (Tầng 1)',
    price: 230000,
    status: 'completed',
    statusLabel: 'Hoàn thành',
    duration: '1h 45m',
    vehicleType: 'Limousine 9 chỗ VIP'
  }
];

const MOCK_CARPOOL_HISTORY = [
  {
    id: 'carpool-1',
    requestCode: 'REQ-CP8831',
    driverName: 'Nguyễn Văn Hùng',
    driverPhone: '0912.834.xxx',
    licensePlate: '29A-888.88',
    from: 'Hà Nội (Cầu Giấy)',
    to: 'Nam Định (TP. Nam Định)',
    date: '2026-05-24',
    timeWindow: 'Chiều (12:00 - 18:00)',
    seatsNeeded: 2,
    budget: 150000,
    status: 'active',
    statusLabel: 'Đang chạy',
    note: 'Có mang theo 1 vali to. Cần xe đón khu vực Cầu Giấy.'
  },
  {
    id: 'carpool-2',
    requestCode: 'REQ-CP4492',
    driverName: 'Lê Thanh Tuấn',
    driverPhone: '0983.472.xxx',
    licensePlate: '15A-342.92',
    from: 'Hà Nội (Bến xe Mỹ Đình)',
    to: 'Hải Phòng (Lạch Tray)',
    date: '2026-05-15',
    timeWindow: 'Sáng (06:00 - 12:00)',
    seatsNeeded: 1,
    budget: 130000,
    status: 'completed',
    statusLabel: 'Hoàn thành',
    note: 'Đi xe không mùi thuốc lá.'
  }
];

const MOCK_CARGO_HISTORY = [
  {
    id: 'cargo-1',
    cargoCode: 'EX-CG1082',
    from: 'Hà Nội (Hoàng Mai)',
    to: 'Hải Phòng (Hồng Bàng)',
    date: '2026-05-22',
    cargoType: 'Trái cây (thùng xốp)',
    weight: '80 kg',
    dimensions: '60x40x40 cm',
    budget: 200000,
    recipientName: 'Trần Văn An',
    recipientPhone: '0904.582.xxx',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    note: 'Hàng dễ vỡ, cần vận chuyển mát tránh dập nát.'
  },
  {
    id: 'cargo-2',
    cargoCode: 'EX-CG4902',
    from: 'Hà Nội (Đống Đa)',
    to: 'Quảng Ninh (Hạ Long)',
    date: '2026-05-12',
    cargoType: 'Tài liệu mật và phụ tùng máy',
    weight: '2 kg',
    dimensions: '30x20x10 cm',
    budget: 120000,
    recipientName: 'Phạm Thanh Thảo',
    recipientPhone: '0977.102.xxx',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    note: 'Giao gấp trong buổi sáng tại Văn phòng Hạ Long.'
  }
];

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('bus'); // 'bus' | 'carpool' | 'cargo'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'active' | 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate Stats
  const stats = useMemo(() => {
    const totalBus = MOCK_BUS_HISTORY.length;
    const completedBus = MOCK_BUS_HISTORY.filter(b => b.status === 'completed').length;
    const busRevenue = MOCK_BUS_HISTORY.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);

    const totalCarpool = MOCK_CARPOOL_HISTORY.length;
    const activeCarpool = MOCK_CARPOOL_HISTORY.filter(c => c.status === 'active').length;
    const carpoolRevenue = MOCK_CARPOOL_HISTORY.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.budget, 0);

    const totalCargo = MOCK_CARGO_HISTORY.length;
    const cargoRevenue = MOCK_CARGO_HISTORY.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.budget, 0);

    return {
      bus: { count: totalBus, completed: completedBus, spent: busRevenue },
      carpool: { count: totalCarpool, active: activeCarpool, spent: carpoolRevenue },
      cargo: { count: totalCargo, spent: cargoRevenue }
    };
  }, []);

  // 2. Filter Lists
  const filteredData = useMemo(() => {
    let list = [];
    if (activeTab === 'bus') list = [...MOCK_BUS_HISTORY];
    else if (activeTab === 'carpool') list = [...MOCK_CARPOOL_HISTORY];
    else if (activeTab === 'cargo') list = [...MOCK_CARGO_HISTORY];

    // Filter by status
    if (statusFilter !== 'all') {
      list = list.filter(item => item.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(item =>
        item.from.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q) ||
        (item.operator && item.operator.toLowerCase().includes(q)) ||
        (item.driverName && item.driverName.toLowerCase().includes(q)) ||
        (item.cargoType && item.cargoType.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeTab, statusFilter, searchTerm]);

  return (
    <div className="bg-gray-200 min-h-[75vh] w-full py-10 px-4 sm:px-6 relative text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <svg className="w-8 h-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Lịch sử hoạt động
            </h1>
            <p className="text-slate-700 text-sm font-semibold mt-1">Quản lý và theo dõi hành trình đặt vé, xe ghép hoặc gửi hàng của bạn.</p>
          </div>
        </div>

        {/* ─── Stats Dashboard ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Bus Booking Stats */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 shadow-lg border border-emerald-400/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-125 transition-transform duration-500">
              <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 11h2a2 2 0 012 2v3a2 2 0 01-2 2h-2v3h-2v-3H8v3H6v-3H4a2 2 0 01-2-2v-3c0-1.1.9-2 2-2h2V6c0-1.1.9-2 2-2h8a2 2 0 012 2v5zM6 14h12V6a1 1 0 00-1-1H7a1 1 0 00-1 1v8zm2 2a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Đặt vé xe khách</span>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="text-3xl font-black mb-1">{stats.bus.count} lượt đặt</div>
            <div className="text-xs font-semibold text-emerald-100 flex items-center gap-1.5">
              <span>Đã hoàn thành: {stats.bus.completed}</span>
              <span>•</span>
              <span>Đã tiêu dùng: {stats.bus.spent.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Card 2: Carpool Stats */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-800 text-white rounded-3xl p-6 shadow-lg border border-green-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-125 transition-transform duration-500">
              <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Rideshare / Xe ghép</span>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-.001h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-3xl font-black mb-1">{stats.carpool.count} yêu cầu</div>
            <div className="text-xs font-semibold text-green-100 flex items-center gap-1.5">
              <span>Đang chạy: {stats.carpool.active}</span>
              <span>•</span>
              <span>Chi tiêu: {stats.carpool.spent.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Card 3: Express Stats */}
          <div className="bg-gradient-to-br from-lime-600 to-green-700 text-white rounded-3xl p-6 shadow-lg border border-lime-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-125 transition-transform duration-500">
              <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8l-8 5-8-5V6l8 5 8-5v2zm0-4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">Gửi hàng nhanh</span>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-3xl font-black mb-1">{stats.cargo.count} đơn hàng</div>
            <div className="text-xs font-semibold text-lime-100 flex items-center gap-1.5">
              <span>Chi phí tích lũy: {stats.cargo.spent.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* ─── Tabs and Filters Area ─── */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/50 flex flex-col gap-5">

          {/* Tabs and Filters Grid */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            {/* 3 Dedicated Service Tabs */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 shrink-0 border border-slate-200/60 self-start lg:self-auto">
              <button
                onClick={() => { setActiveTab('bus'); setStatusFilter('all'); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${activeTab === 'bus'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Vé xe khách
              </button>

              <button
                onClick={() => { setActiveTab('carpool'); setStatusFilter('all'); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${activeTab === 'carpool'
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-.001h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Xe ghép / Đi chung
              </button>

              <button
                onClick={() => { setActiveTab('cargo'); setStatusFilter('all'); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${activeTab === 'cargo'
                  ? 'bg-lime-600 text-white shadow-md shadow-lime-600/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Gửi hàng nhanh
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:justify-end">

              {/* Search input */}
              <div className="relative flex-grow max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm điểm đi, điểm đến..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200/80 rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Select dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`bg-slate-100 border border-slate-200/80 text-slate-700 font-extrabold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none cursor-pointer text-xs select-none shadow-sm transition-all duration-200 hover:bg-slate-200/50 focus:bg-white ${activeTab === 'bus'
                    ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : activeTab === 'carpool'
                      ? 'focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20'
                    }`}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="completed">Đã hoàn thành</option>
                  {activeTab === 'carpool' && <option value="active">Đang chạy</option>}
                  <option value="cancelled">Đã hủy</option>
                </select>
                <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

            </div>

          </div>

          {/* ─── List of History Cards ─── */}
          <div className="flex flex-col gap-4 mt-2">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isCompleted = item.status === 'completed';
                const isActive = item.status === 'active';
                const isCancelled = item.status === 'cancelled';

                return (
                  <div
                    key={item.id}
                    className={`w-full bg-[#dff0e1] rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row relative group pl-2.5 ${activeTab === 'bus'
                      ? 'hover:border-emerald-300'
                      : activeTab === 'carpool'
                        ? 'hover:border-green-300'
                        : 'hover:border-lime-300'
                      }`}
                  >
                    {/* Left vertical Accent line based on service */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${activeTab === 'bus' ? 'bg-emerald-500' : activeTab === 'carpool' ? 'bg-green-500' : 'bg-lime-500'
                      }`} />

                    {/* Card Content Wrapper */}
                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">

                      {/* Left Info Panel */}
                      <div className="flex-grow flex flex-col gap-3 text-left">
                        <div className="flex items-center gap-3">
                          {/* Code */}
                          <span className="text-[10px] font-black tracking-wider uppercase bg-[#dff0e1] text-slate-600 py-1 px-2.5 rounded-md border border-slate-200/50">
                            {item.ticketCode || item.requestCode || item.cargoCode}
                          </span>

                          {/* Operator or Driver Title */}
                          {activeTab === 'bus' && (
                            <span className="font-extrabold text-slate-800 text-sm">{item.operator}</span>
                          )}
                          {activeTab === 'carpool' && (
                            <span className="font-extrabold text-slate-800 text-sm">Tài xế: {item.driverName || 'Chờ ghép...'}</span>
                          )}
                          {activeTab === 'cargo' && (
                            <span className="font-extrabold text-slate-800 text-sm">Người nhận: {item.recipientName}</span>
                          )}

                          {/* Glowing Status badge */}
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isActive
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                            {item.statusLabel}
                          </span>
                        </div>

                        {/* Route Locations */}
                        <div className="flex items-center gap-3 my-1 flex-wrap">
                          <span className="text-sm font-extrabold text-slate-900">{item.from}</span>
                          <span className="text-slate-400 text-xs select-none">➔</span>
                          <span className="text-sm font-extrabold text-slate-900">{item.to}</span>
                        </div>

                        {/* Service Specific details */}
                        <div className="text-xs font-semibold text-slate-500 bg[#dff0e1]  rounded-xl p-3 flex flex-wrap gap-x-6 gap-y-2">
                          {activeTab === 'bus' && (
                            <>
                              <span>Ngày đi: <strong className="text-slate-800">{item.date} • {item.time}</strong></span>
                              <span>Chỗ: <strong className="text-slate-800">{item.seat}</strong></span>
                              <span>Loại xe: <strong className="text-slate-800">{item.vehicleType}</strong></span>
                            </>
                          )}
                          {activeTab === 'carpool' && (
                            <>
                              <span>Ngày đi: <strong className="text-slate-800">{item.date}</strong></span>
                              <span>Khung giờ: <strong className="text-slate-800">{item.timeWindow}</strong></span>
                              <span>Số khách: <strong className="text-slate-800">{item.seatsNeeded} người</strong></span>
                              {item.licensePlate && <span>BKS: <strong className="text-slate-800">{item.licensePlate}</strong></span>}
                            </>
                          )}
                          {activeTab === 'cargo' && (
                            <>
                              <span>Ngày gửi: <strong className="text-slate-800">{item.date}</strong></span>
                              <span>Hàng hóa: <strong className="text-slate-800">{item.cargoType}</strong></span>
                              <span>Khối lượng: <strong className="text-slate-800">{item.weight} ({item.dimensions})</strong></span>
                            </>
                          )}
                        </div>

                        {/* Notes if present */}
                        {item.note && (
                          <p className="text-[11px] italic text-slate-400 font-medium leading-relaxed mt-1">
                            Lưu ý: &ldquo;{item.note}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Right CTA and Price Panel */}
                      <div className="shrink-0 flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 sm:w-40 sm:text-right sm:border-l border-slate-100 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Thanh toán:</span>
                          <span className="text-lg font-black text-emerald-600 block mt-0.5">
                            {(item.price || item.budget).toLocaleString()}đ
                          </span>
                        </div>

                        {/* Interactive CTAs */}
                        <div className="flex gap-2">
                          {isCompleted && (
                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold py-2 px-3.5 rounded-lg border border-slate-200 transition-colors cursor-pointer">
                              Đánh giá
                            </button>
                          )}
                          {!isCancelled ? (
                            <button className={`text-white text-[10px] font-black py-2 px-3.5 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer ${activeTab === 'bus'
                              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                              : activeTab === 'carpool'
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/10'
                                : 'bg-lime-600 hover:bg-lime-700 shadow-lime-600/10'
                              }`}>
                              {activeTab === 'cargo' ? 'Tra cứu' : 'Đặt lại'}
                            </button>
                          ) : (
                            <button className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black py-2 px-3.5 rounded-lg transition-all cursor-pointer">
                              Mua lại vé
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-slate-500 font-bold text-sm">Không tìm thấy bản ghi lịch sử nào khớp với bộ lọc.</p>
                <button
                  onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                  className="mt-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default HistoryPage;
