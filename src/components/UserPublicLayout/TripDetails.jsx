import React, { useState, useEffect } from 'react';
import { getOfferRoutePointsApi } from '@/services/offerRoutePointService';
import { getDriverByIdApi } from '@/services/driverService';
import logoGroupCar from '@/assets/logoGroupCar.png';

const TripDetails = ({ trip, onClose }) => {
  const [activeTab, setActiveTab] = useState('pickupDropoff');

  const [routePoints, setRoutePoints] = useState([]);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [driverError, setDriverError] = useState(null);

  // Helper to format full image urls (for avatars etc)
  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5039';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${baseUrl}${formattedUrl}`;
  };

  useEffect(() => {
    if (!trip?.id) return;

    let isMounted = true;
    const fetchRoutePoints = async () => {
      setIsLoadingRoute(true);
      setRouteError(null);
      try {
        const response = await getOfferRoutePointsApi(trip.id);
        if (isMounted) {
          if (response && response.code === 200) {
            setRoutePoints(response.data || []);
          } else {
            setRoutePoints(response?.data ?? response ?? []);
          }
        }
      } catch (err) {
        console.error('Error fetching route points:', err);
        if (isMounted) {
          setRouteError(err.message || 'Không thể tải lộ trình chuyến đi.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingRoute(false);
        }
      }
    };

    fetchRoutePoints();

    return () => {
      isMounted = false;
    };
  }, [trip?.id]);

  useEffect(() => {
    const driverId = trip?.driverId;
    if (!driverId) {
      setDriverInfo(null);
      return;
    }

    let isMounted = true;
    const fetchDriverInfo = async () => {
      setIsLoadingDriver(true);
      setDriverError(null);
      try {
        const response = await getDriverByIdApi(driverId);
        if (isMounted) {
          if (response && response.code === 200) {
            setDriverInfo(response.data);
          } else {
            setDriverInfo(response?.data ?? response);
          }
        }
      } catch (err) {
        console.error('Error fetching driver info:', err);
        if (isMounted) {
          setDriverError(err.message || 'Không thể tải thông tin tài xế.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingDriver(false);
        }
      }
    };

    fetchDriverInfo();

    return () => {
      isMounted = false;
    };
  }, [trip?.driverId]);

  // Realistic mock data generated based on trip operator
  const getMockDetails = (operator) => {
    const baseDetails = {
      pickupDropoff: {
        notice: 'Các mốc thời gian đón, trả bên dưới là thời gian dự kiến. Lịch này có thể thay đổi tùy tình hình thực tế.',
        pickups: [
          { time: '13:00', address: 'Số 72 Trần Nhân Tông, Hai Bà Trưng, Hà Nội', isDoorToDoor: false },
          { time: '13:30', address: 'Phố cổ Hà Nội (Hanoi Old Quarter)', isDoorToDoor: true },
          { time: '13:45', address: 'Số 72 Phố Vọng, phường Bạch Mai, HN', isDoorToDoor: false },
          { time: '14:00', address: 'Số 10 Ngõ 15 Ngọc Hồi, phường Yên Sở, HN', isDoorToDoor: false }
        ],
        dropoffs: [
          { time: '15:00', address: 'VP 251 Lương Văn Thăng (X.E VIET NAM OFFICE)', isDoorToDoor: false },
          { time: '15:15', address: 'Trung chuyển THÀNH PHỐ Ninh Bình', isDoorToDoor: true },
          { time: '15:30', address: 'Trung chuyển Thiên Tôn, Ninh Mỹ, Ninh Giang, Ninh Khang', isDoorToDoor: true },
          { time: '15:30', address: 'Trung chuyển Ninh Nhất, Ninh Hòa, Ninh Tiến (trục chính)', isDoorToDoor: true },
          { time: '15:30', address: 'Ninh Phúc, Khánh Phú, Khánh Hòa, Khánh An (trục chính)', isDoorToDoor: true }
        ]
      },
      driver: {
        name: 'Nguyễn Văn Hùng',
        phone: '0912.834.xxx',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
        rating: 4.9,
        tripsCount: 1540,
        experience: '12 năm kinh nghiệm lái xe Limousine liên tỉnh, thông thuộc mọi cung đường Hà Nội - Hải Phòng. Cam kết lái xe an toàn, không phóng nhanh vượt ẩu.',
        license: 'Hạng D'
      },
      reviews: {
        summary: {
          average: trip.rating,
          total: trip.reviewsCount,
          stars: [
            { count: 5, percentage: 80 },
            { count: 4, percentage: 15 },
            { count: 3, percentage: 3 },
            { count: 2, percentage: 1 },
            { count: 1, percentage: 1 }
          ]
        },
        list: [
          {
            id: 1,
            author: 'Nguyễn Hoàng Nam',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
            rating: 5,
            date: '20-05-2026',
            comment: 'Xe chạy rất đúng giờ, tài xế Hùng thân thiện và lái xe rất êm. Xe sạch sẽ và có đầy đủ nước uống, khăn lạnh.'
          },
          {
            id: 2,
            author: 'Trần Thị Mai',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
            rating: 4,
            date: '18-05-2026',
            comment: 'Dịch vụ tốt, trung chuyển đón trả tận nhà rất tiện lợi. Ghế ngồi massage thoải mái. Sẽ tiếp tục ủng hộ.'
          },
          {
            id: 3,
            author: 'Lê Minh Tuấn',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
            rating: 5,
            date: '15-05-2026',
            comment: 'Ấn tượng với cách làm việc chuyên nghiệp của nhà xe. Xe đẹp, thơm, lái xe lịch sự không bắt khách dọc đường.'
          }
        ]
      },
      photos: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', // Exterior
        'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600&q=80', // Interior seats
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', // Vehicle dashboard
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80'  // Cargo space
      ],
      policies: [
        { title: 'Chính sách huỷ vé', desc: 'Huỷ trước 24h: hoàn 100% tiền vé. Huỷ từ 12h - 24h: hoàn 50% tiền vé. Huỷ dưới 12h: không hoàn tiền.' },
        { title: 'Chính sách hành lý', desc: 'Mỗi hành khách được mang tối đa 20kg hành lý ký gửi và 1 balo xách tay. Hành lý cồng kềnh quá khổ sẽ tính thêm phụ phí.' },
        { title: 'Trẻ em & vật nuôi', desc: 'Trẻ em dưới 3 tuổi hoặc dưới 100cm ngồi chung ghế với người lớn được miễn phí. Không nhận chở vật nuôi trực tiếp trên khoang hành khách.' }
      ]
    };

    if (operator === 'Hoàng Long') {
      return {
        ...baseDetails,
        pickupDropoff: {
          notice: 'Hoàng Long cam kết chạy đúng tuyến cao tốc 5B Hà Nội - Hải Phòng. Thời gian đón trả có thể dao động 10-15 phút.',
          pickups: [
            { time: '14:30', address: 'Bến xe Nước Ngầm, Hoàng Mai, Hà Nội', isDoorToDoor: false },
            { time: '14:45', address: 'Văn phòng 28 Trần Nhân Tông, Hà Nội', isDoorToDoor: false },
            { time: '15:15', address: 'Bến xe Cổ Điển, Gia Lâm, Hà Nội', isDoorToDoor: false }
          ],
          dropoffs: [
            { time: '16:30', address: 'Nút giao Nam Cầu Bính, Hải Phòng', isDoorToDoor: false },
            { time: '16:45', address: 'Bến xe Thượng Lý, Hồng Bàng, Hải Phòng', isDoorToDoor: false },
            { time: '17:00', address: 'Văn phòng Hoàng Long Hải Phòng (Cầu Đất)', isDoorToDoor: false },
            { time: '17:15', address: 'Nội thành Hải Phòng (Bán kính 5km từ VP)', isDoorToDoor: true }
          ]
        },
        driver: {
          name: 'Trần Minh Đức',
          phone: '0983.472.xxx',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
          rating: 4.7,
          tripsCount: 2450,
          experience: 'Lái xe lâu năm giàu kinh nghiệm chạy xe khách giường nằm tuyến quốc lộ. Vui vẻ, hoà đồng, hỗ trợ xếp dỡ hành lý nhiệt tình.',
          license: 'Hạng E'
        }
      };
    }

    if (operator === 'Anh Huy Đất Cảng') {
      return {
        ...baseDetails,
        pickupDropoff: {
          notice: 'Tuyến nhanh Anh Huy Đất Cảng đón trả khách liên tục. Đón trả tại văn phòng Hà Nội và các văn phòng Hải Phòng.',
          pickups: [
            { time: '15:45', address: 'Bến xe Yên Nghĩa, Hà Đông, Hà Nội', isDoorToDoor: false },
            { time: '16:00', address: 'Ngã tư Khuất Duy Tiến (Hầm đi bộ số 3), Hà Nội', isDoorToDoor: false },
            { time: '16:30', address: 'Văn phòng Anh Huy Hà Nội (Khuất Duy Tiến)', isDoorToDoor: false }
          ],
          dropoffs: [
            { time: '17:45', address: 'Bến xe Cầu Rào, Ngô Quyền, Hải Phòng', isDoorToDoor: false },
            { time: '18:00', address: 'Văn phòng Anh Huy Hải Phòng (Điện Biên Phủ)', isDoorToDoor: false },
            { time: '18:15', address: 'Trả tận nơi: Nội thành Hải Phòng', isDoorToDoor: true }
          ]
        },
        driver: {
          name: 'Vũ Hoàng Nam',
          phone: '0904.582.xxx',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
          rating: 4.8,
          tripsCount: 1890,
          experience: 'Đội trưởng đội xe limousine Anh Huy, giàu kinh nghiệm lái xe an toàn, nghiêm túc chấp hành luật giao thông, lịch sự với hành khách.',
          license: 'Hạng D'
        }
      };
    }

    return baseDetails;
  };

  const details = getMockDetails(trip.operator);

  const displayPickups = routePoints
    ? [...routePoints].filter(pt => pt.stopType === 1 || pt.stopType === 2 || pt.stopType === 3).sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
    : [];

  const displayDropoffs = routePoints
    ? [...routePoints].filter(pt => pt.stopType === 4 || pt.stopType === 5).sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
    : [];

  const driverName = driverInfo?.fullName || 'Chưa cập nhật';
  const driverPhone = driverInfo?.phoneNumber || 'Chưa cập nhật';
  const driverLicense = driverInfo?.licenseClass && driverInfo?.licenseClass !== 'string' ? driverInfo.licenseClass : 'Chưa cập nhật';
  const driverRating = driverInfo?.driverRatingAverage ?? 0;
  const driverTripsCount = driverInfo?.driverRatingCount ?? 0;
  const driverAvatar = driverInfo?.avatarUrl ? getFullImageUrl(driverInfo.avatarUrl) : logoGroupCar;
  const driverExperience = `Tài xế chuyên nghiệp hạng ${driverLicense}. Đã được xác minh thông tin và có lịch sử hoạt động tốt trên hệ thống.`;

  const tabs = [
    { id: 'pickupDropoff', label: 'Đón/trả' },
    { id: 'driver', label: 'Tài xế' },
    { id: 'reviews', label: 'Đánh giá' },
    { id: 'photos', label: 'Hình ảnh' },
    { id: 'policies', label: 'Chính sách' }
  ];

  return (
    <div className="w-full bg-slate-50 border-t border-slate-200 px-6 py-6 relative animate-fade-in text-left">
      
      {/* Red Close "X" Button in Top-Right */}
      <button 
        onClick={onClose}
        className="absolute top-5 right-6 w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer z-10"
        title="Đóng chi tiết"
      >
        <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Tabs Header Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto pr-12 scrollbar-none gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        
        {/* TAB 1: PICKUP & DROPOFF */}
        {activeTab === 'pickupDropoff' && (
          <div className="flex flex-col gap-6">
            
            {/* Notice Alert Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-sm leading-relaxed text-slate-700">
              <strong className="text-blue-800 font-bold block mb-1 text-base">Lưu ý</strong>
              {details.pickupDropoff.notice}
            </div>

            {isLoadingRoute ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-500 font-semibold">Đang tải lộ trình chuyến xe...</span>
              </div>
            ) : routeError ? (
              <div className="bg-red-50 text-red-700 text-sm font-semibold p-6 rounded-3xl border border-red-200 shadow-sm flex flex-col gap-2">
                <strong className="text-red-800 text-base">Lỗi tải lộ trình</strong>
                <p>{routeError}</p>
              </div>
            ) : !routePoints || routePoints.length === 0 ? (
              <div className="bg-slate-100 text-slate-600 text-sm font-semibold p-6 rounded-3xl text-center">
                Không tìm thấy thông tin lộ trình chuyến xe từ hệ thống.
              </div>
            ) : (
              /* Pick-up / Drop-off Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                
                {/* Pickup Column */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">Điểm đón</h4>
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
                    {displayPickups.map((pt, i) => (
                      <div key={pt.id || i} className="flex gap-3 items-start text-slate-700 text-sm">
                        <div className="font-extrabold text-slate-900 shrink-0 mt-0.5">
                          Điểm
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                        <div>
                          {pt.stopType === 1 && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Khởi hành
                            </span>
                          )}
                          {pt.stopType === 2 && (
                            <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Điểm đón
                            </span>
                          )}
                          {pt.stopType === 3 && (
                            <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Trung chuyển
                            </span>
                          )}
                          <span className="font-medium">{pt.locationName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dropoff Column */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">Điểm trả</h4>
                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {displayDropoffs.map((pt, i) => (
                      <div key={pt.id || i} className="flex gap-3 items-start text-slate-700 text-sm">
                        <div className="font-extrabold text-slate-900 shrink-0 mt-0.5">
                          Điểm
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                        <div>
                          {pt.stopType === 4 && (
                            <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Điểm trả
                            </span>
                          )}
                          {pt.stopType === 5 && (
                            <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Kết thúc
                            </span>
                          )}
                          <span className="font-medium">{pt.locationName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: DRIVER INFO */}
        {activeTab === 'driver' && (
          <div className="flex flex-col gap-4">
            {isLoadingDriver ? (
              <div className="flex items-center justify-center py-12 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-500 font-semibold">Đang tải thông tin tài xế...</span>
              </div>
            ) : driverError ? (
              <div className="bg-red-50 text-red-700 text-sm font-semibold p-6 rounded-3xl border border-red-200 max-w-2xl shadow-sm flex flex-col gap-2">
                <strong className="text-red-800 text-base">Lỗi tải thông tin tài xế</strong>
                <p>{driverError}</p>
              </div>
            ) : !trip.driverId ? (
              <div className="bg-amber-50 text-amber-800 text-sm font-semibold p-6 rounded-3xl border border-amber-200 max-w-2xl">
                Chuyến đi này chưa được gán tài xế chính thức.
              </div>
            ) : !driverInfo ? (
              <div className="bg-slate-100 text-slate-600 text-sm font-semibold p-6 rounded-3xl text-center max-w-2xl">
                Không tìm thấy thông tin tài xế trên hệ thống.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 max-w-2xl">
                <img 
                  src={driverAvatar} 
                  alt={driverName} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-slate-100"
                  onError={(e) => {
                    e.target.src = logoGroupCar;
                  }}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{driverName}</h3>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Bằng {driverLicense}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                    <span>SĐT:</span>
                    <span className="text-slate-800">{driverPhone}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-amber-500 font-bold">★</span>
                    <span className="text-slate-800">{driverRating}</span>
                    <span className="text-slate-400">({driverTripsCount} chuyến lái)</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1 font-medium">
                    {driverExperience}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS & RATINGS */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Ratings Summary Card */}
            <div className="w-full lg:w-72 shrink-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-slate-950">{details.reviews.summary.average}</div>
              <div className="flex items-center gap-0.5 text-amber-500 text-lg my-1">
                {'★'.repeat(Math.round(details.reviews.summary.average))}
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {details.reviews.summary.total} đánh giá khách hàng
              </div>

              {/* Progress bars */}
              <div className="w-full flex flex-col gap-2 mt-4 text-xs font-semibold text-slate-600">
                {details.reviews.summary.stars.map((s) => (
                  <div key={s.count} className="flex items-center gap-2">
                    <span className="w-3 text-right">{s.count}★</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${s.percentage}%` }} />
                    </div>
                    <span className="w-8 text-left text-slate-400">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="flex-1 flex flex-col gap-4">
              {details.reviews.list.map((rev) => (
                <div key={rev.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex gap-4">
                  <img 
                    src={rev.avatar} 
                    alt={rev.author} 
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 flex flex-col gap-1 text-sm">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className="font-bold text-slate-900">{rev.author}</h4>
                      <span className="text-xs text-slate-400 font-semibold">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p className="text-slate-600 leading-relaxed mt-1 font-medium">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: VEHICLE PHOTOS */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {details.photos.map((url, i) => (
              <div key={i} className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group cursor-zoom-in">
                <img 
                  src={url} 
                  alt={`Vehicle view ${i + 1}`} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: POLICIES */}
        {activeTab === 'policies' && (
          <div className="flex flex-col gap-5 max-w-3xl">
            {details.policies.map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <h4 className="text-base font-extrabold text-slate-900 mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  {p.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium pl-4">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TripDetails;
