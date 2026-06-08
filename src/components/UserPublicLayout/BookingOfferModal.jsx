import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getActiveSharedRideOffersApi, postBookingOfferApi } from '@/services/offerService';
import { AddTripModal } from '@/components/DriverComponents';

const BookingOfferModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOffers();
    }
  }, [isOpen]);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await getActiveSharedRideOffersApi();
      const data = res?.data || [];
      setOffers(data);
      if (data.length > 0) {
        setSelectedOfferId(data[0].id);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể tải danh sách chuyến xe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOfferId) return;
    setIsSubmitting(true);
    try {
      await postBookingOfferApi(request.id, selectedOfferId);
      toast.success('Nhận yêu cầu thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể nhận yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-lg text-slate-800">Chọn chuyến xe để nhận yêu cầu</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <svg className="animate-spin h-6 w-6 text-emerald-500" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : offers.length > 0 ? (
              <div className="space-y-3">
                {offers.map(offer => (
                  <div 
                    key={offer.id} 
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedOfferId === offer.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-slate-800">{offer.vehicleName} - {offer.plateNumber}</div>
                      <div className="text-emerald-600 font-black text-sm">{offer.basePrice.toLocaleString()}đ</div>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-600">Khởi hành:</span> {new Date(offer.departureTime).toLocaleString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-600">Lộ trình:</span> {offer.startPoint?.locationName} ➔ {offer.endPoint?.locationName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <p className="text-slate-500 mb-6 font-medium text-sm">Bạn chưa có chuyến xe ghép nào đang hoạt động. Vui lòng tạo chuyến xe mới để nhận yêu cầu này.</p>
                <button 
                  onClick={() => setShowAddTripModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Tạo chuyến xe
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {offers.length > 0 && !isLoading && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer">Hủy</button>
              <button 
                onClick={handleSubmit} 
                disabled={!selectedOfferId || isSubmitting}
                className="px-4 py-2 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Nhận yêu cầu
              </button>
            </div>
          )}
        </div>
      </div>

      <AddTripModal 
        isOpen={showAddTripModal} 
        onClose={() => setShowAddTripModal(false)}
        onSuccess={() => {
          setShowAddTripModal(false);
          fetchOffers();
        }}
        forceVehicleType="carpool"
      />
    </>
  );
};

export default BookingOfferModal;
