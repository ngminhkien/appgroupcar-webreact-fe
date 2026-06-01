import React from 'react';

const FilterSidebar = ({
  serviceCode = 'bus',
  operators = [],
  vehicleTypes = [],
  selectedTimes,
  setSelectedTimes,
  selectedOperators,
  setSelectedOperators,
  selectedTypes,
  setSelectedTypes,
  maxPrice,
  setMaxPrice,
  onReset
}) => {
  const timeRanges = [
    { id: 'morning', label: 'Sáng (06:00 - 12:00)' },
    { id: 'afternoon', label: 'Chiều (12:00 - 18:00)' },
    { id: 'evening', label: 'Tối (18:00 - 24:00)' },
    { id: 'night', label: 'Đêm (00:00 - 06:00)' }
  ];

  // For Operators list: use props or fallback if empty and bus service
  const displayOperators = operators.length > 0 
    ? operators 
    : (serviceCode === 'bus' ? ['Hải Âu VIP', 'Hoàng Long', 'Anh Huy Đất Cảng'] : []);

  // For Vehicle Types: map to { id, label }
  const displayVehicleTypes = vehicleTypes.length > 0
    ? vehicleTypes.map(t => typeof t === 'string' ? { id: t, label: t } : t)
    : (serviceCode === 'bus' 
      ? [
          { id: 'Limousine', label: 'Limousine 9 chỗ' },
          { id: 'Giường nằm', label: 'Xe giường nằm' },
          { id: 'Ghế ngồi', label: 'Xe ghế ngồi' }
        ] 
      : []
    );

  const toggleTime = (timeId) => {
    if (selectedTimes.includes(timeId)) {
      setSelectedTimes(selectedTimes.filter(t => t !== timeId));
    } else {
      setSelectedTimes([...selectedTimes, timeId]);
    }
  };

  const toggleOperator = (opName) => {
    if (selectedOperators.includes(opName)) {
      setSelectedOperators(selectedOperators.filter(o => o !== opName));
    } else {
      setSelectedOperators([...selectedOperators, opName]);
    }
  };

  const toggleType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const isBus = serviceCode === 'bus';
  const minLimit = 100000;
  const maxLimit = isBus ? 1000000 : 50000000; // 1M for bus, 50M for carpool/express
  const stepVal = isBus ? 50000 : 500000;

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}tr`;
    }
    return `${(value / 1000).toLocaleString()}k`;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col gap-6">
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Bộ lọc</h3>
        <button
          onClick={onReset}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Departure Time */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Giờ xuất phát</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {timeRanges.map((range) => {
            const isSelected = selectedTimes.includes(range.id);
            return (
              <button
                key={range.id}
                onClick={() => toggleTime(range.id)}
                className={`py-3 px-3 text-xs font-semibold rounded-xl border text-center transition-all duration-200 cursor-pointer ${isSelected
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator */}
      {displayOperators.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
            {serviceCode === 'carpool' ? 'Tài xế / Dịch vụ' : serviceCode === 'express' ? 'Đơn vị vận chuyển' : 'Nhà xe'}
          </h4>
          <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {displayOperators.map((op) => {
              const isChecked = selectedOperators.includes(op);
              return (
                <label key={op} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOperator(op)}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    {op}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Vehicle Type */}
      {displayVehicleTypes.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Loại xe</h4>
          <div className="flex flex-col gap-2">
            {displayVehicleTypes.map((type) => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`w-full text-left py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                    }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Giá vé</h4>
        <div className="px-1 py-2 flex flex-col gap-2">
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={stepVal}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mt-1">
            <span>{formatPrice(minLimit)}</span>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Dưới {formatPrice(maxPrice)}
            </span>
            <span>{formatPrice(maxLimit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
