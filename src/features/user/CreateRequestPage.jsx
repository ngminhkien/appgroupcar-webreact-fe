import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar, RequestCard, CarpoolRequestModal, ExpressRequestModal } from '@/components/UserPublicLayout';

const MOCK_CARPOOL_REQUESTS = [
  {
    id: 1,
    type: 'carpool',
    serviceLabel: 'Xe ghép',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    date: '2026-05-25',
    timeWindow: 'Sáng (06:00 - 12:00)',
    passengerName: 'Trần Văn An',
    passengerPhone: '0912.834.xxx',
    seatsNeeded: 2,
    budget: 150000,
    status: 'Đang đợi xe',
    createdAt: '1 giờ trước',
    note: 'Có mang theo 1 vali to. Cần xe đón khu vực Cầu Giấy.'
  },
  {
    id: 2,
    type: 'carpool',
    serviceLabel: 'Xe ghép',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    date: '2026-05-26',
    timeWindow: 'Chiều (12:00 - 18:00)',
    passengerName: 'Lê Thị Thu',
    passengerPhone: '0983.472.xxx',
    seatsNeeded: 1,
    budget: 180000,
    status: 'Đang đợi xe',
    createdAt: '3 giờ trước',
    note: 'Cần đi xe sạch sẽ, không khói thuốc.'
  },
  {
    id: 3,
    type: 'carpool',
    serviceLabel: 'Xe ghép',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    date: '2026-05-25',
    timeWindow: 'Tối (18:00 - 24:00)',
    passengerName: 'Nguyễn Văn Hùng',
    passengerPhone: '0904.582.xxx',
    seatsNeeded: 3,
    budget: 140000,
    status: 'Đang đợi xe',
    createdAt: '4 giờ trước',
    note: 'Đoàn có người già, xin lái xe đi cẩn thận.'
  },
  {
    id: 4,
    type: 'carpool',
    serviceLabel: 'Xe ghép',
    from: 'Hải Phòng',
    to: 'Hà Nội',
    date: '2026-05-25',
    timeWindow: 'Sáng (06:00 - 12:00)',
    passengerName: 'Phạm Hồng Thái',
    passengerPhone: '0973.912.xxx',
    seatsNeeded: 1,
    budget: 160000,
    status: 'Đang đợi xe',
    createdAt: '5 giờ trước',
    note: 'Đón tại ngã tư Cơ Điện, Hải Phòng.'
  }
];

const MOCK_EXPRESS_REQUESTS = [
  {
    id: 101,
    type: 'express',
    serviceLabel: 'Gửi hàng',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    date: '2026-05-24',
    timeWindow: 'Tối (18:00 - 24:00)',
    passengerName: 'Hoàng Minh Đức',
    passengerPhone: '0912.928.xxx',
    cargoType: 'Trái cây (thùng xốp)',
    weight: '80 kg',
    budget: 200000,
    status: 'Chờ ghép xe',
    createdAt: '30 phút trước',
    note: 'Hàng dễ vỡ, cần vận chuyển mát tránh dập nát.'
  },
  {
    id: 102,
    type: 'express',
    serviceLabel: 'Gửi hàng',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    date: '2026-05-25',
    timeWindow: 'Sáng (06:00 - 12:00)',
    passengerName: 'Phạm Thanh Thảo',
    passengerPhone: '0977.102.xxx',
    cargoType: 'Tài liệu và phụ tùng máy',
    weight: '15 kg',
    budget: 120000,
    status: 'Chờ ghép xe',
    createdAt: '2 giờ trước',
    note: 'Giao gấp trong buổi sáng tại Văn phòng Hải Phòng.'
  },
  {
    id: 103,
    type: 'express',
    serviceLabel: 'Gửi hàng',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    date: '2026-05-25',
    timeWindow: 'Chiều (12:00 - 18:00)',
    passengerName: 'Bùi Anh Tuấn',
    passengerPhone: '0903.882.xxx',
    cargoType: 'Quần áo đóng bao tải',
    weight: '150 kg',
    budget: 350000,
    status: 'Chờ ghép xe',
    createdAt: '5 giờ trước',
    note: 'Tổng cộng 3 bao tải lớn. Cần xe tải nhỏ đón tận nhà.'
  }
];

