import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getLocationsApi } from '@/services/locationService';

// 1. CARPOOL REQUEST MODAL
export const CarpoolRequestModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialFrom = '', 
  initialTo = '', 
  initialFromId = '', 
  initialToId = '' 
}) => {
  const [carpoolFrom, setCarpoolFrom] = useState(initialFrom);
  const [carpoolTo, setCarpoolTo] = useState(initialTo);
  const [carpoolFromId, setCarpoolFromId] = useState(initialFromId);
  const [carpoolToId, setCarpoolToId] = useState(initialToId);
  const [carpoolDate, setCarpoolDate] = useState('');
  const [carpoolTime, setCarpoolTime] = useState('');
  const [carpoolSeats, setCarpoolSeats] = useState(1);
  const [carpoolNote, setCarpoolNote] = useState('');

  // Suggestions states
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [isFromLoading, setIsFromLoading] = useState(false);

  const [toSuggestions, setToSuggestions] = useState([]);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isToLoading, setIsToLoading] = useState(false);

  const lastSelectedFromRef = useRef(initialFrom);
  const lastSelectedToRef = useRef(initialTo);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // Sync with initial values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setCarpoolFrom(initialFrom);
      setCarpoolTo(initialTo);
      setCarpoolFromId(initialFromId || '');
      setCarpoolToId(initialToId || '');
      lastSelectedFromRef.current = initialFrom;
      lastSelectedToRef.current = initialTo;
    }
  }, [isOpen, initialFrom, initialTo, initialFromId, initialToId]);

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

  // Debounced suggestions for carpoolFrom
  useEffect(() => {
    if (!carpoolFrom.trim()) {
      setFromSuggestions([]);
      setShowFromDropdown(false);
      setCarpoolFromId('');
      return;
    }
    if (carpoolFrom.trim() === lastSelectedFromRef.current) return;

    const timer = setTimeout(async () => {
      setIsFromLoading(true);
      try {
        const res = await getLocationsApi({ query: carpoolFrom.trim(), PageNumber: 1, PageSize: 10 });
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
  }, [carpoolFrom]);

  // Debounced suggestions for carpoolTo
  useEffect(() => {
    if (!carpoolTo.trim()) {
      setToSuggestions([]);
      setShowToDropdown(false);
      setCarpoolToId('');
      return;
    }
    if (carpoolTo.trim() === lastSelectedToRef.current) return;

    const timer = setTimeout(async () => {
      setIsToLoading(true);
      try {
        const res = await getLocationsApi({ query: carpoolTo.trim(), PageNumber: 1, PageSize: 10 });
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
  }, [carpoolTo]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!carpoolFrom.trim() || !carpoolTo.trim() || !carpoolDate) {
      toast.error('Vui lòng nhập đầy đủ Điểm khởi hành, Điểm đến và Ngày đi.');
      return;
    }
    if (!carpoolFromId) {
      toast.error('Vui lòng chọn Điểm khởi hành từ gợi ý tìm kiếm.');
      return;
    }
    if (!carpoolToId) {
      toast.error('Vui lòng chọn Điểm đến từ gợi ý tìm kiếm.');
      return;
    }

    const newReq = {
      id: Date.now(),
      type: 'carpool',
      serviceLabel: 'Xe ghép',
      from: carpoolFrom,
      to: carpoolTo,
      fromLocationId: carpoolFromId,
      toLocationId: carpoolToId,
      date: carpoolDate,
      time: carpoolTime,
      seatsRequired: carpoolSeats,
      note: carpoolNote
    };

    onSubmit(newReq);
    
    // reset form fields
    setCarpoolDate('');
    setCarpoolTime('');
    setCarpoolSeats(1);
    setCarpoolNote('');
    setCarpoolFromId('');
    setCarpoolToId('');
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
          <div className="flex flex-col gap-1.5 text-xs relative" ref={fromInputRef}>
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Điểm khởi hành</label>
            <div className="relative">
              <input 
                type="text" 
                value={carpoolFrom}
                onChange={(e) => setCarpoolFrom(e.target.value)}
                onFocus={() => carpoolFrom && setShowFromDropdown(true)}
                placeholder="Nhập địa chỉ bắt đầu..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {showFromDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[60] overflow-hidden py-1 max-h-40 overflow-y-auto">
                {isFromLoading ? (
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500">Đang tìm kiếm...</div>
                ) : fromSuggestions.length > 0 ? (
                  fromSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        const name = loc.displayName || loc.name || loc.locationName || '';
                        setCarpoolFrom(name);
                        setCarpoolFromId(loc.id);
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

          {/* carpoolTo */}
          <div className="flex flex-col gap-1.5 text-xs relative" ref={toInputRef}>
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Điểm đến</label>
            <div className="relative">
              <input 
                type="text" 
                value={carpoolTo}
                onChange={(e) => setCarpoolTo(e.target.value)}
                onFocus={() => carpoolTo && setShowToDropdown(true)}
                placeholder="Bạn muốn đi đâu?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            {showToDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[60] overflow-hidden py-1 max-h-40 overflow-y-auto">
                {isToLoading ? (
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500">Đang tìm kiếm...</div>
                ) : toSuggestions.length > 0 ? (
                  toSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        const name = loc.displayName || loc.name || loc.locationName || '';
                        setCarpoolTo(name);
                        setCarpoolToId(loc.id);
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
export const ExpressRequestModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialFrom = '', 
  initialTo = '', 
  initialFromId = '', 
  initialToId = '' 
}) => {
  const [expressFrom, setExpressFrom] = useState(initialFrom);
  const [expressTo, setExpressTo] = useState(initialTo);
  const [expressFromId, setExpressFromId] = useState(initialFromId);
  const [expressToId, setExpressToId] = useState(initialToId);
  const [expressDate, setExpressDate] = useState('');
  const [expressWeight, setExpressWeight] = useState('');
  const [expressVolume, setExpressVolume] = useState('');
  const [expressDescription, setExpressDescription] = useState('');
  const [expressIsFragile, setExpressIsFragile] = useState(false);
  const [expressHandlingNote, setExpressHandlingNote] = useState('');
  const [expressImageFile, setExpressImageFile] = useState(null);
  const [expressImagePreview, setExpressImagePreview] = useState(null);

  // Suggestions states
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [isFromLoading, setIsFromLoading] = useState(false);

  const [toSuggestions, setToSuggestions] = useState([]);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isToLoading, setIsToLoading] = useState(false);

  const lastSelectedFromRef = useRef(initialFrom);
  const lastSelectedToRef = useRef(initialTo);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  // Sync with initial values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setExpressFrom(initialFrom);
      setExpressTo(initialTo);
      setExpressFromId(initialFromId || '');
      setExpressToId(initialToId || '');
      lastSelectedFromRef.current = initialFrom;
      lastSelectedToRef.current = initialTo;
    }
  }, [isOpen, initialFrom, initialTo, initialFromId, initialToId]);

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

  // Debounced suggestions for expressFrom
  useEffect(() => {
    if (!expressFrom.trim()) {
      setFromSuggestions([]);
      setShowFromDropdown(false);
      setExpressFromId('');
      return;
    }
    if (expressFrom.trim() === lastSelectedFromRef.current) return;

    const timer = setTimeout(async () => {
      setIsFromLoading(true);
      try {
        const res = await getLocationsApi({ query: expressFrom.trim(), PageNumber: 1, PageSize: 10 });
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
  }, [expressFrom]);

  // Debounced suggestions for expressTo
  useEffect(() => {
    if (!expressTo.trim()) {
      setToSuggestions([]);
      setShowToDropdown(false);
      setExpressToId('');
      return;
    }
    if (expressTo.trim() === lastSelectedToRef.current) return;

    const timer = setTimeout(async () => {
      setIsToLoading(true);
      try {
        const res = await getLocationsApi({ query: expressTo.trim(), PageNumber: 1, PageSize: 10 });
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
  }, [expressTo]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExpressImageFile(file);
      setExpressImagePreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expressFrom.trim() || !expressTo.trim() || !expressDate) {
      toast.error('Vui lòng nhập đầy đủ Địa điểm lấy hàng, Địa điểm giao hàng và Ngày vận chuyển.');
      return;
    }
    if (!expressFromId) {
      toast.error('Vui lòng chọn Địa điểm lấy hàng từ gợi ý tìm kiếm.');
      return;
    }
    if (!expressToId) {
      toast.error('Vui lòng chọn Địa điểm giao hàng từ gợi ý tìm kiếm.');
      return;
    }
    if (!expressDescription.trim()) {
      toast.error('Vui lòng nhập Mô tả hàng hóa.');
      return;
    }
    if (!expressWeight || parseFloat(expressWeight) <= 0) {
      toast.error('Vui lòng nhập Khối lượng hàng hóa.');
      return;
    }
    if (!expressVolume || parseFloat(expressVolume) <= 0) {
      toast.error('Vui lòng nhập Thể tích hàng hóa.');
      return;
    }

    const newReq = {
      id: Date.now(),
      type: 'express',
      serviceLabel: 'Gửi hàng',
      from: expressFrom,
      to: expressTo,
      fromLocationId: expressFromId,
      toLocationId: expressToId,
      date: expressDate,
      description: expressDescription,
      weight: parseFloat(expressWeight),
      volume: parseFloat(expressVolume),
      isFragile: expressIsFragile,
      handlingNote: expressHandlingNote,
      imageFile: expressImageFile
    };

    onSubmit(newReq);
    
    // reset form fields
    setExpressDescription('');
    setExpressWeight('');
    setExpressVolume('');
    setExpressIsFragile(false);
    setExpressHandlingNote('');
    setExpressImageFile(null);
    setExpressImagePreview(null);
    setExpressDate('');
    setExpressFromId('');
    setExpressToId('');
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
          <div className="flex flex-col gap-1.5 text-xs relative" ref={fromInputRef}>
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Địa điểm lấy hàng</label>
            <div className="relative">
              <input 
                type="text" 
                value={expressFrom}
                onChange={(e) => setExpressFrom(e.target.value)}
                onFocus={() => expressFrom && setShowFromDropdown(true)}
                placeholder="Nhập địa chỉ lấy hàng..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {showFromDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[60] overflow-hidden py-1 max-h-40 overflow-y-auto">
                {isFromLoading ? (
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500">Đang tìm kiếm...</div>
                ) : fromSuggestions.length > 0 ? (
                  fromSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        const name = loc.displayName || loc.name || loc.locationName || '';
                        setExpressFrom(name);
                        setExpressFromId(loc.id);
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

          {/* deliveryAddress */}
          <div className="flex flex-col gap-1.5 text-xs relative" ref={toInputRef}>
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Địa điểm giao hàng</label>
            <div className="relative">
              <input 
                type="text" 
                value={expressTo}
                onChange={(e) => setExpressTo(e.target.value)}
                onFocus={() => expressTo && setShowToDropdown(true)}
                placeholder="Nhập địa chỉ giao hàng..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            {showToDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[60] overflow-hidden py-1 max-h-40 overflow-y-auto">
                {isToLoading ? (
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500">Đang tìm kiếm...</div>
                ) : toSuggestions.length > 0 ? (
                  toSuggestions.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        const name = loc.displayName || loc.name || loc.locationName || '';
                        setExpressTo(name);
                        setExpressToId(loc.id);
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

          {/* Description */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Mô tả hàng hóa <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={expressDescription}
              onChange={(e) => setExpressDescription(e.target.value)}
              placeholder="Ví dụ: 2 thùng hoa quả, 1 kiện quần áo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              required
            />
          </div>

          {/* Weight & Volume Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Khối lượng (KG) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                step="0.1"
                value={expressWeight}
                onChange={(e) => setExpressWeight(e.target.value)}
                placeholder="Ví dụ: 15.5"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Thể tích (m³) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                step="0.01"
                value={expressVolume}
                onChange={(e) => setExpressVolume(e.target.value)}
                placeholder="Ví dụ: 1.2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Date & Fragile switch Row */}
          <div className="grid grid-cols-2 gap-4 items-end">
            {/* Delivery Date */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-extrabold text-slate-500 uppercase tracking-wider">Ngày vận chuyển <span className="text-red-500">*</span></label>
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

            {/* IsFragile Toggle */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 h-[46px]">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Hàng dễ vỡ</span>
              <label className="relative inline-flex items-center cursor-pointer select-none scale-90">
                <input 
                  type="checkbox" 
                  checked={expressIsFragile}
                  onChange={(e) => setExpressIsFragile(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* HandlingNote */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Lưu ý bốc xếp / Vận chuyển</label>
            <textarea 
              value={expressHandlingNote}
              onChange={(e) => setExpressHandlingNote(e.target.value)}
              placeholder="Ví dụ: Cần bốc xếp tầng 3, nhẹ tay..."
              rows="2"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Image Upload with Preview */}
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-extrabold text-slate-500 uppercase tracking-wider">Hình ảnh hàng hóa</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 font-semibold text-slate-700 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Tải ảnh lên</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {expressImagePreview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img src={expressImagePreview} alt="Cargo Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setExpressImageFile(null); setExpressImagePreview(null); }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 text-xs italic">Chưa chọn ảnh</span>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="bg-slate-950 hover:bg-black text-white text-sm font-black py-4 rounded-2xl w-full cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all mt-2 text-center uppercase tracking-wider"
          >
            Tạo yêu cầu gửi hàng
          </button>
        </form>
      </div>
    </div>
  );
};
