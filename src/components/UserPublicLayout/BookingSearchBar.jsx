import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getLocationsApi } from '@/services/locationService';

const getTodayString = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const TODAY_DATE = getTodayString();

const BookingSearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get('from') || sessionStorage.getItem('booking_fromCity') || '');
  const [toCity, setToCity] = useState(searchParams.get('to') || sessionStorage.getItem('booking_toCity') || '');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || TODAY_DATE);
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || 'bus');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const lastSelectedFromRef = useRef(searchParams.get('from') || sessionStorage.getItem('booking_fromCity') || '');
  const lastSelectedToRef = useRef(searchParams.get('to') || sessionStorage.getItem('booking_toCity') || '');

  const services = [
    { id: 'bus', label: 'Xe khách' },
    { id: 'carpool', label: 'Xe ghép' },
    { id: 'express', label: 'Xe tải' }
  ];

  // Autocomplete suggestions states
  const [fromLocationId, setFromLocationId] = useState(searchParams.get('PickupLocationId') || sessionStorage.getItem('booking_fromLocationId') || '');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [isFromLoading, setIsFromLoading] = useState(false);

  const [toLocationId, setToLocationId] = useState(searchParams.get('DropoffLocationId') || sessionStorage.getItem('booking_toLocationId') || '');
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isToLoading, setIsToLoading] = useState(false);

  // Sync inputs with URL parameters
  useEffect(() => {
    const urlFrom = searchParams.get('from') || sessionStorage.getItem('booking_fromCity') || '';
    const urlTo = searchParams.get('to') || sessionStorage.getItem('booking_toCity') || '';
    
    setFromCity(urlFrom);
    setToCity(urlTo);
    
    lastSelectedFromRef.current = urlFrom;
    lastSelectedToRef.current = urlTo;

    setDepartureDate(searchParams.get('date') || TODAY_DATE);
    setSelectedService(searchParams.get('service') || 'bus');
    setFromLocationId(searchParams.get('PickupLocationId') || sessionStorage.getItem('booking_fromLocationId') || '');
    setToLocationId(searchParams.get('DropoffLocationId') || sessionStorage.getItem('booking_toLocationId') || '');
  }, [searchParams]);

  // Click outside to close dropdowns and restore empty values
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setShowFromDropdown(false);
        if (!fromCity.trim()) {
          const storedCity = sessionStorage.getItem('booking_fromCity');
          const storedId = sessionStorage.getItem('booking_fromLocationId');
          if (storedCity) {
            setFromCity(storedCity);
            lastSelectedFromRef.current = storedCity;
          }
          if (storedId) setFromLocationId(storedId);
        }
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToDropdown(false);
        if (!toCity.trim()) {
          const storedCity = sessionStorage.getItem('booking_toCity');
          const storedId = sessionStorage.getItem('booking_toLocationId');
          if (storedCity) {
            setToCity(storedCity);
            lastSelectedToRef.current = storedCity;
          }
          if (storedId) setToLocationId(storedId);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fromCity, toCity]);

  // Save non-empty values to session storage
  useEffect(() => {
    if (fromCity.trim()) {
      sessionStorage.setItem('booking_fromCity', fromCity.trim());
    }
    if (fromLocationId) {
      sessionStorage.setItem('booking_fromLocationId', fromLocationId);
    }
  }, [fromCity, fromLocationId]);

  useEffect(() => {
    if (toCity.trim()) {
      sessionStorage.setItem('booking_toCity', toCity.trim());
    }
    if (toLocationId) {
      sessionStorage.setItem('booking_toLocationId', toLocationId);
    }
  }, [toCity, toLocationId]);

  // Debounced suggestion loader for Source City (fromCity)
  useEffect(() => {
    if (!fromCity.trim()) {
      setFromSuggestions([]);
      setShowFromDropdown(false);
      return;
    }

    // Skip suggestion API call if the value matches the last selected/loaded value
    if (fromCity.trim() === lastSelectedFromRef.current) {
      return;
    }

    // Check if the current value matches an already selected suggestion
    const matchedSuggestion = fromSuggestions.find(
      s => (s.displayName || s.name || s.locationName || '') === fromCity.trim()
    );
    if (matchedSuggestion && matchedSuggestion.id === fromLocationId) {
      return;
    }

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
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [fromCity]);

  // Debounced suggestion loader for Destination City (toCity)
  useEffect(() => {
    if (!toCity.trim()) {
      setToSuggestions([]);
      setShowToDropdown(false);
      return;
    }

    // Skip suggestion API call if the value matches the last selected/loaded value
    if (toCity.trim() === lastSelectedToRef.current) {
      return;
    }

    // Check if the current value matches an already selected suggestion
    const matchedSuggestion = toSuggestions.find(
      s => (s.displayName || s.name || s.locationName || '') === toCity.trim()
    );
    if (matchedSuggestion && matchedSuggestion.id === toLocationId) {
      return;
    }

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
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [toCity]);

  const handleSwap = () => {
    // Swap display names
    const tempCity = fromCity;
    setFromCity(toCity);
    setToCity(tempCity);

    // Swap location IDs
    const tempId = fromLocationId;
    setFromLocationId(toLocationId);
    setToLocationId(tempId);

    // Update refs to prevent triggering suggestions on swap
    lastSelectedFromRef.current = toCity;
    lastSelectedToRef.current = tempCity;

    // Swap suggestions to prevent unnecessary API refetching
    const tempFromSuggestions = fromSuggestions;
    const tempToSuggestions = toSuggestions;
    setFromSuggestions(tempToSuggestions);
    setToSuggestions(tempFromSuggestions);

    // Close any open dropdowns
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  const handleSearch = () => {
    let finalFromCity = fromCity.trim();
    let finalFromId = fromLocationId;
    let finalToCity = toCity.trim();
    let finalToId = toLocationId;

    if (!finalFromCity) {
      finalFromCity = sessionStorage.getItem('booking_fromCity') || '';
      finalFromId = sessionStorage.getItem('booking_fromLocationId') || '';
      if (finalFromCity) {
        setFromCity(finalFromCity);
        lastSelectedFromRef.current = finalFromCity;
        setFromLocationId(finalFromId);
      }
    }

    if (!finalToCity) {
      finalToCity = sessionStorage.getItem('booking_toCity') || '';
      finalToId = sessionStorage.getItem('booking_toLocationId') || '';
      if (finalToCity) {
        setToCity(finalToCity);
        lastSelectedToRef.current = finalToCity;
        setToLocationId(finalToId);
      }
    }

    const params = new URLSearchParams();
    if (finalFromCity) params.append('from', finalFromCity);
    if (finalFromId) params.append('PickupLocationId', finalFromId);
    if (finalToCity) params.append('to', finalToCity);
    if (finalToId) params.append('DropoffLocationId', finalToId);
    if (departureDate) params.append('date', departureDate);
    if (selectedService) params.append('service', selectedService);

    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl lg:rounded-[36px] p-2.5 shadow-2xl border border-white/20 flex flex-col lg:flex-row items-center gap-3">
        <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">

          {/* ĐIỂM ĐI */}
          <div className="flex flex-col px-6 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 text-left relative" ref={fromInputRef}>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ĐIỂM ĐI</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Thành phố xuất phát"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                onFocus={() => fromCity && setShowFromDropdown(true)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            {showFromDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
                {isFromLoading ? (
                  <div className="px-6 py-3 text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
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
                        lastSelectedFromRef.current = name;
                        setShowFromDropdown(false);
                      }}
                      className="w-full text-left px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                    >
                      {loc.displayName || loc.name || loc.locationName}
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-3 text-xs font-semibold text-slate-400">Không tìm thấy địa điểm</div>
                )}
              </div>
            )}

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute z-20 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 sm:bottom-auto sm:top-1/2 sm:right-0 sm:left-auto sm:translate-x-1/2 sm:-translate-y-1/2"
              aria-label="Đổi chiều điểm đi và điểm đến"
            >
              <svg 
                className="w-4 h-4 text-emerald-500 transition-transform duration-500 group-hover:rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
          </div>

          {/* ĐIỂM ĐẾN */}
          <div className="flex flex-col px-6 py-2 border-b sm:border-b-0 sm:border-r lg:border-r border-slate-200 text-left relative" ref={toInputRef}>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">ĐIỂM ĐẾN</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <input
                type="text"
                placeholder="Thành phố đến"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                onFocus={() => toCity && setShowToDropdown(true)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            {showToDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
                {isToLoading ? (
                  <div className="px-6 py-3 text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
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
                        lastSelectedToRef.current = name;
                        setShowToDropdown(false);
                      }}
                      className="w-full text-left px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                    >
                      {loc.displayName || loc.name || loc.locationName}
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-3 text-xs font-semibold text-slate-400">Không tìm thấy địa điểm</div>
                )}
              </div>
            )}
          </div>

          {/* NGÀY ĐI */}
          <div className="flex flex-col px-6 py-2 border-b sm:border-b-0 sm:border-r lg:border-r border-slate-200 text-left">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">NGÀY ĐI</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* DỊCH VỤ */}
          <div className="flex flex-col px-6 py-2 text-left relative" ref={dropdownRef}>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">DỊCH VỤ</span>
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <div className="w-full bg-transparent text-sm font-semibold text-slate-800 pr-6 truncate">
                {services.find(s => s.id === selectedService)?.label || 'Xe khách'}
              </div>
              <div className="absolute right-6 pointer-events-none text-slate-500">
                <svg className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 text-sm font-semibold transition-colors duration-200 flex items-center justify-between ${selectedService === service.id
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span>{service.label}</span>
                    {selectedService === service.id && (
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* SEARCH BUTTON */}
        <div className="w-full lg:w-auto p-1 lg:p-0">
          <button
            onClick={handleSearch}
            className="w-full lg:w-auto flex lg:flex-col items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 px-10 rounded-[24px] cursor-pointer shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 gap-2 lg:gap-1 lg:self-stretch"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm tracking-wide">Tìm kiếm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSearchBar;
