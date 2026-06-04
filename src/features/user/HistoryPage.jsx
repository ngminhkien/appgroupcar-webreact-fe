import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyBusBookingsApi } from '@/services/busBookingService';
import { getMyBookingsApi } from '@/services/offerService';
import { getMyShipmentsApi, getMyShipmentRequestsApi } from '@/services/shipmentService';
import { getMyRideRequestsApi } from '@/services/rideRequestService';

// Adapter mappers to transform API response models into local UI formats
const mapBusBooking = (item) => {
  const isCancelled = item.status === 3 || item.status === 'Cancelled';
  const isCompleted = item.status === 2 || item.status === 'Confirmed' || item.status === 'completed';
  return {
    id: item.bookingId || item.id,
    ticketCode: item.ticketCode || `BUS-${String(item.bookingId || item.id).substring(0, 6).toUpperCase()}`,
    operator: item.showtime?.busRoute?.company?.name || item.operator || 'Hải Âu VIP',
    from: item.startPoint?.locationName || item.showtime?.busRoute?.departurePoint || item.from || 'Chưa xác định',
    to: item.endPoint?.locationName || item.showtime?.busRoute?.destinationPoint || item.to || 'Chưa xác định',
    date: item.departureDate || item.showtime?.departureDate || item.date || '--',
    time: item.departureTime || item.showtime?.departureTime || item.time || '--',
    seat: item.seatCount !== undefined ? item.seatCount : (Array.isArray(item.seatNumbers) ? item.seatNumbers.join(', ') : (item.seat || 'Chưa chọn')),
    price: item.totalPrice || item.price || 0,
    status: isCancelled ? 'cancelled' : (isCompleted ? 'completed' : 'active'),
    statusLabel: isCancelled ? 'Đã hủy' : (isCompleted ? 'Hoàn thành' : 'Đang chạy'),
    duration: item.showtime?.busRoute?.duration || '--',
    vehicleType: item.showtime?.vehicleType || 'Limousine VIP',
    note: item.note || ''
  };
};

const mapCarpoolBooking = (item) => {
  const isCancelled = item.status === 3 || item.status === 'Cancelled';
  const isCompleted = item.status === 2 || item.status === 'Confirmed' || item.status === 'completed';

  // Format departureDate e.g. "2026-06-02T15:47:15.694" into date and time
  let dateVal = '--';
  let timeVal = '--';
  if (item.departureDate) {
    const parts = item.departureDate.split('T');
    dateVal = parts[0];
    if (parts[1]) {
      timeVal = parts[1].substring(0, 5);
    }
  }

  // extract pickup & dropoff names from routePoints or items array
  let fromLoc = 'Chưa xác định';
  let toLoc = 'Chưa xác định';
  if (Array.isArray(item.routePoints) && item.routePoints.length > 0) {
    const startPoint = item.routePoints.find(pt => pt.stopType === 'Start') || item.routePoints[0];
    const endPoint = item.routePoints.find(pt => pt.stopType === 'End') || item.routePoints[item.routePoints.length - 1];
    fromLoc = startPoint?.locationName || fromLoc;
    toLoc = endPoint?.locationName || toLoc;
  } else if (Array.isArray(item.items) && item.items.length > 0) {
    const firstItem = item.items[0];
    fromLoc = firstItem.pickupLocation?.name || firstItem.pickupLocationName || fromLoc;
    toLoc = firstItem.dropoffLocation?.name || firstItem.dropoffLocationName || toLoc;
  }

  return {
    id: item.bookingId || item.id,
    requestCode: item.requestCode || `REQ-CP-${String(item.bookingId || item.id).substring(0, 6).toUpperCase()}`,
    driverName: item.driverName === 'string' ? 'Chờ ghép...' : (item.driverName || 'Chờ ghép...'),
    driverPhone: item.driverPhone || '',
    licensePlate: item.vehicleBrand === 'string' ? '' : (item.vehicleBrand || ''),
    from: item.from || fromLoc,
    to: item.to || toLoc,
    date: item.date || dateVal,
    timeWindow: item.timeWindow || timeVal,
    seatsNeeded: item.quantity || item.seatsNeeded || 1,
    budget: item.totalPrice || item.price || item.budget || 0,
    status: isCancelled ? 'cancelled' : (isCompleted ? 'completed' : 'active'),
    statusLabel: isCancelled ? 'Đã hủy' : (isCompleted ? 'Hoàn thành' : 'Đang chạy'),
    note: item.note || ''
  };
};

