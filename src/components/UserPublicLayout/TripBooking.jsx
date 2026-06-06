import React, { useState, useRef, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getOfferRoutePointsApi } from '@/services/offerRoutePointService';
import { getBusRouteDetailByIdApi } from '@/services/busRouteService';
import { createShipmentRequestApi, createShipmentOfferApi } from '@/services/shipmentService';
import { getUserProfileApi } from '@/services/userService';
import { createBookingApi } from '@/services/offerService';
import { getShowtimeSeatMapApi } from '@/services/showtimeService';
import { createBusBookingApi } from '@/services/busBookingService';

// Steering wheel icon
const SteeringWheelIcon = ({ className = '' }) => (
  <svg className={`${className} text-slate-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
  </svg>
);

// Custom interactive Seat SVG representation matching the design legends
const SeatIcon = ({ className = '', type = 'cuoi', isSelected = false, isBlocked = false }) => {
  if (isBlocked) {
    return (
      <svg className={`${className} w-8 h-8 text-slate-300`} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3.5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (isSelected) {
    return (
      <svg className={`${className} w-8 h-8 text-emerald-500`} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3.5" fill="#DEF7EC" stroke="#31C48D" strokeWidth="2.5" />
        <path d="M9 12l2 2 4-4" fill="none" stroke="#31C48D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Base configurations for outline seats (uniform blue color)
  let strokeColor = '#3B82F6'; // Blue
  let fillColor = '#EFF6FF';   // Light blue

  return (
    <svg className={`${className} w-8 h-8`} viewBox="0 0 24 24" strokeWidth="2" stroke={strokeColor} fill="none">
      {/* Outer seat shell */}
      <rect x="5" y="4" width="14" height="14" rx="2.5" fill={fillColor} />
      {/* Left armrest */}
      <rect x="3" y="10" width="2" height="7" rx="0.5" fill={fillColor} />
      {/* Right armrest */}
      <rect x="19" y="10" width="2" height="7" rx="0.5" fill={fillColor} />
      {/* Inner seat cushion */}
      <rect x="6" y="12" width="12" height="5" rx="1" fill={fillColor} />
    </svg>
  );
};

const TripBooking = ({ trip, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [carpoolSeatsCount, setCarpoolSeatsCount] = useState(1);
  const [selectedPickups, setSelectedPickups] = useState([]);
  const [selectedDropoffs, setSelectedDropoffs] = useState([]);

  const activeSeats = useMemo(() => {
    if (trip.service === 'carpool') {
      return Array.from({ length: carpoolSeatsCount }, (_, i) => ({
        code: `Chỗ ${i + 1}`,
        price: trip.price || 0
      }));
    }
    return selectedSeats;
  }, [trip.service, trip.price, carpoolSeatsCount, selectedSeats]);

  // New States for Step 3 & 4
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'transfer' or 'cash'

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargo Form States (for Xe tải / Shipment)
  const [deliveryDate, setDeliveryDate] = useState('');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [description, setDescription] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [handlingNote, setHandlingNote] = useState('');
  const [proposedPrice, setProposedPrice] = useState(trip.price || '');
  const [imageFile, setImageFile] = useState(null);

  // Dynamic Route Points State
  const [routePoints, setRoutePoints] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Dynamic Seat Layout
  const [seatLayout, setSeatLayout] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [seatsError, setSeatsError] = useState(null);
  const [layoutRows, setLayoutRows] = useState(8);
  const [layoutCols, setLayoutCols] = useState(5);

  // Fetch current user profile on mount to fill in passenger info
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfileApi();
        const profile = response?.data || response;
        if (profile) {
          if (profile.fullName) setPassengerName(profile.fullName);
          if (profile.phoneNumber) setPassengerPhone(profile.phoneNumber);
          if (profile.email) setPassengerEmail(profile.email);
        }
      } catch (err) {
        console.warn("Could not fetch user profile for trip booking:", err);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch route points dynamically
  useEffect(() => {
    if (!trip?.id) return;
    let isMounted = true;
    const fetchRoute = async () => {
      setIsLoadingRoute(true);
      try {
        let points = [];
        if (trip.service === 'bus' || trip.tag === 'XE KHÁCH') {
          const routeId = trip.routeId || trip.rawItem?.routeId || trip.rawItem?.busRouteId;
          if (routeId) {
            const response = await getBusRouteDetailByIdApi(routeId);
            const data = response?.data ?? response;
            const item = Array.isArray(data?.items) ? data.items[0] : data;
            points = item?.routePoints || [];
          } else {
            console.warn("No route ID found for bus service booking, falling back to offer route points.");
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
        if (isMounted) {
          setRoutePoints(points);
        }
      } catch (err) {
        console.error("Error fetching route points for booking:", err);
      } finally {
        if (isMounted) {
          setIsLoadingRoute(false);
        }
      }
    };
    fetchRoute();
    return () => { isMounted = false; };
  }, [trip?.id, trip.routeId, trip.rawItem?.routeId, trip.rawItem?.busRouteId]);

  // Fetch seat map dynamically for passenger (bus) trips
  useEffect(() => {
    if (trip.service === 'express' || trip.service === 'carpool') {
      return;
    }
    if (!trip?.id) return;

    let isMounted = true;
    const fetchSeatMap = async () => {
      setIsLoadingSeats(true);
      setSeatsError(null);
      try {
        const response = await getShowtimeSeatMapApi(trip.id);
        const data = response?.data ?? response;

        const seatLayoutData = data?.seatLayout;
        const layoutJson = seatLayoutData?.layoutJson;
        const layoutSeats = Array.isArray(layoutJson?.seats) ? layoutJson.seats : [];
        const dynamicSeats = Array.isArray(data?.seats) ? data.seats : [];

        const maxRows = typeof layoutJson?.rows === 'number' ? layoutJson.rows : 8;
        const maxCols = typeof layoutJson?.cols === 'number' ? layoutJson.cols : 5;

        const statusMap = {};
        dynamicSeats.forEach(ds => {
          if (ds.seatNumber) {
            statusMap[ds.seatNumber] = ds.status;
          }
        });

        if (isMounted) {
          setLayoutRows(maxRows);
          setLayoutCols(maxCols);

          let mappedSeats = [];
          if (layoutSeats.length > 0) {
            mappedSeats = layoutSeats.map((seat, index) => {
              const seatNumber = seat.seatNumber;
              const status = statusMap[seatNumber] || 'Available';
              const isBlocked = seat.type === 'driver' || status !== 'Available';

              let type = 'giua';
              if (seat.type === 'driver') {
                type = 'driver';
              } else if (seat.isLastRow) {
                type = 'cuoi';
              } else if (seat.row <= 1) {
                type = 'dau';
              }

              return {
                ...seat,
                code: seatNumber,
                type,
                price: trip.price || 230000,
                originalPrice: (trip.price || 230000) + 40000,
                isBlocked,
                row: seat.row,
                col: seat.col
              };
            });
          }
          setSeatLayout(mappedSeats);
        }
      } catch (err) {
        console.error("Error fetching seat map:", err);
        if (isMounted) {
          setSeatsError("Không thể tải sơ đồ ghế từ hệ thống.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingSeats(false);
        }
      }
    };

    fetchSeatMap();
    return () => {
      isMounted = false;
    };
  }, [trip?.id, trip.price, trip.service]);

  // Pickups and dropoffs extracted from route points
  const sortedPoints = useMemo(() => {
    return routePoints
      ? [...routePoints].sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      : [];
  }, [routePoints]);

  const pickups = useMemo(() => {
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

  const dropoffs = useMemo(() => {
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

  // Default select first item of pickup/dropoff once loaded
  useEffect(() => {
    if (pickups.length > 0 && selectedPickups.length === 0) {
      setSelectedPickups([pickups[0]]);
    }
    if (dropoffs.length > 0 && selectedDropoffs.length === 0) {
      setSelectedDropoffs([dropoffs[0]]);
    }
  }, [routePoints, pickups, dropoffs, selectedPickups, selectedDropoffs]);

  // Generate random booking code once
  useEffect(() => {
    if (!bookingCode) {
      setBookingCode(`VX${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [bookingCode]);



  const handleSeatClick = (seat) => {
    if (seat.isBlocked) return;

    const isAlreadySelected = selectedSeats.some(s => s.code === seat.code);
    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => s.code !== seat.code));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
    setErrorMessage('');
  };

  const handlePickupSelect = (item) => {
    const isSelected = selectedPickups.some(p => p.id === item.id);
    const maxSelect = trip.service === 'carpool' ? carpoolSeatsCount : 1;

    if (isSelected) {
      setSelectedPickups(selectedPickups.filter(p => p.id !== item.id));
    } else {
      if (selectedPickups.length < maxSelect) {
        setSelectedPickups([...selectedPickups, item]);
      } else {
        if (maxSelect === 1) {
          setSelectedPickups([item]);
        } else {
          toast.error(`Bạn chỉ được chọn tối đa ${maxSelect} điểm đón.`);
        }
      }
    }
  };

  const handleDropoffSelect = (item) => {
    const isSelected = selectedDropoffs.some(d => d.id === item.id);
    const maxSelect = trip.service === 'carpool' ? carpoolSeatsCount : 1;

    if (isSelected) {
      setSelectedDropoffs(selectedDropoffs.filter(d => d.id !== item.id));
    } else {
      if (selectedDropoffs.length < maxSelect) {
        setSelectedDropoffs([...selectedDropoffs, item]);
      } else {
        if (maxSelect === 1) {
          setSelectedDropoffs([item]);
        } else {
          toast.error(`Bạn chỉ được chọn tối đa ${maxSelect} điểm trả.`);
        }
      }
    }
  };

  const [isBookingProcessing, setIsBookingProcessing] = useState(false);

  const handleSeatContinue = () => {
    if (trip.service === 'express') {
      if (!deliveryDate) {
        setErrorMessage('Vui lòng nhập ngày giao hàng.');
        return;
      }
      if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
        setErrorMessage('Vui lòng nhập khối lượng hợp lệ (Weight > 0).');
        return;
      }
      if (!volume || isNaN(volume) || parseFloat(volume) <= 0) {
        setErrorMessage('Vui lòng nhập thể tích hợp lệ (Volume > 0).');
        return;
      }
      if (!proposedPrice || isNaN(proposedPrice) || parseFloat(proposedPrice) <= 0) {
        setErrorMessage('Vui lòng nhập giá đề xuất hợp lệ (Proposed Price > 0).');
        return;
      }
      if (!description.trim()) {
        setErrorMessage('Vui lòng nhập mô tả hàng hóa.');
        return;
      }
    } else if (trip.service === 'carpool') {
      const maxSeats = parseInt(trip.availableSeats, 10) || 4;
      if (carpoolSeatsCount < 1 || carpoolSeatsCount > maxSeats) {
        setErrorMessage(`Vui lòng chọn số lượng ghế hợp lệ (từ 1 đến ${maxSeats} ghế).`);
        return;
      }
    } else {
      if (selectedSeats.length === 0) {
        setErrorMessage('Vui lòng chọn ít nhất 1 chỗ ngồi trước khi tiếp tục.');
        return;
      }
    }
    setStep(2);
    setErrorMessage('');
  };

  const handlePickupContinue = () => {
    if (selectedPickups.length === 0 || selectedDropoffs.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 điểm đón và 1 điểm trả.');
      return;
    }
    setStep(3);
    setErrorMessage('');
  };

  const handlePassengerContinue = () => {
    if (!passengerName.trim() || !passengerPhone.trim() || !passengerEmail.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên, số điện thoại và email.');
      return;
    }
    // Simple email & phone regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerEmail)) {
      setErrorMessage('Email không đúng định dạng.');
      return;
    }
    if (passengerPhone.length < 9) {
      setErrorMessage('Số điện thoại không hợp lệ.');
      return;
    }
    setStep(4);
    setErrorMessage('');
  };

  const handlePaymentConfirm = async () => {
    setErrorMessage('');
    if (trip.service === 'express') {
      setIsBookingProcessing(true);
      try {
        // 1. Call API to create shipment request using FormData
        const formData = new FormData();
        formData.append('DeliveryDate', deliveryDate);
        formData.append('Weight', parseFloat(weight));
        formData.append('Volume', parseFloat(volume));
        formData.append('Description', description);
        formData.append('IsFragile', isFragile);
        formData.append('HandlingNote', handlingNote || '');
        if (imageFile) {
          formData.append('ImageUrl', imageFile);
        }
        if (selectedPickups[0]?.locationId) {
          formData.append('PickupLocationId', selectedPickups[0].locationId);
        }
        if (selectedDropoffs[0]?.locationId) {
          formData.append('DropoffLocationId', selectedDropoffs[0].locationId);
        }

        const reqResponse = await createShipmentRequestApi(formData);
        const requestId = reqResponse?.data?.id || reqResponse?.data || reqResponse?.id;

        if (!requestId) {
          throw new Error("Không lấy được ID từ yêu cầu vận chuyển trả về.");
        }

        // 2. Call API to create shipment offer
        const offerRequestData = {
          requestId: requestId,
          offerId: trip.id,
          proposedPrice: parseFloat(proposedPrice)
        };

        await createShipmentOfferApi(offerRequestData);

        // 3. Success
        toast.success("Yêu cầu vận chuyển đã được gửi thành công!");
        setBookingSuccess(true);
      } catch (err) {
        console.error("Booking error:", err);
        const errMsg = err.response?.data?.message || err.message || "Đã xảy ra lỗi trong quá trình gửi yêu cầu vận chuyển. Vui lòng thử lại.";
        setErrorMessage(errMsg);
        toast.error(errMsg);
      } finally {
        setIsBookingProcessing(false);
      }
    } else if (trip.service === 'carpool') {
      setIsBookingProcessing(true);
      try {
        // Construct the itemRequestDTOs array of length carpoolSeatsCount
        const itemRequestDTOs = Array.from({ length: carpoolSeatsCount }, (_, i) => {
          const pickupItem = i < selectedPickups.length
            ? selectedPickups[i]
            : selectedPickups[selectedPickups.length - 1];

          const dropoffItem = i < selectedDropoffs.length
            ? selectedDropoffs[i]
            : selectedDropoffs[selectedDropoffs.length - 1];

          return {
            pickupLocationId: pickupItem.locationId || pickupItem.id,
            dropoffLocationId: dropoffItem.locationId || dropoffItem.id,
            price: trip.price || 0
          };
        });

        const bookingData = {
          offerId: trip.id,
          itemRequestDTOs: itemRequestDTOs
        };

        await createBookingApi(bookingData);

        toast.success("Đặt vé xe ghép thành công!");
        setBookingSuccess(true);
      } catch (err) {
        console.error("Booking error:", err);
        const errMsg = err.response?.data?.message || err.message || "Đã xảy ra lỗi trong quá trình đặt vé. Vui lòng thử lại.";
        setErrorMessage(errMsg);
        toast.error(errMsg);
      } finally {
        setIsBookingProcessing(false);
      }
    } else {
      setIsBookingProcessing(true);
      try {
        const bookingData = {
          showtimeId: trip.id,
          status: 1,
          seatNumbers: selectedSeats.map(s => s.code)
        };

        await createBusBookingApi(bookingData);

        toast.success("Đặt vé thành công!");
        setBookingSuccess(true);
      } catch (err) {
        console.error("Booking error:", err);
        const errMsg = err.response?.data?.message || err.message || "Đã xảy ra lỗi trong quá trình đặt vé. Vui lòng thử lại.";
        setErrorMessage(errMsg);
        toast.error(errMsg);
      } finally {
        setIsBookingProcessing(false);
      }
    }
  };

  const calculateTotalPrice = () => {
    if (trip.service === 'express') {
      return parseFloat(proposedPrice) || 0;
    }
    return activeSeats.reduce((acc, curr) => acc + (curr.price || 0), 0);
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()}đ`;
  };

  if (bookingSuccess) {
    return (
      <div className="w-full bg-slate-50 border-t border-slate-200 px-6 py-8 relative animate-fade-in text-left">
        {/* Red Close "X" Button in Top-Right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
          {/* Decorative receipt punch out circles */}
          <div className="absolute left-0 top-1/4 -translate-y-1/2 w-4 h-8 bg-slate-50 border-r border-slate-200 rounded-r-full" />
          <div className="absolute right-0 top-1/4 -translate-y-1/2 w-4 h-8 bg-slate-50 border-l border-slate-200 rounded-l-full" />

          {/* Header Success Status */}
          <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-dashed border-slate-200 mb-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Đặt Vé Thành Công!</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Mã đặt chỗ: <span className="text-blue-600 font-extrabold uppercase">{bookingCode}</span></p>
          </div>

          {/* Receipt Info Body */}
          <div className="flex flex-col gap-3.5 text-xs text-slate-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-400">Nhà xe / Đơn vị:</span>
              <span className="font-extrabold text-slate-800">{trip.operator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dịch vụ:</span>
              <span className="font-bold text-slate-800 uppercase text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100">{trip.tag}</span>
            </div>
            {trip.service === 'express' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thông số hàng hóa:</span>
                  <span className="font-extrabold text-slate-800">{weight} kg • {volume} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hàng dễ vỡ:</span>
                  <span className="font-extrabold text-slate-800">{isFragile ? 'Có' : 'Không'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày giao hàng:</span>
                  <span className="font-extrabold text-slate-800">{deliveryDate}</span>
                </div>
                <div className="flex flex-col gap-0.5 text-left bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Mô tả hàng hóa:</span>
                  <span className="text-slate-700 font-semibold leading-normal">{description}</span>
                </div>
                {handlingNote && (
                  <div className="flex flex-col gap-0.5 text-left bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Lưu ý bốc xếp:</span>
                    <span className="text-slate-700 font-semibold leading-normal">{handlingNote}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-slate-400">{trip.service === 'carpool' ? 'Số lượng ghế đặt:' : 'Số ghế đã chọn:'}</span>
                <span className="font-extrabold text-slate-800">{activeSeats.map(s => s.code).join(', ')}</span>
              </div>
            )}

            <div className="border-t border-slate-100 my-0.5" />

            {/* Passenger Info */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-400">Hành khách:</span>
              <div className="text-slate-800 font-bold">
                {passengerName} • {passengerPhone}
                <div className="text-slate-500 font-medium text-[11px]">{passengerEmail}</div>
              </div>
            </div>

            {/* Selected locations */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400">Điểm đón khách:</span>
              <div className="flex flex-col gap-1.5">
                {selectedPickups.map((pickup, idx) => (
                  <div key={pickup.id} className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100">
                    <strong className="text-slate-800 text-xs font-extrabold block">
                      {selectedPickups.length > 1 ? `${idx + 1}. ` : ''}{pickup?.locationName}
                    </strong>
                    <span className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5 block">
                      Thứ tự điểm đón: {pickup?.sequence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400">Điểm trả khách:</span>
              <div className="flex flex-col gap-1.5">
                {selectedDropoffs.map((dropoff, idx) => (
                  <div key={dropoff.id} className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100">
                    <strong className="text-slate-800 text-xs font-extrabold block">
                      {selectedDropoffs.length > 1 ? `${idx + 1}. ` : ''}{dropoff?.locationName}
                    </strong>
                    <span className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5 block">
                      Thứ tự điểm trả: {dropoff?.sequence}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 my-0.5" />

            <div className="flex justify-between">
              <span className="text-slate-400">Thanh toán:</span>
              <span className="font-extrabold text-slate-800">
                {paymentMethod === 'transfer' ? 'Chuyển khoản (Techcombank)' : 'Tiền mặt khi lên xe'}
              </span>
            </div>

            <div className="border-t border-slate-100 my-0.5" />

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-extrabold text-slate-900 text-sm">Tổng cộng:</span>
              <span className="text-xl font-black text-emerald-600">{formatPrice(calculateTotalPrice())}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-extrabold py-3.5 px-6 rounded-2xl cursor-pointer shadow-md transition-all duration-300 text-center uppercase tracking-wider"
            >
              Hoàn tất giao dịch
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 border-t border-slate-200 px-6 py-6 relative animate-fade-in text-left">
      {/* Red Close "X" Button in Top-Right */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer z-10"
        title="Đóng"
      >
        <svg className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Step Progress Bar Header (4 Steps) */}
      <div className="flex items-center justify-start border-b border-slate-200 pb-4 mb-4 pr-12 overflow-x-auto scrollbar-none gap-2">
        {/* Step 1 */}
        <div className="flex items-center gap-2 shrink-0">
          {step === 1 ? (
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
              <span>{trip.service === 'express' ? 'Thông tin hàng hóa' : (trip.service === 'carpool' ? 'Số lượng ghế' : 'Chỗ mong muốn')}</span>
            </div>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center bg-white">
                <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>{trip.service === 'express' ? 'Thông tin hàng hóa' : (trip.service === 'carpool' ? 'Số lượng ghế' : 'Chỗ mong muốn')}</span>
            </button>
          )}
        </div>

        <div className={`w-10 md:w-16 h-[1.5px] shrink-0 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2 shrink-0">
          {step < 2 ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[11px] font-black flex items-center justify-center">2</span>
              <span>Điểm đón trả</span>
            </div>
          ) : step === 2 ? (
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
              <span>Điểm đón trả</span>
            </div>
          ) : (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center bg-white">
                <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Điểm đón trả</span>
            </button>
          )}
        </div>

        <div className={`w-10 md:w-16 h-[1.5px] shrink-0 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />

        {/* Step 3 */}
        <div className="flex items-center gap-2 shrink-0">
          {step < 3 ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[11px] font-black flex items-center justify-center">3</span>
              <span>Xác nhận thông tin</span>
            </div>
          ) : step === 3 ? (
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
              <span>Xác nhận thông tin</span>
            </div>
          ) : (
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center bg-white">
                <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Xác nhận thông tin</span>
            </button>
          )}
        </div>

        <div className={`w-10 md:w-16 h-[1.5px] shrink-0 ${step >= 4 ? 'bg-blue-600' : 'bg-slate-200'}`} />

        {/* Step 4 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-2 text-sm ${step === 4 ? 'font-extrabold text-slate-800' : 'font-semibold text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center ${step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>4</span>
            <span>Thanh toán</span>
          </div>
        </div>
      </div>

      {/* STEP 1: CHỖ MONG MUỐN / THÔNG TIN HÀNG HÓA */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          {trip.service === 'express' ? (
            /* CARGO DETAILS FORM */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Nhập thông tin hàng hóa vận chuyển</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DeliveryDate */}
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Ngày giao hàng  <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    value={deliveryDate}
                    onChange={(e) => { setDeliveryDate(e.target.value); setErrorMessage(''); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* ProposedPrice */}
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Giá đề xuất (VND) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => { setProposedPrice(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập giá đề xuất"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weight */}
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Khối lượng (Weight - kg) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => { setWeight(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập khối lượng hàng hóa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Volume */}
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Thể tích (Volume - m³) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    value={volume}
                    onChange={(e) => { setVolume(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập thể tích hàng hóa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image File Selector */}
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Ảnh hàng hóa (Image)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold px-4 py-3 rounded-xl border border-blue-200 cursor-pointer transition-colors w-full text-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{imageFile ? 'Chọn ảnh khác' : 'Tải ảnh lên'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                            setErrorMessage('');
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imageFile && (
                    <div className="mt-1 text-slate-500 font-semibold truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>{imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>

                {/* IsFragile */}
                <div className="flex items-center gap-3 text-xs text-left h-full pt-5">
                  <input
                    type="checkbox"
                    id="isFragile"
                    checked={isFragile}
                    onChange={(e) => { setIsFragile(e.target.checked); setErrorMessage(''); }}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isFragile" className="font-extrabold text-slate-700 cursor-pointer select-none">Hàng dễ vỡ </label>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 text-xs text-left">
                <label className="font-extrabold text-slate-500">Mô tả hàng hóa <span className="text-red-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrorMessage(''); }}
                  placeholder="Mô tả loại hàng hóa, quy cách đóng gói..."
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* HandlingNote */}
              <div className="flex flex-col gap-1.5 text-xs text-left">
                <label className="font-extrabold text-slate-500">Ghi chú bốc xếp </label>
                <textarea
                  value={handlingNote}
                  onChange={(e) => { setHandlingNote(e.target.value); setErrorMessage(''); }}
                  placeholder="Lưu ý bốc dỡ hàng nhẹ tay, yêu cầu ràng buộc kỹ..."
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                />
              </div>
            </div>
          ) : trip.service === 'carpool' ? (
            /* CARPOOL SEATS SELECTOR */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center gap-6 min-h-[300px]">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-black text-slate-800">Chọn số lượng ghế đặt</h4>
                <p className="text-slate-500 text-xs font-semibold mt-1">Số ghế còn trống trên xe: <span className="text-emerald-600 font-extrabold text-sm">{trip.availableSeats || 4} ghế</span></p>
              </div>

              {/* Counter Control */}
              <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                <button
                  type="button"
                  disabled={carpoolSeatsCount <= 1}
                  onClick={() => setCarpoolSeatsCount(prev => prev - 1)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors cursor-pointer ${carpoolSeatsCount <= 1
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 active:scale-95'
                    }`}
                >
                  −
                </button>

                <span className="text-2xl font-black text-slate-800 w-12 text-center select-none">
                  {carpoolSeatsCount}
                </span>

                <button
                  type="button"
                  disabled={carpoolSeatsCount >= (parseInt(trip.availableSeats, 10) || 4)}
                  onClick={() => setCarpoolSeatsCount(prev => prev + 1)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors cursor-pointer ${carpoolSeatsCount >= (parseInt(trip.availableSeats, 10) || 4)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 active:scale-95'
                    }`}
                >
                  +
                </button>
              </div>

              <div className="text-center max-w-sm">
                <p className="text-[11px] font-medium text-slate-400 leading-normal">
                  Bạn có thể đặt tối đa bằng số lượng ghế còn lại của chuyến xe. Giá vé mỗi ghế là <span className="font-extrabold text-slate-700">{formatPrice(trip.price || 0)}</span>.
                </p>
              </div>
            </div>
          ) : (
            /* SEAT SELECTOR FOR PASSENGER TRIPS */
            <>
              {/* Alert Guarantee Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Vexere cam kết giữ đúng chỗ bạn đã chọn.</span>
              </div>

              {/* Seat Layout and Legend Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-2">

                {/* Legends Column */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">Chú thích</h3>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <SeatIcon isBlocked={true} />
                      <span className="text-xs font-semibold text-slate-500">Đã được đặt</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <SeatIcon isSelected={true} />
                      <span className="text-xs font-semibold text-slate-500">Đang chọn</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <SeatIcon />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Ghế trống</span>
                        <span className="text-xs font-semibold text-slate-500">{formatPrice(trip.price || 230000)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seat Map Column */}
                <div className="md:col-span-7 flex justify-center">
                  <div className="bg-slate-100/70 p-6 rounded-[32px] border border-slate-200/50 w-full max-w-[260px] flex flex-col items-center min-h-[250px] justify-center">

                    {isLoadingSeats ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-slate-500 font-semibold text-xs mt-2">Đang tải sơ đồ ghế...</span>
                      </div>
                    ) : seatsError ? (
                      <div className="text-red-500 text-xs font-semibold text-center py-8">
                        {seatsError}
                      </div>
                    ) : seatLayout.length === 0 ? (
                      <div className="text-slate-500 text-xs font-semibold text-center py-8">
                        Không có sơ đồ ghế cho chuyến này.
                      </div>
                    ) : (
                      <>
                        <div className="w-full flex justify-between items-center mb-6 px-3">
                          <SteeringWheelIcon className="w-7 h-7" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/40 py-1 px-2.5 rounded-full border border-slate-200">Khoang lái</span>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                          {Array.from({ length: layoutRows }).map((_, rowNum) => {
                            return (
                              <div key={rowNum} className="grid gap-3 justify-items-center w-full" style={{ gridTemplateColumns: `repeat(${layoutCols}, minmax(0, 1fr))` }}>
                                {Array.from({ length: layoutCols }).map((_, colIdx) => {
                                  const seat = seatLayout.find(s => s.row === rowNum && s.col === colIdx);
                                  if (!seat) {
                                    return <div key={colIdx} className="w-8 h-8" />;
                                  }
                                  if (seat.type === 'driver') {
                                    return (
                                      <div key={colIdx} className="w-8 h-8 flex items-center justify-center">
                                        <SteeringWheelIcon className="w-7 h-7" />
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      key={seat.code}
                                      onClick={() => handleSeatClick(seat)}
                                      className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                    >
                                      <SeatIcon
                                        type={seat.type}
                                        isBlocked={seat.isBlocked}
                                        isSelected={selectedSeats.some(s => s.code === seat.code)}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                  </div>
                </div>

              </div>
            </>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 font-bold text-xs mt-2 text-center animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {trip.service === 'express' ? 'Khối lượng / Thể tích' : (trip.service === 'carpool' ? 'Số lượng ghế đặt' : 'Số ghế chọn')}
              </div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                {trip.service === 'express'
                  ? (weight || volume ? `${weight || 0} kg • ${volume || 0} m³` : 'Chưa nhập')
                  : (activeSeats.length > 0 ? activeSeats.map(s => s.code).join(', ') : 'Chưa chọn')}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng cộng</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handleSeatContinue}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all duration-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ĐIỂM ĐON TRẢ */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          {/* Guarantee Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>An tâm được đón đúng nơi, trả đúng chỗ đã chọn và dễ dàng thay đổi khi cần.</span>
          </div>

          {/* Two Columns Grid */}
          {isLoadingRoute ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-500 font-semibold mt-2">Đang tải danh sách điểm đón/trả...</span>
            </div>
          ) : pickups.length === 0 && dropoffs.length === 0 ? (
            <div className="bg-slate-100 text-slate-600 text-sm font-semibold p-6 rounded-3xl text-center">
              Không tìm thấy thông tin lộ trình điểm đón/trả của chuyến xe từ hệ thống.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Column Pickups */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <h4 className="text-base font-extrabold text-slate-900">Điểm đón</h4>
                </div>

                <div className="flex flex-col max-h-[300px] overflow-y-auto pr-1">
                  {pickups.map((item) => {
                    const isSelected = selectedPickups.some(p => p.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handlePickupSelect(item)}
                        className={`flex items-start justify-between gap-4 p-4 border-b border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'border-l-4 border-l-blue-600 pl-3' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex items-center justify-center shrink-0">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                            )}
                          </div>
                          <div className="text-xs text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm">Điểm</span>
                              <span className="font-extrabold text-slate-800 text-sm">{item.locationName}</span>
                            </div>
                            <div className="mt-1.5 flex gap-2 flex-wrap">
                              {item.displayStopType === 1 && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
                                  Khởi hành
                                </span>
                              )}
                              {item.displayStopType === 2 && (
                                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
                                  Điểm đón
                                </span>
                              )}
                              {item.displayStopType === 3 && (
                                <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
                                  Trung chuyển
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column Dropoffs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <h4 className="text-base font-extrabold text-slate-900">Điểm trả</h4>
                </div>

                <div className="flex flex-col max-h-[300px] overflow-y-auto pr-1">
                  {dropoffs.map((item) => {
                    const isSelected = selectedDropoffs.some(d => d.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleDropoffSelect(item)}
                        className={`flex items-start justify-between gap-4 p-4 border-b border-slate-100 relative cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'border-l-4 border-l-blue-600 pl-3' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex items-center justify-center shrink-0">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                            )}
                          </div>
                          <div className="text-xs text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm">Điểm</span>
                              <span className="font-extrabold text-slate-800 text-sm">{item.locationName}</span>
                            </div>
                            <div className="mt-1.5 flex gap-2 flex-wrap">
                              {item.displayStopType === 3 && (
                                <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
                                  Trung chuyển
                                </span>
                              )}
                              {item.displayStopType === 4 && (
                                <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
                                  Điểm trả
                                </span>
                              )}
                              {item.displayStopType === 5 && (
                                <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wide">
                                  Kết thúc
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 font-bold text-xs mt-2 text-center animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <button
              onClick={() => setStep(1)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-black py-3.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng cộng ({trip.service === 'express' ? 'Vận chuyển' : `${activeSeats.length} vé`})</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handlePickupContinue}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all duration-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: XÁC NHẬN THÔNG TIN */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          {/* Info Alert Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 text-blue-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Vui lòng kiểm tra kỹ thông tin liên hệ để nhận vé qua SMS và Email.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

            {/* Passenger Info Form */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Thông tin hành khách</h4>

              <div className="flex flex-col gap-1.5 text-xs text-left">
                <label className="font-extrabold text-slate-500">Họ và tên hành khách <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => { setPassengerName(e.target.value); setErrorMessage(''); }}
                  placeholder="Nhập họ và tên hành khách"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => { setPassengerPhone(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập số điện thoại"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-left">
                  <label className="font-extrabold text-slate-500">Địa chỉ Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => { setPassengerEmail(e.target.value); setErrorMessage(''); }}
                    placeholder="Nhập địa chỉ email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Review Summary */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-xs text-slate-700">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Tóm tắt chuyến xe</h4>

              <div className="flex flex-col gap-3 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hành trình:</span>
                  <span className="font-bold text-slate-800">{trip.from} ➔ {trip.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nhà xe:</span>
                  <span className="font-bold text-slate-800">{trip.operator} ({trip.tag})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Giờ xuất phát:</span>
                  <span className="font-bold text-slate-800">{trip.departureTime} (Thời gian đi: {trip.duration})</span>
                </div>
                {trip.service === 'express' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trọng lượng hàng:</span>
                      <span className="font-bold text-slate-800">{weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thể tích hàng:</span>
                      <span className="font-bold text-slate-800">{volume} m³</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vị trí ghế:</span>
                    <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{activeSeats.map(s => s.code).join(', ')}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 my-1" />

                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Địa điểm đón:</span>
                  {selectedPickups.map((pickup, idx) => (
                    <div key={pickup.id} className="text-slate-800 font-semibold border-b border-slate-100 pb-1 last:border-0 text-xs">
                      {selectedPickups.length > 1 ? `${idx + 1}. ` : ''}<span className="font-extrabold">{pickup?.locationName}</span> (Thứ tự: {pickup?.sequence})
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Địa điểm trả:</span>
                  {selectedDropoffs.map((dropoff, idx) => (
                    <div key={dropoff.id} className="text-slate-800 font-semibold border-b border-slate-100 pb-1 last:border-0 text-xs">
                      {selectedDropoffs.length > 1 ? `${idx + 1}. ` : ''}<span className="font-extrabold">{dropoff?.locationName}</span> (Thứ tự: {dropoff?.sequence})
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 font-bold text-xs mt-2 text-center animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <button
              onClick={() => setStep(2)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-black py-3.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng tiền thanh toán</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handlePassengerContinue}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black py-3.5 px-8 rounded-xl cursor-pointer shadow-md hover:shadow-slate-900/10 transition-all duration-300"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: PHƯƠNG THỨC THANH TOÁN */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          {/* Info Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span>Vui lòng chọn 1 phương thức thanh toán phù hợp bên dưới.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

            {/* Payment Selection Methods */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2.5">Phương thức thanh toán</h4>

              <div className="flex flex-col gap-3">
                {/* Bank Transfer Option */}
                {/* <div
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50/60 transition-all ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}
                >
                  <div className="mt-1 flex items-center justify-center shrink-0">
                    {paymentMethod === 'transfer' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <h5 className="font-extrabold text-slate-900 text-sm">Chuyển khoản Ngân hàng (Internet Banking)</h5>
                    <p className="text-slate-400 font-medium mt-0.5">Quét mã QR hoặc chuyển khoản thông tin tài khoản ngân hàng Techcombank nhanh chóng.</p>
                  </div>
                </div> */}

                {/* Cash Option */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50/60 transition-all ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}
                >
                  <div className="mt-1 flex items-center justify-center shrink-0">
                    {paymentMethod === 'cash' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <h5 className="font-extrabold text-slate-900 text-sm">Thanh toán bằng Tiền mặt khi lên xe</h5>
                    <p className="text-slate-400 font-medium mt-0.5">Thanh toán trực tiếp cho phụ xe hoặc tài xế khi xe đón bạn.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Details Panel */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center text-xs">
              {paymentMethod === 'transfer' ? (
                <div className="flex flex-col items-center justify-center text-center gap-4">
                  <h4 className="text-sm font-extrabold text-slate-900">Thông tin chuyển khoản</h4>

                  {/* QR Code Graphic Placeholder */}
                  <div className="w-36 h-36 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-3 relative shadow-inner">
                    {/* Inner QR patterns */}
                    <div className="w-full h-full border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 select-none font-bold">
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span className="text-[10px] text-slate-400">QR TECHCOMBANK</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full text-left font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ngân hàng:</span>
                      <span className="font-extrabold text-slate-800">Techcombank (TCB)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Số tài khoản:</span>
                      <span className="font-extrabold text-blue-600">1903 9019 2830 18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tên tài khoản:</span>
                      <span className="font-extrabold text-slate-800 uppercase">CONG TY CP VEXERE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nội dung CK:</span>
                      <span className="font-extrabold text-slate-800 text-[13px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">{bookingCode}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 gap-4">
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Thanh toán khi lên xe</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs">Bạn sẽ thanh toán trực tiếp số tiền vé cho tài xế hoặc phụ xe khi lên xe. Nhà xe sẽ liên hệ xác nhận chuyến trước giờ đi 30 phút.</p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Summary Action Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-slate-200">
            <button
              onClick={() => setStep(3)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-black py-3.5 px-6 rounded-xl cursor-pointer transition-colors"
            >
              Quay lại
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng tiền thanh toán</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {formatPrice(calculateTotalPrice())}
                </div>
              </div>

              <button
                onClick={handlePaymentConfirm}
                disabled={isBookingProcessing}
                className={`bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3.5 px-8 rounded-xl shadow-md hover:shadow-emerald-600/10 transition-all duration-300 ${isBookingProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isBookingProcessing ? 'Đang xử lý...' : 'Đặt vé & Hoàn tất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripBooking;
