import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar, TripCard } from '@/components/UserPublicLayout';

const MOCK_BUS_TRIPS = [
  {
    id: 1,
    operator: 'Hải Âu VIP',
    service: 'bus',
    type: 'Limousine',
    rating: 4.8,
    reviewsCount: 128,
    price: 250000,
    departureTime: '14:00',
    arrivalTime: '15:30',
    duration: '1h 30m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 4,
    tag: 'LIMOUSINE',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'
  },
  {
    id: 2,
    operator: 'Hoàng Long',
    service: 'bus',
    type: 'Giường nằm',
    rating: 4.5,
    reviewsCount: 452,
    price: 180000,
    departureTime: '15:15',
    arrivalTime: '17:15',
    duration: '2h 00m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 12,
    tag: 'GIƯỜNG NẰM',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80'
  },
  {
    id: 3,
    operator: 'Anh Huy Đất Cảng',
    service: 'bus',
    type: 'Limousine',
    rating: 4.6,
    reviewsCount: 89,
    price: 230000,
    departureTime: '16:30',
    arrivalTime: '18:15',
    duration: '1h 45m',
    isDirect: false,
    stopoverType: 'Tuyến nhanh',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 2,
    tag: 'LIMOUSINE',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600&q=80'
  },
  {
    id: 4,
    operator: 'Hải Âu VIP',
    service: 'bus',
    type: 'Limousine',
    rating: 4.9,
    reviewsCount: 64,
    price: 250000,
    departureTime: '08:30',
    arrivalTime: '10:00',
    duration: '1h 30m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 6,
    tag: 'LIMOUSINE',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'
  },
  {
    id: 5,
    operator: 'Hoàng Long',
    service: 'bus',
    type: 'Ghế ngồi',
    rating: 4.2,
    reviewsCount: 154,
    price: 130000,
    departureTime: '09:00',
    arrivalTime: '11:30',
    duration: '2h 30m',
    isDirect: false,
    stopoverType: 'Nhiều điểm dừng',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 18,
    tag: 'GHẾ NGỒI',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'
  },
  {
    id: 6,
    operator: 'Anh Huy Đất Cảng',
    service: 'bus',
    type: 'Ghế ngồi',
    rating: 4.4,
    reviewsCount: 92,
    price: 140000,
    departureTime: '19:00',
    arrivalTime: '21:00',
    duration: '2h 00m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 15,
    tag: 'GHẾ NGỒI',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600&q=80'
  }
];

const MOCK_EXPRESS_TRIPS = [
  {
    id: 101,
    operator: 'Hải Âu VIP',
    service: 'express',
    type: 'Limousine',
    rating: 4.7,
    reviewsCount: 88,
    price: 120000,
    departureTime: '10:00',
    arrivalTime: '11:30',
    duration: '1h 30m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: '500 kg',
    tag: 'LIMOUSINE',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80'
  },
  {
    id: 102,
    operator: 'Hoàng Long',
    service: 'express',
    type: 'Giường nằm',
    rating: 4.3,
    reviewsCount: 120,
    price: 90000,
    departureTime: '14:00',
    arrivalTime: '16:00',
    duration: '2h 00m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: '1.2 tấn',
    tag: 'GIƯỜNG NẰM',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&q=80'
  }
];

const MOCK_CARPOOL_TRIPS = [
  {
    id: 201,
    operator: 'Anh Huy Đất Cảng',
    service: 'carpool',
    type: 'Limousine',
    rating: 4.9,
    reviewsCount: 42,
    price: 150000,
    departureTime: '07:30',
    arrivalTime: '09:00',
    duration: '1h 30m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 3,
    tag: 'LIMOUSINE',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'
  },
  {
    id: 202,
    operator: 'Hoàng Long',
    service: 'carpool',
    type: 'Ghế ngồi',
    rating: 4.8,
    reviewsCount: 31,
    price: 130000,
    departureTime: '13:00',
    arrivalTime: '14:30',
    duration: '1h 30m',
    isDirect: true,
    stopoverType: 'Trực tiếp',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    availableSeats: 4,
    tag: 'GHẾ NGỒI',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80'
  }
];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceCode = searchParams.get('service') || 'bus';
  const fromLoc = searchParams.get('from') || 'Hà Nội';
  const toLoc = searchParams.get('to') || 'Hải Phòng';

  // Filters State
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState('early');

  // Load suitable trips based on URL service type
  const allTrips = useMemo(() => {
    if (serviceCode === 'express') return MOCK_EXPRESS_TRIPS;
    if (serviceCode === 'carpool') return MOCK_CARPOOL_TRIPS;
    return MOCK_BUS_TRIPS;
  }, [serviceCode]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedTimes([]);
    setSelectedOperators([]);
    setSelectedTypes([]);
    setMaxPrice(1000000);
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

  return (
    <div className="bg-slate-100 min-h-[60vh] w-full">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Filters Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <FilterSidebar
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
              Tìm thấy <span className="font-extrabold text-slate-900">{filteredTrips.length} chuyến xe</span> từ {fromLoc} đến {toLoc}
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
            {filteredTrips.length > 0 ? (
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