const mapCargoBooking = (item) => {
  const isCancelled = item.status === 4 || item.status === 'Cancelled';
  const isCompleted = item.status === 3 || item.status === 'Delivered' || item.status === 'completed';
  return {
    id: item.id,
    cargoCode: item.cargoCode || `EX-CG${String(item.id).substring(0, 6).toUpperCase()}`,
    from: item.shipmentRequest?.pickupLocation?.name || item.from || 'Chưa xác định',
    to: item.shipmentRequest?.dropoffLocation?.name || item.to || 'Chưa xác định',
    date: item.shipmentRequest?.deliveryDate || item.date || '--',
    cargoType: item.shipmentRequest?.description || item.cargoType || 'Hàng hóa',
    weight: item.shipmentRequest?.weight ? `${item.shipmentRequest.weight} kg` : (item.weight || '--'),
    dimensions: item.shipmentRequest?.dimensions || item.dimensions || '--',
    budget: item.price || item.budget || 0,
    recipientName: item.shipmentRequest?.recipientName || item.recipientName || 'Người nhận',
    recipientPhone: item.shipmentRequest?.recipientPhone || item.recipientPhone || '',
    status: isCancelled ? 'cancelled' : (isCompleted ? 'completed' : 'active'),
    statusLabel: isCancelled ? 'Đã hủy' : (isCompleted ? 'Hoàn thành' : 'Đang chạy'),
    note: item.shipmentRequest?.handlingNote || item.note || ''
  };
};

const mapCarpoolRequest = (item) => {
  const isCancelled = item.status === 3 || item.status === 'Cancelled';
  const isMatched = item.status === 2 || item.status === 'Matched' || item.status === 'matched';
  return {
    id: item.id,
    requestCode: item.requestCode || `REQ-CP${String(item.id).substring(0, 6).toUpperCase()}`,
    from: item.pickupLocation?.name || item.from || 'Chưa xác định',
    to: item.dropoffLocation?.name || item.to || 'Chưa xác định',
    date: item.departureDate || item.date || '--',
    timeWindow: item.departureTime || item.timeWindow || '--',
    seatsNeeded: item.seatsNeeded || 1,
    budget: item.proposedPrice || item.budget || 0,
    status: isCancelled ? 'cancelled' : (isMatched ? 'matched' : 'open'),
    statusLabel: isCancelled ? 'Đã hủy' : (isMatched ? 'Đã ghép xe' : 'Chờ ghép xe'),
    note: item.note || ''
  };
};

const mapCargoRequest = (item) => {
  const isCancelled = item.status === 2 || item.status === 'Cancelled';
  const isOpen = item.status === 1 || item.status === 'Open';
  return {
    id: item.id,
    cargoCode: item.cargoCode || `REQ-CG${String(item.id).substring(0, 6).toUpperCase()}`,
    from: item.pickupLocation?.name || item.from || 'Chưa xác định',
    to: item.dropoffLocation?.name || item.to || 'Chưa xác định',
    date: item.deliveryDate || item.date || '--',
    cargoType: item.description || item.cargoType || 'Hàng hóa',
    weight: item.weight ? `${item.weight} kg` : (item.weight || '--'),
    dimensions: item.dimensions || '--',
    budget: item.proposedPrice || item.budget || 0,
    status: isCancelled ? 'cancelled' : (isOpen ? 'open' : 'matched'),
    statusLabel: isCancelled ? 'Đã hủy' : (isOpen ? 'Chờ ghép xe' : 'Đã ghép xe'),
    note: item.handlingNote || item.note || ''
  };
};

