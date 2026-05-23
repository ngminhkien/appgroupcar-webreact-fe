import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

  const [fromCity, setFromCity] = useState(searchParams.get('from') || '');
  const [toCity, setToCity] = useState(searchParams.get('to') || '');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || TODAY_DATE);
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || 'bus');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const services = [
    { id: 'bus', label: 'Xe khách' },
    { id: 'carpool', label: 'Đi chung xe' },
    { id: 'express', label: 'Gửi hàng' }

  ];

  useEffect(() => {
    setFromCity(searchParams.get('from') || '');
    setToCity(searchParams.get('to') || '');
    setDepartureDate(searchParams.get('date') || TODAY_DATE);
    setSelectedService(searchParams.get('service') || 'bus');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (fromCity.trim()) params.append('from', fromCity.trim());
    if (toCity.trim()) params.append('to', toCity.trim());
    if (departureDate) params.append('date', departureDate);
    if (selectedService) params.append('service', selectedService);

    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl lg:rounded-[36px] p-2.5 shadow-2xl border border-white/20 flex flex-col lg:flex-row items-center gap-3">
        <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">

          {/* ĐIỂM ĐI */}
          <div className="flex flex-col px-6 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 text-left">
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
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* ĐIỂM ĐẾN */}
          <div className="flex flex-col px-6 py-2 border-b sm:border-b-0 lg:border-r border-slate-200 text-left">
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
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* NGÀY ĐI */}
          <div className="flex flex-col px-6 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 text-left">
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
                {services.find(s => s.id === selectedService)?.label || 'Gửi hàng'}
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
