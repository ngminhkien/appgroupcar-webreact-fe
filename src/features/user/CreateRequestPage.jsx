import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RequestCard, CarpoolRequestModal, ExpressRequestModal } from '@/components/UserPublicLayout';
import toast from 'react-hot-toast';
import { getLocationsApi } from '@/services/locationService';
import { getRideRequestsApi, createRideRequestApi } from '@/services/rideRequestService';
import { getShipmentRequestsApi, createShipmentRequestApi } from '@/services/shipmentService';

const getTodayString = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const CreateRequestPage = () => {
  const [serviceCode, setServiceCode] = useState('carpool');

  const handleTabChange = (code) => {
    setServiceCode(code);
  };

  // Search Bar States
  const [fromCity, setFromCity] = useState(localStorage.getItem('request_fromCity') || '');
  const [toCity, setToCity] = useState(localStorage.getItem('request_toCity') || '');
  const [fromLocationId, setFromLocationId] = useState(localStorage.getItem('request_fromLocationId') || '');
  const [toLocationId, setToLocationId] = useState(localStorage.getItem('request_toLocationId') || '');
  const [departureDate, setDepartureDate] = useState(getTodayString());
  const [timeRange, setTimeRange] = useState('all');

  // Autocomplete Suggestions States
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [isFromLoading, setIsFromLoading] = useState(false);

  const [toSuggestions, setToSuggestions] = useState([]);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isToLoading, setIsToLoading] = useState(false);

  const lastSelectedFromRef = useRef(localStorage.getItem('request_fromCity') || '');
  const lastSelectedToRef = useRef(localStorage.getItem('request_toCity') || '');
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // Requests state list
  const [requests, setRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced suggestions for fromCity
  useEffect(() => {
    if (!fromCity.trim()) {
      setFromSuggestions([]);
      setShowFromDropdown(false);
      setFromLocationId('');
      localStorage.removeItem('request_fromCity');
      localStorage.removeItem('request_fromLocationId');
      return;
    }
    if (fromCity.trim() === lastSelectedFromRef.current) return;

    const timer = setTimeout(async () => {
      setIsFromLoading(true);
      try {
        const res = await getLocationsApi({ query: fromCity.trim(), PageNumber: 1, PageSize: 10 });
        const items = res?.data?.items || res?.data || res || [];
        setFromSuggestions(Array.isArray(items) ? items : []);
        setShowFromDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFromLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fromCity]);

  // Debounced suggestions for toCity
  useEffect(() => {
    if (!toCity.trim()) {
      setToSuggestions([]);
      setShowToDropdown(false);
      setToLocationId('');
      localStorage.removeItem('request_toCity');
      localStorage.removeItem('request_toLocationId');
      return;
    }
    if (toCity.trim() === lastSelectedToRef.current) return;

    const timer = setTimeout(async () => {
      setIsToLoading(true);
      try {
        const res = await getLocationsApi({ query: toCity.trim(), PageNumber: 1, PageSize: 10 });
        const items = res?.data?.items || res?.data || res || [];
        setToSuggestions(Array.isArray(items) ? items : []);
        setShowToDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsToLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [toCity]);

  // API Call to fetch requests
  const fetchRequests = async (searchParamsOverride = {}) => {
    const fCity = searchParamsOverride.hasOwnProperty('FromCity') ? searchParamsOverride.FromCity : fromCity;
    const tCity = searchParamsOverride.hasOwnProperty('ToCity') ? searchParamsOverride.ToCity : toCity;
    const fLocId = searchParamsOverride.hasOwnProperty('FromLocationId') ? searchParamsOverride.FromLocationId : fromLocationId;
    const tLocId = searchParamsOverride.hasOwnProperty('ToLocationId') ? searchParamsOverride.ToLocationId : toLocationId;

    if (!fCity.trim() && !tCity.trim() && !fLocId && !tLocId) {
      toast.error('Vui lòng nhập điểm đi hoặc điểm đến để bắt đầu tìm kiếm.');
      return;
    }

    setIsLoadingRequests(true);
    try {
      const pageNumber = searchParamsOverride.hasOwnProperty('PageNumber') ? searchParamsOverride.PageNumber : 1;
      const pageSize = 10;

      const dateStr = searchParamsOverride.hasOwnProperty('DepartureDate') ? searchParamsOverride.DepartureDate : departureDate;
      const rangeStr = searchParamsOverride.hasOwnProperty('TimeRange') ? searchParamsOverride.TimeRange : timeRange;

      let fTime = undefined;
      let tTime = undefined;

      if (dateStr) {
        if (rangeStr === 'all') {
          fTime = `${dateStr}T00:00:00`;
          tTime = `${dateStr}T23:59:59`;
        } else if (rangeStr === 'morning') {
          fTime = `${dateStr}T06:00:00`;
          tTime = `${dateStr}T12:00:00`;
        } else if (rangeStr === 'afternoon') {
          fTime = `${dateStr}T12:00:00`;
          tTime = `${dateStr}T18:00:00`;
        } else if (rangeStr === 'evening') {
          fTime = `${dateStr}T18:00:00`;
          tTime = `${dateStr}T23:59:59`;
        } else if (rangeStr === 'night') {
          fTime = `${dateStr}T00:00:00`;
          tTime = `${dateStr}T06:00:00`;
        }
      }

      const params = {
        FromLocationId: fLocId || undefined,
        ToLocationId: tLocId || undefined,
        FromTime: fTime || undefined,
        ToTime: tTime || undefined,
        PageNumber: pageNumber,
        PageSize: pageSize
      };

      let responseData;
      if (serviceCode === 'carpool') {
        responseData = await getRideRequestsApi(params);
      } else {
        responseData = await getShipmentRequestsApi(params);
      }

      const items = responseData?.data?.items || responseData?.data || responseData?.items || responseData || [];
      if (Array.isArray(items)) {
        const mapped = items.map(item => {
          if (serviceCode === 'carpool') {
            return {
              id: item.id || Math.random().toString(),
              type: 'carpool',
              serviceLabel: 'Xe ghép',
              customerId: item.customer?.id || item.customerId || null,
              from: item.fromLocation?.name || item.fromLocation?.displayName || item.pickupLocation?.name || item.from || 'Chưa xác định',
              to: item.toLocation?.name || item.toLocation?.displayName || item.dropoffLocation?.name || item.to || 'Chưa xác định',
              date: item.desiredDepartureTime ? item.desiredDepartureTime.split('T')[0] : (item.departureDate ? item.departureDate.split('T')[0] : '--'),
              timeWindow: item.desiredDepartureTime ? item.desiredDepartureTime.split('T')[1]?.substring(0, 5) : (item.departureTime || '--'),
              passengerName: item.customer?.fullName || item.customer?.name || 'Khách hàng',
              passengerPhone: item.customer?.phoneNumber || item.customer?.phone || '098*.***.***',
              seatsNeeded: item.seatsRequired || item.seatsNeeded || 1,
              budget: item.proposedPrice || item.budget || null,
              status: item.status === 2 ? 'Đã ghép xe' : (item.status === 3 ? 'Đã hủy' : 'Đang đợi xe'),
              createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Vừa xong',
              note: item.note || ''
            };
          } else {
            return {
              id: item.id || Math.random().toString(),
              type: 'express',
              serviceLabel: 'Gửi hàng',
              customerId: item.customer?.id || item.customerId || null,
              from: item.pickupLocation?.name || item.pickupLocation?.displayName || item.from || 'Chưa xác định',
              to: item.dropoffLocation?.name || item.dropoffLocation?.displayName || item.to || 'Chưa xác định',
              date: item.deliveryDate ? item.deliveryDate.split('T')[0] : (item.date || '--'),
              timeWindow: item.deliveryDate ? item.deliveryDate.split('T')[1]?.substring(0, 5) : (item.deliveryTime || '--'),
              passengerName: item.customer?.fullName || item.customer?.name || 'Khách hàng',
              passengerPhone: item.customer?.phoneNumber || item.customer?.phone || '098*.***.***',
              cargoType: item.description || item.cargoType || 'Hàng hóa',
              weight: item.weight ? `${item.weight} kg` : '--',
              budget: item.proposedPrice || item.budget || null,
              status: item.status === 2 ? 'Đã ghép xe' : (item.status === 3 ? 'Đã hủy' : 'Chờ ghép xe'),
              createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Vừa xong',
              note: item.handlingNote || item.note || ''
            };
          }
        });
        setRequests(mapped);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Sync tab change and initial load
  useEffect(() => {
    const storedFromCity = localStorage.getItem('request_fromCity') || '';
    const storedFromId = localStorage.getItem('request_fromLocationId') || '';
    const storedToCity = localStorage.getItem('request_toCity') || '';
    const storedToId = localStorage.getItem('request_toLocationId') || '';

    setFromCity(storedFromCity);
    setFromLocationId(storedFromId);
    setToCity(storedToCity);
    setToLocationId(storedToId);
    setDepartureDate(getTodayString());
    setTimeRange('all');
    lastSelectedFromRef.current = storedFromCity;
    lastSelectedToRef.current = storedToCity;

    if (storedFromCity.trim() || storedToCity.trim() || storedFromId || storedToId) {
      fetchRequests({
        FromCity: storedFromCity,
        ToCity: storedToCity,
        FromLocationId: storedFromId,
        ToLocationId: storedToId
      });
    } else {
      setRequests([]);
    }
  }, [serviceCode]);

  // Modal & Toast States
  const [showModal, setShowModal] = useState(false);

  const [sortBy, setSortBy] = useState('early');

  const allRequests = useMemo(() => {
    return requests.filter(req => req.type === serviceCode);
  }, [requests, serviceCode]);

  // Handle Reset Search
  const handleResetSearch = () => {
    setFromCity('');
    setToCity('');
    setFromLocationId('');
    setToLocationId('');
    localStorage.removeItem('request_fromCity');
    localStorage.removeItem('request_fromLocationId');
    localStorage.removeItem('request_toCity');
    localStorage.removeItem('request_toLocationId');
    setDepartureDate(getTodayString());
    setTimeRange('all');
    lastSelectedFromRef.current = '';
    lastSelectedToRef.current = '';
    setRequests([]);
    setSortBy('early');
  };

  // Submit handler when child modal invokes submit
  const handleAddRequest = async (newRequest) => {
    try {
      if (newRequest.type === 'carpool') {
        const apiData = {
          fromLocationId: newRequest.fromLocationId,
          toLocationId: newRequest.toLocationId,
          desiredDepartureTime: `${newRequest.date}T${newRequest.time || '12:00:00'}`,
          seatsRequired: Number(newRequest.seatsRequired)
        };
        await createRideRequestApi(apiData);
      } else {
        const formData = new FormData();
        formData.append('PickupLocationId', newRequest.fromLocationId);
        formData.append('DropoffLocationId', newRequest.toLocationId);
        formData.append('DeliveryDate', `${newRequest.date}T12:00:00`);
        formData.append('Weight', parseFloat(newRequest.weight) || 0);
        formData.append('Volume', parseFloat(newRequest.volume) || 0);
        formData.append('Description', newRequest.description);
        formData.append('IsFragile', newRequest.isFragile);
        formData.append('HandlingNote', newRequest.handlingNote || '');
        if (newRequest.imageFile) {
          formData.append('ImageUrl', newRequest.imageFile);
        }
        await createShipmentRequestApi(formData);
      }

      setShowModal(false);
      toast.success(`Tạo yêu cầu ${newRequest.serviceLabel.toLowerCase()} thành công!`);

      // Auto pre-fill search bar from newly created request values and trigger fetch
      setFromCity(newRequest.from);
      setToCity(newRequest.to);
      setFromLocationId(newRequest.fromLocationId);
      setToLocationId(newRequest.toLocationId);
      lastSelectedFromRef.current = newRequest.from;
      lastSelectedToRef.current = newRequest.to;

      localStorage.setItem('request_fromCity', newRequest.from);
      localStorage.setItem('request_fromLocationId', newRequest.fromLocationId);
      localStorage.setItem('request_toCity', newRequest.to);
      localStorage.setItem('request_toLocationId', newRequest.toLocationId);

      fetchRequests({
        FromCity: newRequest.from,
        ToCity: newRequest.to,
        FromLocationId: newRequest.fromLocationId,
        ToLocationId: newRequest.toLocationId
      });
    } catch (err) {
      console.error('Error creating request:', err);
      toast.error(err.response?.data?.message || err.message || 'Không thể tạo yêu cầu. Vui lòng thử lại.');
    }
  };

  // Filter & Sort requests
  const filteredRequests = useMemo(() => {
    let result = [...allRequests];

    // Sorting
    if (sortBy === 'early') {
      const order = { 'Sáng': 1, 'Chiều': 2, 'Tối': 3, 'Đêm': 4 };
      result.sort((a, b) => {
        const aVal = Object.keys(order).find(k => a.timeWindow.includes(k)) || 'Sáng';
        const bVal = Object.keys(order).find(k => b.timeWindow.includes(k)) || 'Sáng';
        return order[aVal] - order[bVal];
      });
    } else if (sortBy === 'late') {
      const order = { 'Sáng': 1, 'Chiều': 2, 'Tối': 3, 'Đêm': 4 };
      result.sort((a, b) => {
        const aVal = Object.keys(order).find(k => a.timeWindow.includes(k)) || 'Sáng';
        const bVal = Object.keys(order).find(k => b.timeWindow.includes(k)) || 'Sáng';
        return order[bVal] - order[aVal];
      });
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.budget - b.budget);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.budget - a.budget);
    }
    return result;
  }, [allRequests, sortBy]);



  const isExpressView = serviceCode === 'express';

  return (
    <div className="bg-[#c9ced4] min-h-[60vh] w-full relative">



      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* Results List */}
        <div className="flex flex-col gap-6">

          {/* Service Tabs */}
          <div className="flex bg-white/70 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-slate-100/50 self-start">
            <button
              onClick={() => handleTabChange('carpool')}
              className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 ${serviceCode === 'carpool'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Yêu cầu Xe ghép
            </button>
            <button
              onClick={() => handleTabChange('express')}
              className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 ${serviceCode === 'express'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Yêu cầu Xe tải / Gửi hàng
            </button>
          </div>

          {/* Premium Search Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-stretch">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* ĐIỂM ĐI */}
              <div className="flex flex-col px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-left relative" ref={fromInputRef}>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ĐIỂM ĐI</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Thành phố xuất phát"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    onFocus={() => fromCity && setShowFromDropdown(true)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                {showFromDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                    {isFromLoading ? (
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tìm kiếm...</span>
                      </div>
                    ) : fromSuggestions.length > 0 ? (
                      fromSuggestions.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            const name = loc.displayName || loc.name || loc.locationName || '';
                            setFromCity(name);
                            setFromLocationId(loc.id);
                            localStorage.setItem('request_fromCity', name);
                            localStorage.setItem('request_fromLocationId', loc.id);
                            lastSelectedFromRef.current = name;
                            setShowFromDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                        >
                          {loc.displayName || loc.name || loc.locationName}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs font-semibold text-slate-400">Không tìm thấy địa điểm</div>
                    )}
                  </div>
                )}
              </div>

              {/* ĐIỂM ĐẾN */}
              <div className="flex flex-col px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-left relative" ref={toInputRef}>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ĐIỂM ĐẾN</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Thành phố đến"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    onFocus={() => toCity && setShowToDropdown(true)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                {showToDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto">
                    {isToLoading ? (
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tìm kiếm...</span>
                      </div>
                    ) : toSuggestions.length > 0 ? (
                      toSuggestions.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            const name = loc.displayName || loc.name || loc.locationName || '';
                            setToCity(name);
                            setToLocationId(loc.id);
                            localStorage.setItem('request_toCity', name);
                            localStorage.setItem('request_toLocationId', loc.id);
                            lastSelectedToRef.current = name;
                            setShowToDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                        >
                          {loc.displayName || loc.name || loc.locationName}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs font-semibold text-slate-400">Không tìm thấy địa điểm</div>
                    )}
                  </div>
                )}
              </div>

              {/* NGÀY ĐI */}
              <div className="flex flex-col px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-left">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">NGÀY ĐI</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* KHUNG GIỜ */}
              <div className="flex flex-col px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-left">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">KHUNG GIỜ</span>
                <div className="flex items-center gap-2 w-full">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Cả ngày</option>
                    <option value="morning">Sáng (06:00 - 12:00)</option>
                    <option value="afternoon">Chiều (12:00 - 18:00)</option>
                    <option value="evening">Tối (18:00 - 24:00)</option>
                    <option value="night">Đêm (00:00 - 06:00)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* SEARCH BUTTON */}
            <div className="flex items-stretch mt-4 lg:mt-0 lg:ml-2">
              <button
                type="button"
                onClick={() => fetchRequests()}
                disabled={isLoadingRequests}
                className="w-full lg:w-auto flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-8 py-3 rounded-2xl cursor-pointer shadow-sm hover:shadow-emerald-600/10 transition-all duration-300 gap-2 select-none text-xs"
              >
                {isLoadingRequests ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                <span>Tìm kiếm</span>
              </button>
            </div>
          </div>

          {/* Header Summary & Add Request Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-slate-600 text-sm font-medium text-left">
              Tìm thấy <span className="font-extrabold text-slate-900">{filteredRequests.length} yêu cầu</span> {fromCity ? `từ ${fromCity}` : ''} {toCity ? `đến ${toCity}` : ''}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">

              {/* Add Request Button */}
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 px-5 rounded-2xl cursor-pointer shadow-md hover:shadow-emerald-600/15 transition-all flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Thêm yêu cầu
              </button>

              {/* Sort Options */}
              {/* <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 shrink-0">
                <span>Sắp xếp:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 font-bold py-2.5 pl-4 pr-10 rounded-2xl focus:outline-none cursor-pointer shadow-sm text-sm"
                  >
                    <option value="early">Khung giờ sớm nhất</option>
                    <option value="late">Khung giờ muộn nhất</option>
                    <option value="priceAsc">Ngân sách thấp nhất</option>
                    <option value="priceDesc">Ngân sách cao nhất</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div> */}

            </div>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-5">
            {isLoadingRequests ? (
              <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-200 rounded-[24px] shadow-sm min-h-[250px]">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-bold text-xs">Đang tìm kiếm yêu cầu phù hợp...</p>
              </div>
            ) : (!fromCity.trim() && !toCity.trim() && requests.length === 0) ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-md">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-2">Bắt đầu tìm kiếm yêu cầu</h3>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                  Vui lòng nhập ít nhất <strong className="text-slate-700">Điểm đi</strong> hoặc <strong className="text-slate-700">Điểm đến</strong> ở thanh tìm kiếm phía trên để xem các yêu cầu phù hợp.
                </p>
              </div>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-md">
                <p className="text-slate-500 font-medium">Không tìm thấy yêu cầu nào khớp với bộ lọc.</p>
                <button
                  onClick={handleResetSearch}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors duration-300 cursor-pointer shadow-md hover:shadow-emerald-500/10"
                >
                  Đặt lại tìm kiếm
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* RENDER DYNAMIC REQUEST MODALS FROM UserPublicLayout */}
      {isExpressView ? (
        <ExpressRequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddRequest}
          initialFrom={fromCity}
          initialTo={toCity}
          initialFromId={fromLocationId}
          initialToId={toLocationId}
        />
      ) : (
        <CarpoolRequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddRequest}
          initialFrom={fromCity}
          initialTo={toCity}
          initialFromId={fromLocationId}
          initialToId={toLocationId}
        />
      )}

    </div>
  );
};

export default CreateRequestPage;