const CreateRequestPage = () => {
  const [searchParams] = useSearchParams();
  const serviceCode = searchParams.get('service') || 'carpool';
  const fromLoc = searchParams.get('from') || '';
  const toLoc = searchParams.get('to') || '';

  // Requests state list
  const [requests, setRequests] = useState([...MOCK_CARPOOL_REQUESTS, ...MOCK_EXPRESS_REQUESTS]);

  // Modal & Toast States
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filters State
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState('early');

  const allRequests = useMemo(() => {
    return requests.filter(req => req.type === serviceCode);
  }, [requests, serviceCode]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedTimes([]);
    setSelectedOperators([]);
    setSelectedTypes([]);
    setMaxPrice(1000000);
    setSortBy('early');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Submit handler when child modal invokes submit
  const handleAddRequest = (newRequest) => {
    setRequests([newRequest, ...requests]);
    setShowModal(false);
    showToast(`Tạo yêu cầu ${newRequest.serviceLabel.toLowerCase()} thành công!`);
  };

  // Filter & Sort requests
  const filteredRequests = useMemo(() => {
    let result = [...allRequests];

    // Filter by route match (case-insensitive substring)
    if (fromLoc) {
      result = result.filter(req => req.from.toLowerCase().includes(fromLoc.toLowerCase()));
    }
    if (toLoc) {
      result = result.filter(req => req.to.toLowerCase().includes(toLoc.toLowerCase()));
    }

    // 1. Time range filter
    if (selectedTimes.length > 0) {
      result = result.filter(req => {
        return selectedTimes.some(range => {
          if (range === 'morning') return req.timeWindow.includes('Sáng') || req.timeWindow.includes('06:') || req.timeWindow.includes('07:') || req.timeWindow.includes('08:') || req.timeWindow.includes('09:') || req.timeWindow.includes('10:') || req.timeWindow.includes('11:');
          if (range === 'afternoon') return req.timeWindow.includes('Chiều') || req.timeWindow.includes('12:') || req.timeWindow.includes('13:') || req.timeWindow.includes('14:') || req.timeWindow.includes('15:') || req.timeWindow.includes('16:') || req.timeWindow.includes('17:');
          if (range === 'evening') return req.timeWindow.includes('Tối') || req.timeWindow.includes('18:') || req.timeWindow.includes('19:') || req.timeWindow.includes('20:') || req.timeWindow.includes('21:') || req.timeWindow.includes('22:') || req.timeWindow.includes('23:');
          if (range === 'night') return req.timeWindow.includes('Đêm') || req.timeWindow.includes('00:') || req.timeWindow.includes('01:') || req.timeWindow.includes('02:') || req.timeWindow.includes('03:') || req.timeWindow.includes('04:') || req.timeWindow.includes('05:');
          return false;
        });
      });
    }

    // 2. Max price / offered budget filter
    result = result.filter(req => req.budget <= maxPrice);

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
  }, [allRequests, fromLoc, toLoc, selectedTimes, maxPrice, sortBy]);

  if (!fromLoc.trim() || !toLoc.trim()) {
    return (
      <div className="bg-[#c9ced4] min-h-[60vh] w-full flex items-center justify-center py-16 px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-3">Vui lòng nhập hành trình của bạn</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Bạn cần nhập đầy đủ <strong className="text-slate-700">điểm đi</strong> và <strong className="text-slate-700">điểm đến</strong> ở thanh tìm kiếm phía trên để xem các yêu cầu tương ứng.
          </p>
        </div>
      </div>
    );
  }

  const isExpressView = serviceCode === 'express';

  return (
    <div className="bg-[#c9ced4] min-h-[60vh] w-full relative">

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-xl z-[60] flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          {toastMessage}
        </div>
      )}

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

          {/* Header Summary & Add Request Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-slate-600 text-sm font-medium text-left">
              Tìm thấy <span className="font-extrabold text-slate-900">{filteredRequests.length} yêu cầu</span> {fromLoc ? `từ ${fromLoc}` : ''} {toLoc ? `đến ${toLoc}` : ''}
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
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 shrink-0">
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
              </div>

            </div>
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-5">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-md">
                <p className="text-slate-500 font-medium">Không tìm thấy yêu cầu nào khớp với bộ lọc.</p>
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

      {/* RENDER DYNAMIC REQUEST MODALS FROM UserPublicLayout */}
      {isExpressView ? (
        <ExpressRequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddRequest}
          initialFrom={fromLoc}
          initialTo={toLoc}
        />
      ) : (
        <CarpoolRequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddRequest}
          initialFrom={fromLoc}
          initialTo={toLoc}
        />
      )}

    </div>
  );
};

export default CreateRequestPage;
