import React, { useState, useEffect, useMemo } from 'react';
import { getOfferRoutePointsApi } from '@/services/offerRoutePointService';
import { getDriverByIdApi } from '@/services/driverService';
import { getBusRouteDetailByIdApi } from '@/services/busRouteService';
import { getCompanyDriverByIdApi } from '@/services/companyDriverService';
import { getSharedRideDetailApi, getShipmentDetailApi } from '@/services/offerService';
import { getReviewsByRevieweeApi } from '@/services/reviewService';
import logoGroupCar from '@/assets/logoGroupCar.png';

const TripDetails = ({ trip, onClose }) => {
  const [activeTab, setActiveTab] = useState('pickupDropoff');

  const [routePoints, setRoutePoints] = useState([]);
  const [driverInfo, setDriverInfo] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [cargoDetailInfo, setCargoDetailInfo] = useState(null);
  
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);
  
  const [routeError, setRouteError] = useState(null);
  const [driverError, setDriverError] = useState(null);
  const [vehicleError, setVehicleError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  const isSharedRide = trip.service === 'carpool' || trip.tag === 'XE GHÉP' || trip.serviceType === 1 || trip.rawItem?.serviceType === 1;
  const isTruck = trip.service === 'express' || trip.tag === 'XE TẢI' || trip.serviceType === 3 || trip.rawItem?.serviceType === 3;

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

    const fetchAllDetails = async () => {
      setIsLoadingRoute(true);
      setIsLoadingDriver(true);
      setIsLoadingVehicle(true);
      setRouteError(null);
      setDriverError(null);
      setVehicleError(null);

      try {
        let points = [];
        let driverData = null;
        let vehicleData = null;
        let cargoData = null;

        if (isSharedRide) {
          const response = await getSharedRideDetailApi(trip.id);
          const detail = response?.data || response;
          points = detail?.routePoints || [];
          driverData = detail?.driver || null;
          vehicleData = detail?.vehicle || null;
        } else if (isTruck) {
          const response = await getShipmentDetailApi(trip.id);
          const detail = response?.data || response;
          points = detail?.routePoints || [];
          driverData = detail?.driver || null;
          vehicleData = detail?.vehicle || null;
          cargoData = detail?.cargoDetail || null;
        } else {
          // Bus/XE KHÁCH or legacy types
          // Fetch route points
          try {
            if (trip.service === 'bus' || trip.tag === 'XE KHÁCH') {
              const routeId = trip.routeId || trip.rawItem?.routeId || trip.rawItem?.busRouteId;
              if (routeId) {
                const response = await getBusRouteDetailByIdApi(routeId);
                const data = response?.data ?? response;
                const item = Array.isArray(data?.items) ? data.items[0] : data;
                points = item?.routePoints || [];
              } else {
                console.warn("No route ID found for bus service, falling back to offer route points.");
                const response = await getOfferRoutePointsApi(trip.id);
                if (response && response.code === 200) {
                  points = response.data || [];
                } else {
                  points = response?.data ?? response ?? [];
                }
              }
            } else {
              const response = await getOfferRoutePointsApi(trip.id);
              if (response && response.code === 200) {
                points = response.data || [];
              } else {
                points = response?.data ?? response ?? [];
              }
            }
          } catch (routeErr) {
            console.error('Error fetching route points:', routeErr);
            if (isMounted) {
              setRouteError(routeErr.message || 'Không thể tải lộ trình chuyến đi.');
            }
          }

          // Fetch driver info
          const driverId = trip?.driverId;
          if (driverId) {
            try {
              if (trip.service === 'bus' || trip.tag === 'XE KHÁCH') {
                const companyId = trip.companyId || trip.rawItem?.companyId;
                const response = await getCompanyDriverByIdApi(driverId, companyId);
                driverData = response?.data ?? response;
                if (Array.isArray(driverData?.items)) {
                  driverData = driverData.items[0];
                }
              } else {
                const response = await getDriverByIdApi(driverId);
                if (response && response.code === 200) {
                  driverData = response.data;
                } else {
                  driverData = response?.data ?? response;
                }
              }
            } catch (drvErr) {
              console.error('Error fetching driver info:', drvErr);
              if (isMounted) {
                setDriverError(drvErr.message || 'Không thể tải thông tin tài xế.');
              }
            }
          }
        }

        if (isMounted) {
          setRoutePoints(points);
          setDriverInfo(driverData);
          setVehicleInfo(vehicleData);
          setCargoDetailInfo(cargoData);
        }
      } catch (err) {
        console.error('Error fetching trip details:', err);
        if (isMounted) {
          const errMsg = err.message || 'Không thể tải chi tiết chuyến đi.';
          setRouteError(errMsg);
          setDriverError(errMsg);
          setVehicleError(errMsg);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRoute(false);
          setIsLoadingDriver(false);
          setIsLoadingVehicle(false);
        }
      }
    };

    fetchAllDetails();

    return () => {
      isMounted = false;
    };
  }, [trip?.id, trip.routeId, trip.rawItem?.routeId, trip.rawItem?.busRouteId, trip?.driverId, isSharedRide, isTruck]);

  // Fetch reviews khi tab reviews active và có revieweeId
  const revieweeId = trip?.driverId || trip?.rawItem?.driverId || null;
  useEffect(() => {
    if (activeTab !== 'reviews' || !revieweeId) return;
    let isMounted = true;
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      setReviewsError(null);
      try {
        const res = await getReviewsByRevieweeApi(revieweeId);
        const list = res?.data || res || [];
        if (isMounted) setReviews(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        if (isMounted) setReviewsError('Không thể tải danh sách đánh giá.');
      } finally {
        if (isMounted) setIsLoadingReviews(false);
      }
    };
    fetchReviews();
    return () => { isMounted = false; };
  }, [activeTab, revieweeId]);

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

  const sortedPoints = useMemo(() => {
    return routePoints
      ? [...routePoints].sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      : [];
  }, [routePoints]);

  const displayPickups = useMemo(() => {
    return sortedPoints.length > 1
      ? sortedPoints.slice(0, sortedPoints.length - 1).map((pt, idx) => {
          if (idx === 0) {
            return { ...pt, displayStopType: 1 };
          } else {
            return { ...pt, displayStopType: 3 };
          }
        })
      : sortedPoints.map(pt => ({ ...pt, displayStopType: pt.stopType }));
  }, [sortedPoints]);

  const displayDropoffs = useMemo(() => {
    return sortedPoints.length > 1
      ? sortedPoints.slice(1).map((pt, idx, arr) => {
          if (idx === arr.length - 1) {
            return { ...pt, displayStopType: 5 };
          } else {
            return { ...pt, displayStopType: 3 };
          }
        })
      : sortedPoints.map(pt => ({ ...pt, displayStopType: pt.stopType }));
  }, [sortedPoints]);

  const driverName = driverInfo?.name || driverInfo?.fullName || 'Chưa cập nhật';
  const driverPhone = driverInfo?.phoneNumber || 'Chưa cập nhật';
  const driverLicense = driverInfo?.licenseClass && driverInfo?.licenseClass !== 'string' ? driverInfo.licenseClass : 'Chưa cập nhật';
  const driverRating = driverInfo?.ratingAverage ?? driverInfo?.driverRatingAverage ?? 0;
  const driverTripsCount = driverInfo?.ratingCount ?? driverInfo?.driverRatingCount ?? 0;
  const driverAvatar = driverInfo?.avatarUrl ? getFullImageUrl(driverInfo.avatarUrl) : logoGroupCar;
  const driverExperience = `Tài xế chuyên nghiệp hạng ${driverLicense}. Đã được xác minh thông tin và có lịch sử hoạt động tốt trên hệ thống.`;

  const tabs = [
    { id: 'pickupDropoff', label: 'Đón/trả' },
    { id: 'driver', label: 'Tài xế' },
    { id: 'vehicle', label: 'Phương tiện' },
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
                          {pt.displayStopType === 1 && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Khởi hành
                            </span>
                          )}
                          {pt.displayStopType === 2 && (
                            <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Điểm đón
                            </span>
                          )}
                          {pt.displayStopType === 3 && (
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
                          {pt.displayStopType === 3 && (
                            <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Trung chuyển
                            </span>
                          )}
                          {pt.displayStopType === 4 && (
                            <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-md mr-1.5 tracking-wide">
                              Điểm trả
                            </span>
                          )}
                          {pt.displayStopType === 5 && (
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

        {/* TAB 2.5: VEHICLE INFO */}
        {activeTab === 'vehicle' && (
          <div className="flex flex-col gap-4">
            {isLoadingVehicle ? (
              <div className="flex items-center justify-center py-12 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-500 font-semibold">Đang tải thông tin phương tiện...</span>
              </div>
            ) : vehicleError ? (
              <div className="bg-red-50 text-red-700 text-sm font-semibold p-6 rounded-3xl border border-red-200 max-w-2xl shadow-sm flex flex-col gap-2">
                <strong className="text-red-800 text-base">Lỗi tải thông tin phương tiện</strong>
                <p>{vehicleError}</p>
              </div>
            ) : !vehicleInfo ? (
              <div className="bg-slate-100 text-slate-600 text-sm font-semibold p-6 rounded-3xl text-center max-w-2xl">
                Không tìm thấy thông tin phương tiện trên hệ thống.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 max-w-2xl">
                <img 
                  src={vehicleInfo?.urlImage ? getFullImageUrl(vehicleInfo.urlImage) : logoGroupCar} 
                  alt={vehicleInfo?.brand || 'Phương tiện'} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-slate-100 bg-slate-50"
                  onError={(e) => {
                    e.target.src = logoGroupCar;
                  }}
                />
                <div className="flex flex-col gap-2 justify-center">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{vehicleInfo?.brand || 'Chưa cập nhật'}</h3>
                    {vehicleInfo?.plateNumber && (
                      <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                        BKS: {vehicleInfo.plateNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-500 flex flex-col gap-1.5 mt-1">
                    <div>
                      Sức chứa: <strong className="text-slate-800">{vehicleInfo?.seatCapacity || 0} chỗ</strong>
                    </div>
                    {isTruck && cargoDetailInfo && (
                      <div className="flex flex-col gap-1 mt-1 border-t border-slate-100 pt-1.5 text-xs text-slate-500">
                        <div>
                          Trọng tải tối đa: <strong className="text-slate-800">{cargoDetailInfo.maxWeight?.toLocaleString() || 0} kg</strong>
                        </div>
                        <div>
                          Thể tích tối đa: <strong className="text-slate-800">{cargoDetailInfo.maxVolume || 0} m³</strong>
                        </div>
                        {cargoDetailInfo.acceptFragile && (
                          <div className="text-emerald-600 font-bold mt-0.5">
                            ✓ Nhận vận chuyển hàng dễ vỡ
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS & RATINGS */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-6">
            {/* Summary header */}
            {trip.rating != null && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-5">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-950">{trip.rating?.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-0.5 text-amber-400 text-lg my-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={s <= Math.round(trip.rating) ? 'text-amber-400' : 'text-slate-200'}>★</span>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">{trip.reviewsCount} đánh giá</div>
                </div>
                <div className="w-px h-16 bg-slate-100" />
                <div className="text-sm font-semibold text-slate-500">
                  Đánh giá từ người dùng thực tế trên hệ thống
                </div>
              </div>
            )}

            {/* Reviews list */}
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-slate-500 font-semibold">Đang tải đánh giá...</span>
              </div>
            ) : reviewsError ? (
              <div className="bg-red-50 text-red-700 text-sm font-semibold p-5 rounded-3xl border border-red-200">
                {reviewsError}
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 text-center">
                <span className="text-3xl block mb-3">💬</span>
                <p className="text-slate-500 font-semibold text-sm">Chưa có đánh giá nào cho tài xế này.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((rev) => {
                  const dateStr = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : '--';
                  const initials = (rev.reviewerName || 'U').charAt(0).toUpperCase();
                  return (
                    <div key={rev.reviewId} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex gap-4">
                      {/* Avatar initials */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-black text-base flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 flex flex-col gap-1 text-sm">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h4 className="font-bold text-slate-900">{rev.reviewerName || 'Người dùng'}</h4>
                          <span className="text-xs text-slate-400 font-semibold">{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-base ${s <= rev.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                          ))}
                        </div>
                        {rev.comment && (
                          <p className="text-slate-600 leading-relaxed mt-1 font-medium">{rev.comment}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