const HistoryPage = () => {
  // Main Tab: 'booking' (Lịch sử đặt vé) | 'requests' (Lịch sử tạo yêu cầu)
  const [mainTab, setMainTab] = useState('booking');

  // Service Tabs inside Booking
  const [bookingTab, setBookingTab] = useState('bus'); // 'bus' | 'carpool' | 'cargo'

  // Service Tabs inside Requests
  const [requestTab, setRequestTab] = useState('carpool'); // 'carpool' | 'cargo'

  // Shared Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Bus Bookings
  const { data: busBookings = [], isLoading: isLoadingBus } = useQuery({
    queryKey: ['myBusBookings'],
    queryFn: async () => {
      try {
        const response = await getMyBusBookingsApi();
        const data = response?.data || response;
        if (data && Array.isArray(data)) {
          return data.map(mapBusBooking);
        }
      } catch (err) {
        console.warn("Failed to fetch bus bookings", err);
      }
      return [];
    },
    staleTime: 30 * 1000,
  });

  // 2. Fetch Carpool Bookings
  const { data: carpoolBookings = [], isLoading: isLoadingCarpool } = useQuery({
    queryKey: ['myCarpoolBookings'],
    queryFn: async () => {
      try {
        const response = await getMyBookingsApi();
        const data = response?.data || response;
        if (data && Array.isArray(data)) {
          return data.map(mapCarpoolBooking);
        }
      } catch (err) {
        console.warn("Failed to fetch carpool bookings", err);
      }
      return [];
    },
    staleTime: 30 * 1000,
  });

  // 3. Fetch Shipment Bookings
  const { data: shipmentBookings = [], isLoading: isLoadingShipments } = useQuery({
    queryKey: ['myShipmentBookings'],
    queryFn: async () => {
      try {
        const response = await getMyShipmentsApi();
        const data = response?.data || response;
        if (data && Array.isArray(data)) {
          return data.map(mapCargoBooking);
        }
      } catch (err) {
        console.warn("Failed to fetch shipment bookings", err);
      }
      return [];
    },
    staleTime: 30 * 1000,
  });

  // 4. Fetch Ride Requests
  const { data: rideRequests = [], isLoading: isLoadingRideRequests } = useQuery({
    queryKey: ['myRideRequests'],
    queryFn: async () => {
      try {
        const response = await getMyRideRequestsApi();
        const data = response?.data || response;
        if (data && Array.isArray(data)) {
          return data.map(mapCarpoolRequest);
        }
      } catch (err) {
        console.warn("Failed to fetch ride requests", err);
      }
      return [];
    },
    staleTime: 30 * 1000,
  });

  // 5. Fetch Shipment Requests
  const { data: shipmentRequests = [], isLoading: isLoadingShipmentRequests } = useQuery({
    queryKey: ['myShipmentRequests'],
    queryFn: async () => {
      try {
        const response = await getMyShipmentRequestsApi();
        const data = response?.data || response;
        if (data && Array.isArray(data)) {
          return data.map(mapCargoRequest);
        }
      } catch (err) {
        console.warn("Failed to fetch shipment requests", err);
      }
      return [];
    },
    staleTime: 30 * 1000,
  });

  // Global loading state for parallel API queries
  const isLoading = isLoadingBus || isLoadingCarpool || isLoadingShipments || isLoadingRideRequests || isLoadingShipmentRequests;

  // Active Service code
  const activeService = mainTab === 'booking' ? bookingTab : requestTab;

  // Filter Data
  const filteredData = useMemo(() => {
    let list = [];
    if (mainTab === 'booking') {
      if (bookingTab === 'bus') list = [...busBookings];
      else if (bookingTab === 'carpool') list = [...carpoolBookings];
      else if (bookingTab === 'cargo') list = [...shipmentBookings];
    } else {
      if (requestTab === 'carpool') list = [...rideRequests];
      else if (requestTab === 'cargo') list = [...shipmentRequests];
    }

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
  }, [mainTab, bookingTab, requestTab, statusFilter, searchTerm, busBookings, carpoolBookings, shipmentBookings, rideRequests, shipmentRequests]);

  return (
    <div className="bg-gray-200 min-h-[75vh] w-full py-10 px-4 sm:px-6 relative text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

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

        {/* Main Tab Toggle Selector */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 shrink-0 border border-slate-200/60 self-start">
          <button
            onClick={() => { setMainTab('booking'); setStatusFilter('all'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${mainTab === 'booking'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Lịch sử đặt vé
          </button>

          <button
            onClick={() => { setMainTab('requests'); setStatusFilter('all'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${mainTab === 'requests'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lịch sử tạo yêu cầu
          </button>
        </div>

        {/* ─── Tabs and Filters Area Card ─── */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/50 flex flex-col gap-5">

          {/* Sub-tabs and Filters Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

            {/* Sub-tabs selector for Booking */}
            {mainTab === 'booking' && (
              <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 shrink-0 border border-slate-200/60 self-start lg:self-auto">
                <button
                  onClick={() => { setBookingTab('bus'); setStatusFilter('all'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${bookingTab === 'bus'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  Vé xe khách
                </button>

                <button
                  onClick={() => { setBookingTab('carpool'); setStatusFilter('all'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${bookingTab === 'carpool'
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  Xe ghép / Đi chung
                </button>

                <button
                  onClick={() => { setBookingTab('cargo'); setStatusFilter('all'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${bookingTab === 'cargo'
                    ? 'bg-lime-600 text-white shadow-md shadow-lime-600/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  Gửi hàng nhanh
                </button>
              </div>
            )}

            {/* Sub-tabs selector for Requests */}
            {mainTab === 'requests' && (
              <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 shrink-0 border border-slate-200/60 self-start lg:self-auto">
                <button
                  onClick={() => { setRequestTab('carpool'); setStatusFilter('all'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${requestTab === 'carpool'
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  Yêu cầu xe ghép
                </button>

                <button
                  onClick={() => { setRequestTab('cargo'); setStatusFilter('all'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${requestTab === 'cargo'
                    ? 'bg-lime-600 text-white shadow-md shadow-lime-600/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  Yêu cầu gửi hàng
                </button>
              </div>
            )}

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
                  className={`bg-slate-100 border border-slate-200/80 text-slate-700 font-extrabold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none cursor-pointer text-xs select-none shadow-sm transition-all duration-200 hover:bg-slate-200/50 focus:bg-white ${activeService === 'bus'
                    ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : activeService === 'carpool'
                      ? 'focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20'
                    }`}
                >
                  <option value="all">Tất cả trạng thái</option>
                  {mainTab === 'booking' ? (
                    <>
                      <option value="completed">Đã hoàn thành</option>
                      {bookingTab === 'carpool' && <option value="active">Đang chạy</option>}
                      <option value="cancelled">Đã hủy</option>
                    </>
                  ) : (
                    <>
                      <option value="open">Chờ ghép xe</option>
                      <option value="matched">Đã ghép xe</option>
                      <option value="cancelled">Đã hủy</option>
                    </>
                  )}
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <svg className="animate-spin h-8 w-8 text-emerald-500 mb-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Đang tải dữ liệu lịch sử...</span>
              </div>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isCompleted = item.status === 'completed';
                const isActive = item.status === 'active';
                const isOpen = item.status === 'open';
                const isMatched = item.status === 'matched';
                const isCancelled = item.status === 'cancelled';

                return (
                  <div
                    key={item.id}
                    className={`w-full bg-[#dff0e1] rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row relative group pl-2.5 ${activeService === 'bus'
                      ? 'hover:border-emerald-300'
                      : activeService === 'carpool'
                        ? 'hover:border-green-300'
                        : 'hover:border-lime-300'
                      }`}
                  >
                    {/* Left vertical Accent line based on service */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${activeService === 'bus' ? 'bg-emerald-500' : activeService === 'carpool' ? 'bg-green-500' : 'bg-lime-500'
                      }`} />

                    {/* Card Content Wrapper */}
                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">

                      {/* Left Info Panel */}
                      <div className="flex-grow flex flex-col gap-3 text-left">
                        <div className="flex items-center gap-3">
                          {/* Code */}
                          {/* <span className="text-[10px] font-black tracking-wider uppercase bg-[#dff0e1] text-slate-600 py-1 px-2.5 rounded-md border border-slate-200/50">
                            {item.ticketCode || item.requestCode || item.cargoCode}
                          </span> */}

                          {/* Operator or Title */}
                          {mainTab === 'booking' ? (
                            <>
                              {bookingTab === 'bus' && (
                                <span className="font-extrabold text-slate-800 text-sm">{item.operator}</span>
                              )}
                              {bookingTab === 'carpool' && (
                                <span className="font-extrabold text-slate-800 text-sm">Tài xế: {item.driverName}</span>
                              )}
                              {bookingTab === 'cargo' && (
                                <span className="font-extrabold text-slate-800 text-sm">Người nhận: {item.recipientName}</span>
                              )}
                            </>
                          ) : (
                            <span className="font-extrabold text-slate-800 text-sm">
                              {requestTab === 'carpool' ? 'Yêu cầu xe ghép' : 'Yêu cầu gửi hàng'}
                            </span>
                          )}

                          {/* Glowing Status badge */}
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${isCompleted || isMatched
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isActive || isOpen
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
                        <div className="text-xs font-semibold text-slate-500 bg-[#dff0e1] rounded-xl p-3 flex flex-wrap gap-x-6 gap-y-2">
                          {activeService === 'bus' && (
                            <>
                              <span>Ngày đi: <strong className="text-slate-800">{item.date} • {item.time}</strong></span>
                              <span>Số ghế: <strong className="text-slate-800">{item.seat}</strong></span>
                              <span>Loại xe: <strong className="text-slate-800">{item.vehicleType}</strong></span>
                            </>
                          )}
                          {activeService === 'carpool' && (
                            <>
                              <span>Ngày đi: <strong className="text-slate-800">{item.date}</strong></span>
                              <span>Khung giờ: <strong className="text-slate-800">{item.timeWindow}</strong></span>
                              <span>Số khách: <strong className="text-slate-800">{item.seatsNeeded} người</strong></span>
                              {mainTab === 'booking' && item.licensePlate && (
                                <span>BKS: <strong className="text-slate-800">{item.licensePlate}</strong></span>
                              )}
                            </>
                          )}
                          {activeService === 'cargo' && (
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
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                            {mainTab === 'booking' ? 'Thanh toán:' : 'Ngân sách:'}
                          </span>
                          <span className="text-lg font-black text-emerald-600 block mt-0.5">
                            {(item.price || item.budget).toLocaleString()}đ
                          </span>
                        </div>

                        {/* Interactive CTAs */}
                        <div className="flex gap-2">
                          {mainTab === 'booking' ? (
                            <>
                              {isCompleted && (
                                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold py-2 px-3.5 rounded-lg border border-slate-200 transition-colors cursor-pointer">
                                  Đánh giá
                                </button>
                              )}
                              {!isCancelled ? (
                                <button className={`text-white text-[10px] font-black py-2 px-3.5 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer ${bookingTab === 'bus'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                                  : bookingTab === 'carpool'
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-600/10'
                                    : 'bg-lime-600 hover:bg-lime-700 shadow-lime-600/10'
                                  }`}>
                                  {bookingTab === 'cargo' ? 'Tra cứu' : 'Đặt lại'}
                                </button>
                              ) : (
                                <button className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black py-2 px-3.5 rounded-lg transition-all cursor-pointer">
                                  Mua lại vé
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold py-2 px-3.5 rounded-lg border border-slate-200 transition-colors cursor-pointer">
                                Chi tiết
                              </button>
                              {!isCancelled && (
                                <button className={`text-white text-[10px] font-black py-2 px-3.5 rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer ${requestTab === 'carpool'
                                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/10'
                                  : 'bg-lime-600 hover:bg-lime-700 shadow-lime-600/10'
                                  }`}>
                                  Chỉnh sửa
                                </button>
                              )}
                            </>
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
