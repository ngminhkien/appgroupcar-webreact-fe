import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar, TripCard } from '@/components/UserPublicLayout';
import { getLocationsApi } from '@/services/locationService';
import { getSharedRidesApi, getShipmentsApi } from '@/services/offerService';
import { getBusShowtimesApi } from '@/services/busShowtimeService';




const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceCode = searchParams.get('service') || 'bus';
  const pickupLocQuery = searchParams.get('PickupLocationId') || searchParams.get('from') || '';
  const dropoffLocQuery = searchParams.get('DropoffLocationId') || searchParams.get('to') || '';
  const dateLoc = searchParams.get('date') || '';

  // Human-readable location names for the UI header/cards
  const [resolvedFrom, setResolvedFrom] = useState(pickupLocQuery);
  const [resolvedTo, setResolvedTo] = useState(dropoffLocQuery);

  // Filters State
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const defaultMaxPrice = useMemo(() => {
    if (serviceCode === 'bus') return 1000000;
    return 50000000;
  }, [serviceCode]);

  const [maxPrice, setMaxPrice] = useState(defaultMaxPrice);

  useEffect(() => {
    setMaxPrice(defaultMaxPrice);
  }, [defaultMaxPrice]);

  const [sortBy, setSortBy] = useState('early');

  // API Trips and Loading States
  const [apiTrips, setApiTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Resolve descriptive location names for UI display
  useEffect(() => {
    const isUUID = (str) => {
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
    };

    if (isUUID(pickupLocQuery)) {
      const matched = locations.find(loc => loc.id === pickupLocQuery);
      if (matched) {
        setResolvedFrom(matched.displayName || matched.name || matched.locationName || pickupLocQuery);
      }
    } else {
      setResolvedFrom(pickupLocQuery);
    }

    if (isUUID(dropoffLocQuery)) {
      const matched = locations.find(loc => loc.id === dropoffLocQuery);
      if (matched) {
        setResolvedTo(matched.displayName || matched.name || matched.locationName || dropoffLocQuery);
      }
    } else {
      setResolvedTo(dropoffLocQuery);
    }
  }, [pickupLocQuery, dropoffLocQuery, locations]);

  // Fetch data dynamically from endpoints /shared-ride, /shipment, and /bus-showtimes
  useEffect(() => {
    if (!pickupLocQuery.trim() || !dropoffLocQuery.trim()) return;

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch locations if not already fetched
        let currentLocations = locations;
        if (currentLocations.length === 0) {
          const res = await getLocationsApi({ PageSize: 1000 });
          const locData = res?.data?.items || res?.data || res || [];
          currentLocations = Array.isArray(locData) ? locData : [];
          if (isMounted) {
            setLocations(currentLocations);
          }
        }

        // 2. Resolve IDs (either check if they are UUIDs or search by name match)
        const isUUID = (str) => {
          return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
        };

        let pickupLocId = isUUID(pickupLocQuery) ? pickupLocQuery : '';
        let dropoffLocId = isUUID(dropoffLocQuery) ? dropoffLocQuery : '';

        const normalizeStr = (str) => {
          if (!str) return '';
          return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/^(tỉnh|thành phố|tp\.?|t\.?)\s+/g, '')
            .trim();
        };

        if (!pickupLocId) {
          const cleanFrom = normalizeStr(pickupLocQuery);
          const matched = currentLocations.find(loc => {
            const name = normalizeStr(loc.displayName || loc.name || loc.locationName || '');
            return name.includes(cleanFrom) || cleanFrom.includes(name);
          });
          pickupLocId = matched?.id || '';
        }

        if (!dropoffLocId) {
          const cleanTo = normalizeStr(dropoffLocQuery);
          const matched = currentLocations.find(loc => {
            const name = normalizeStr(loc.displayName || loc.name || loc.locationName || '');
            return name.includes(cleanTo) || cleanTo.includes(name);
          });
          dropoffLocId = matched?.id || '';
        }

        // Determine descriptive location names for UI display
        const pickupLocName = currentLocations.find(loc => loc.id === pickupLocId)?.displayName || currentLocations.find(loc => loc.id === pickupLocId)?.name || pickupLocQuery;
        const dropoffLocName = currentLocations.find(loc => loc.id === dropoffLocId)?.displayName || currentLocations.find(loc => loc.id === dropoffLocId)?.name || dropoffLocQuery;

        // 3. Prepare parameters for the API call
        const pageNumberLoc = parseInt(searchParams.get('PageNumber') || searchParams.get('pageNumber') || '1', 10);
        const pageSizeLoc = parseInt(searchParams.get('PageSize') || searchParams.get('pageSize') || '10', 10);

        const params = {
          PickupLocationId: pickupLocId || undefined,
          DropoffLocationId: dropoffLocId || undefined,
          startTime: dateLoc ? `${dateLoc}T00:00:00` : undefined,
          PageNumber: pageNumberLoc,
          PageSize: pageSizeLoc
        };

        let responseData = null;
        if (serviceCode === 'carpool') {
          responseData = await getSharedRidesApi(params);
        } else if (serviceCode === 'express') {
          responseData = await getShipmentsApi(params);
        } else if (serviceCode === 'bus') {
          const busParams = {
            PickupLocationId: pickupLocId || undefined,
            DropoffLocationId: dropoffLocId || undefined,
            DepartureDate: dateLoc || undefined,
            PageNumber: pageNumberLoc,
            PageSize: pageSizeLoc
          };
          responseData = await getBusShowtimesApi(busParams);
        }

        const items = responseData?.data?.items || responseData?.data || responseData?.items || [];
        if (!Array.isArray(items)) {
          throw new Error('Định dạng dữ liệu trả về không hợp lệ');
        }

        // 4. Map the API items to the UI trip format
        const mapped = items.map(item => {
          let depTimeStr = '12:00';
          if (item.departureTime) {
            if (item.departureTime.includes(':')) {
              depTimeStr = item.departureTime.substring(0, 5);
            } else {
              const dt = new Date(item.departureTime);
              if (!isNaN(dt.getTime())) {
                depTimeStr = dt.toTimeString().slice(0, 5); // "HH:MM"
              }
            }
          }
          
          let arrTimeStr = '14:00';
          if (depTimeStr && depTimeStr.includes(':')) {
            const [h, m] = depTimeStr.split(':').map(Number);
            const totalMins = h * 60 + m + 90; // Add 1h 30m default duration
            const arrH = Math.floor(totalMins / 60) % 24;
            const arrM = totalMins % 60;
            arrTimeStr = `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;
          }

          const driverName = item.driverName && item.driverName !== 'string' ? item.driverName : '';
          const vehicleName = item.vehicleName && item.vehicleName !== 'string' ? item.vehicleName : '';
          
          let operatorName = '';
          if (serviceCode === 'carpool') {
            operatorName = driverName || vehicleName || 'Tài xế Xe ghép';
          } else if (serviceCode === 'express') {
            operatorName = driverName || vehicleName || 'Nhà xe Tải';
          } else {
            operatorName = item.companyName || item.plateNumber || 'Nhà xe Hải Âu';
          }

          let typeName = '';
          if (serviceCode === 'bus') {
            typeName = item.vehicleType || 'Xe khách';
          } else if (serviceCode === 'express') {
            typeName = item.vehicleName || 'Xe tải';
          } else {
            typeName = item.vehicleName || 'Limousine';
          }

          const tripFrom = item.startPoint?.displayName || item.startPoint?.locationName || item.startPoint?.name || (item.routeName ? item.routeName.split('-')[0].trim() : pickupLocName);
          const tripTo = item.endPoint?.displayName || item.endPoint?.locationName || item.endPoint?.name || (item.routeName ? item.routeName.split('-')[1].trim() : dropoffLocName);

          return {
            id: item.id || Math.random().toString(),
            operator: operatorName,
            service: serviceCode,
            type: typeName,
            rating: 4.8,
            reviewsCount: 15,
            price: item.price || item.basePrice || 0,
            departureTime: depTimeStr,
            arrivalTime: arrTimeStr,
            duration: '1h 30m',
            isDirect: true,
            stopoverType: 'Trực tiếp',
            from: tripFrom,
            to: tripTo,
            availableSeats: serviceCode === 'carpool' ? (item.availableSeats ?? 4) : (serviceCode === 'express' ? '1.5 tấn' : (item.seatCount || 9)),
            tag: serviceCode === 'carpool' ? 'XE GHÉP' : (serviceCode === 'express' ? 'XE TẢI' : 'XE KHÁCH'),
            image: item.vehicleUrlImage || item.imageUrl || (serviceCode === 'carpool' 
              ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'
              : (serviceCode === 'express' 
                ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&q=80'
                : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'))
          };
        });

        if (isMounted) {
          setApiTrips(mapped);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err.message || 'Lỗi khi lấy danh sách chuyến xe');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [serviceCode, pickupLocQuery, dropoffLocQuery, dateLoc, searchParams]);

  // Load suitable trips based on URL service type or API response
  const allTrips = useMemo(() => {
    return apiTrips;
  }, [apiTrips]);

  // Get unique operators and types from allTrips for the filter sidebar
  const uniqueOperators = useMemo(() => {
    const ops = allTrips.map(trip => trip.operator).filter(Boolean);
    return Array.from(new Set(ops));
  }, [allTrips]);

  const uniqueTypes = useMemo(() => {
    const types = allTrips.map(trip => trip.type).filter(Boolean);
    return Array.from(new Set(types));
  }, [allTrips]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedTimes([]);
    setSelectedOperators([]);
    setSelectedTypes([]);
    setMaxPrice(defaultMaxPrice);
    setSortBy('early');
  };

  // Filter & Sort trips
  const filteredTrips = useMemo(() => {
    let result = [...allTrips];

    // 1. Time range filter
    if (selectedTimes.length > 0) {
      result = result.filter(trip => {
        const hour = parseInt(trip.departureTime.split(':')[0], 10);
        return selectedTimes.some(range => {
          if (range === 'morning') return hour >= 6 && hour < 12;
          if (range === 'afternoon') return hour >= 12 && hour < 18;
          if (range === 'evening') return hour >= 18 && hour < 24;
          if (range === 'night') return hour >= 0 && hour < 6;
          return false;
        });
      });
    }

    // 2. Operator filter
    if (selectedOperators.length > 0) {
      result = result.filter(trip => selectedOperators.includes(trip.operator));
    }

    // 3. Vehicle type filter
    if (selectedTypes.length > 0) {
      result = result.filter(trip => selectedTypes.includes(trip.type));
    }

    // 4. Max price filter
    result = result.filter(trip => trip.price <= maxPrice);

    // Sorting
    if (sortBy === 'early') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sortBy === 'late') {
      result.sort((a, b) => b.departureTime.localeCompare(a.departureTime));
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allTrips, selectedTimes, selectedOperators, selectedTypes, maxPrice, sortBy]);

  if (!pickupLocQuery.trim() || !dropoffLocQuery.trim()) {
    return (
      <div className="bg-[#c9ced4] min-h-[60vh] w-full flex items-center justify-center py-16 px-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-10 max-w-lg w-full text-center shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-3">Vui lòng nhập hành trình của bạn</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Bạn cần nhập đầy đủ <strong className="text-slate-700">điểm đi</strong> và <strong className="text-slate-700">điểm đến</strong> ở thanh tìm kiếm phía trên để xem danh sách chuyến xe phù hợp.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#c9ced4] min-h-[60vh] w-full">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left column: Filters Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <FilterSidebar
            serviceCode={serviceCode}
            operators={uniqueOperators}
            vehicleTypes={uniqueTypes}
            selectedTimes={selectedTimes}
            setSelectedTimes={setSelectedTimes}
            selectedOperators={selectedOperators}
            setSelectedOperators={setSelectedOperators}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right column: Results List */}
        <div className="flex-grow flex flex-col gap-6">

          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-slate-600 text-sm font-medium">
              Tìm thấy <span className="font-extrabold text-slate-900">{filteredTrips.length} chuyến xe</span> từ {searchParams.get('from') || ''} đến {searchParams.get('to') || ''}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <span>Sắp xếp:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 font-bold py-2.5 pl-4 pr-10 rounded-2xl focus:outline-none cursor-pointer shadow-sm text-sm"
                >
                  <option value="early">Giờ đi sớm nhất</option>
                  <option value="late">Giờ đi muộn nhất</option>
                  <option value="priceAsc">Giá vé thấp nhất</option>
                  <option value="priceDesc">Giá vé cao nhất</option>
                </select>
                <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-100 rounded-3xl shadow-md min-h-[300px]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-semibold">Đang tìm kiếm chuyến xe phù hợp...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-16 bg-white border border-red-100 rounded-3xl shadow-md min-h-[300px]">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-600 font-bold mb-2">Đã xảy ra lỗi khi tải dữ liệu</p>
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
            ) : filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-md">
                <p className="text-slate-500 font-medium">Không tìm thấy chuyến xe nào khớp với bộ lọc.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors duration-300 cursor-pointer shadow-md hover:shadow-emerald-500/10"
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

export default BookingPage;
