import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAvailableLocationsForRouteApi } from '@/services/locationService';
import { getMyVehiclesApi } from '@/services/vehicleService';
import { createSharedRideOfferApi, createShipmentOfferApi } from '@/services/offerService';
import { VehicleType } from '@/types/enums';

// Searchable Location Selector Component with Debounce
const LocationSearchSelect = ({ label, value, onChange, placeholder, onRemove, showRemove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  // Reset name when value is cleared
  useEffect(() => {
    if (!value) {
      setSearchTerm('');
      setSelectedName('');
    }
  }, [value]);

  // Debounced API Search
  useEffect(() => {
    if (!isOpen) return;

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await getAvailableLocationsForRouteApi({
          query: searchTerm.trim() || undefined,
          PageSize: 15,
        });
        const items = res?.data?.items || res?.items || res?.data || res || [];
        setOptions(items);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  return (
    <div className="relative text-left flex-1">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{label}</label>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[10px] font-black text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-wide cursor-pointer"
          >
            Xóa điểm dừng
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchTerm : (selectedName || searchTerm)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-xs shadow-sm"
        />
        <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop layer to click off dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20 text-xs font-semibold py-1">
            {isLoading ? (
              <div className="px-4 py-3 text-slate-400 text-center flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Đang tìm kiếm...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="px-4 py-3 text-slate-400 text-center">Không tìm thấy địa điểm nào</div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    const name = opt.locationName || opt.displayName || opt.name || '';
                    setSelectedName(name);
                    setSearchTerm(name);
                    onChange(opt.id, name);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors font-bold text-slate-700 block truncate"
                >
                  {opt.locationName || opt.displayName || opt.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Main AddTripModal Component
const AddTripModal = ({ isOpen, onClose, onSuccess }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Route Points State: minimum of 2 (Start & End)
  const [points, setPoints] = useState([
    { locationId: '', label: 'Điểm xuất phát', stopType: 1, name: '' },
    { locationId: '', label: 'Điểm kết thúc', stopType: 5, name: '' },
  ]);

  // Form State
  const [departureTime, setDepartureTime] = useState('');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState(60);
  const [basePrice, setBasePrice] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Cargo State (for Truck/Shipment)
  const [maxWeight, setMaxWeight] = useState('');
  const [maxVolume, setMaxVolume] = useState('');
  const [acceptFragile, setAcceptFragile] = useState(false);

  // Load vehicles
  useEffect(() => {
    if (!isOpen) return;

    const loadVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        const vehRes = await getMyVehiclesApi();
        const vehs = vehRes?.data || vehRes || [];
        setVehicles(vehs);
      } catch (err) {
        toast.error('Không thể tải danh sách phương tiện của bạn.');
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, [isOpen]);

  if (!isOpen) return null;

  // Add intermediate point (transit stopType: 3)
  const addStopPoint = () => {
    setPoints((prev) => {
      const start = prev.slice(0, prev.length - 1);
      const end = prev[prev.length - 1];
      const newStop = {
        locationId: '',
        label: `Điểm dừng ${prev.length - 1}`,
        stopType: 3,
        name: '',
      };
      return [...start, newStop, end];
    });
  };

  // Remove intermediate point
  const removeStopPoint = (index) => {
    setPoints((prev) => {
      if (prev.length <= 2) return prev;
      const filtered = prev.filter((_, idx) => idx !== index);
      // Re-index intermediate labels
      return filtered.map((pt, idx) => {
        if (idx === 0) return pt;
        if (idx === filtered.length - 1) return pt;
        return { ...pt, label: `Điểm dừng ${idx}` };
      });
    });
  };

  const handlePointChange = (index, locationId, name) => {
    setPoints((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], locationId, name };
      return copy;
    });
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate points selection
    const hasEmptyPoint = points.some((pt) => !pt.locationId);
    if (hasEmptyPoint) {
      toast.error('Vui lòng chọn đầy đủ địa điểm cho tất cả các điểm dừng.');
      return;
    }

    // Check for duplicate locations in route
    const locationIds = points.map((pt) => pt.locationId);
    if (new Set(locationIds).size !== locationIds.length) {
      toast.error('Các địa điểm trong lộ trình không được trùng nhau.');
      return;
    }

    if (!departureTime) {
      toast.error('Vui lòng chọn thời gian xuất phát.');
      return;
    }
    if (!basePrice || Number(basePrice) <= 0) {
      toast.error('Vui lòng nhập giá cơ bản hợp lệ.');
      return;
    }
    if (!selectedVehicleId || !selectedVehicle) {
      toast.error('Vui lòng chọn phương tiện vận chuyển.');
      return;
    }

    setIsSubmitting(true);
    const formattedDepartureTime = new Date(departureTime).toISOString();

    // Map points to API structure
    const offerRoutePoints = points.map((pt, idx) => ({
      locationId: pt.locationId,
      stopType: idx === 0 ? 1 : idx === points.length - 1 ? 5 : pt.stopType,
    }));

    const commonPayload = {
      vehicleId: selectedVehicleId,
      departureTime: formattedDepartureTime,
      estimatedDurationMinutes: Number(estimatedDurationMinutes),
      basePrice: Number(basePrice),
      offerRoutePoints,
    };

    try {
      if (selectedVehicle.vehicleType === VehicleType.Car) {
        // Create Carpool Offer
        await createSharedRideOfferApi(commonPayload);
      } else if (selectedVehicle.vehicleType === VehicleType.Truck) {
        // Create Truck shipment Offer
        if (!maxWeight || Number(maxWeight) <= 0) {
          toast.error('Vui lòng nhập trọng tải tối đa hợp lệ cho xe tải.');
          setIsSubmitting(false);
          return;
        }
        if (!maxVolume || Number(maxVolume) <= 0) {
          toast.error('Vui lòng nhập thể tích tối đa hợp lệ cho xe tải.');
          setIsSubmitting(false);
          return;
        }

        const shipmentPayload = {
          ...commonPayload,
          cargo: {
            maxWeight: Number(maxWeight),
            maxVolume: Number(maxVolume),
            acceptFragile: Boolean(acceptFragile),
          },
        };
        await createShipmentOfferApi(shipmentPayload);
      } else {
        toast.error('Loại phương tiện không hỗ trợ tạo chuyến.');
        setIsSubmitting(false);
        return;
      }

      toast.success('Tạo chuyến đi mới thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo chuyến đi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between text-left">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thêm chuyến đi mới
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Đăng ký lộ trình xe ghép hoặc xe tải chở hàng</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-left space-y-6">
          {isLoadingVehicles ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-8 w-8 text-emerald-500 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Đang tải thông tin...</span>
            </div>
          ) : (
            <>
              {/* Route Points Section */}
              <div className="space-y-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                    <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Lộ trình di chuyển
                  </h4>
                  <button
                    type="button"
                    onClick={addStopPoint}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-extrabold text-[10px] uppercase transition-colors cursor-pointer border border-emerald-200/50"
                  >
                    + Thêm điểm dừng
                  </button>
                </div>

                <div className="space-y-4">
                  {points.map((pt, idx) => {
                    const isStartOrEnd = idx === 0 || idx === points.length - 1;
                    return (
                      <div key={idx} className="flex items-stretch gap-3">
                        <LocationSearchSelect
                          label={pt.label}
                          placeholder={`Nhập tìm kiếm ${pt.label.toLowerCase()}...`}
                          value={pt.locationId}
                          onChange={(locationId, name) => handlePointChange(idx, locationId, name)}
                          showRemove={!isStartOrEnd}
                          onRemove={() => removeStopPoint(idx)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Departure Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Thời gian xuất phát</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-xs shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Thời gian đi dự kiến (phút)</label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedDurationMinutes}
                    onChange={(e) => setEstimatedDurationMinutes(e.target.value)}
                    required
                    placeholder="Ví dụ: 180"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-xs shadow-sm"
                  />
                </div>
              </div>

              {/* Row 3: Base Price & Vehicle Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Giá cơ bản (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    placeholder="Ví dụ: 150000"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-xs shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Chọn phương tiện</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-extrabold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer text-xs shadow-sm"
                  >
                    <option value="">-- Chọn phương tiện --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} ({v.plateNumber}) - {v.vehicleType === VehicleType.Car ? 'Ô tô' : 'Xe tải'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Vehicle Info Display */}
              {selectedVehicle && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 text-xs">
                  <h4 className="font-black text-slate-800 text-sm border-b border-slate-200 pb-2">Thông tin phương tiện đã chọn</h4>
                  <div className="grid grid-cols-2 gap-y-2 font-semibold">
                    <div>
                      <span className="text-slate-400">Hãng xe/Tên xe: </span>
                      <strong className="text-slate-800 font-bold">{selectedVehicle.brand}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Biển số: </span>
                      <strong className="text-slate-800 font-bold font-mono">{selectedVehicle.plateNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Loại phương tiện: </span>
                      <strong className="text-slate-800 font-bold">
                        {selectedVehicle.vehicleType === VehicleType.Car ? 'Ô tô (Ghép chuyến)' : 'Xe tải (Gửi hàng)'}
                      </strong>
                    </div>
                    {/* Conditionally show seatCapacity if type is car */}
                    {selectedVehicle.vehicleType === VehicleType.Car && (
                      <div>
                        <span className="text-slate-400">Sức chứa/Số chỗ: </span>
                        <strong className="text-emerald-600 font-bold">{selectedVehicle.seatCapacity || '--'} chỗ</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Cargo details if vehicle type is Truck */}
              {selectedVehicle && selectedVehicle.vehicleType === VehicleType.Truck && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-4">
                  <h4 className="font-black text-emerald-800 text-sm flex items-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Chi tiết chuyến hàng (Xe tải)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">Trọng tải tối đa (kg)</label>
                      <input
                        type="number"
                        min="1"
                        value={maxWeight}
                        onChange={(e) => setMaxWeight(e.target.value)}
                        required
                        placeholder="Ví dụ: 500"
                        className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-xs shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">Thể tích tối đa (m³)</label>
                      <input
                        type="number"
                        min="1"
                        value={maxVolume}
                        onChange={(e) => setMaxVolume(e.target.value)}
                        required
                        placeholder="Ví dụ: 10"
                        className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-xs shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1.5">
                    <input
                      type="checkbox"
                      id="acceptFragile"
                      checked={acceptFragile}
                      onChange={(e) => setAcceptFragile(e.target.checked)}
                      className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="acceptFragile" className="text-xs font-extrabold text-slate-700 select-none cursor-pointer">
                      Nhận vận chuyển hàng dễ vỡ (Kính, gốm sứ, đồ điện tử...)
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action buttons footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-3 px-5 rounded-2xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingVehicles}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 px-6 rounded-2xl cursor-pointer shadow-md hover:shadow-emerald-600/10 transition-all flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4.5 w-4.5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Tạo chuyến'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddTripModal;
