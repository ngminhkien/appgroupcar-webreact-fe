import React, { useState, useEffect, useRef } from 'react';
import { getLocationsApi } from '@/services/locationService';

const LocationSearchInput = ({
  value,
  locationName,
  onChange,
  placeholder = 'Chọn địa điểm',
  initialLocations = [],
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // Sync state with parent value / locationName changes
  useEffect(() => {
    if (value) {
      setSearchTerm(locationName || '');
    } else {
      setSearchTerm('');
    }
  }, [value, locationName]);

  // Click outside listener to close dropdown and restore text
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // If closed without selecting, restore input text to last selected name
        if (value) {
          setSearchTerm(locationName || '');
        } else {
          setSearchTerm('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, locationName]);

  // Debounced API search when typing
  useEffect(() => {
    if (!isOpen) return;

    // If search term is empty, we show initial/default locations
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    // If search term matches the currently selected location's name, don't trigger search
    if (searchTerm.trim() === locationName) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await getLocationsApi({ query: searchTerm.trim(), PageNumber: 1, PageSize: 15 });
        const items = res?.data?.items || res?.data || res || [];
        setSuggestions(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, locationName]);

  // If search text matches the selected name, display options as initialLocations.
  // Otherwise display API suggestions.
  const isSearching = searchTerm.trim() && searchTerm.trim() !== locationName;
  const displayOptions = isSearching ? suggestions : initialLocations;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!e.target.value.trim()) {
              onChange('', ''); // clear parent selection
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full outline-none bg-white min-h-[42px] pr-9 pl-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all rounded-xl border border-slate-200"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400 pointer-events-none">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-60 overflow-y-auto">
          {isLoading && displayOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang tìm kiếm...</span>
            </div>
          ) : displayOptions.length > 0 ? (
            <div className="py-1">
              {displayOptions.map((loc) => {
                const name = loc.displayName || loc.name || loc.locationName || '';
                const isSelected = String(loc.id) === String(value);
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onChange(loc.id, name);
                      setSearchTerm(name);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between ${
                      isSelected ? 'bg-emerald-50 text-emerald-600 font-semibold hover:bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-emerald-600 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-slate-400">Không tìm thấy địa điểm</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
