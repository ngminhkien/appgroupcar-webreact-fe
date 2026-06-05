import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getActiveShipmentsApi, createShipmentOfferApi } from '@/services/shipmentService';
import AddTripModal from './AddTripModal';

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return '0đ';
  }
  return `${Number(price).toLocaleString()}đ`;
};

const formatDateTime = (isoString) => {
  if (!isoString) return '--:-- • --/--/----';
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} • ${day}/${month}/${year}`;
  } catch (e) {
    return isoString;
  }
};

const AcceptShipmentModal = ({ isOpen, onClose, requestId, onSuccess }) => {
  const [activeShipments, setActiveShipments] = useState([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAddTripModal, setShowAddTripModal] = useState(false);

  const fetchActiveShipments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getActiveShipmentsApi();
      const data = res?.data || res || [];
      setActiveShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách chuyến xe tải đang hoạt động của bạn.');
      toast.error('Lỗi khi tải chuyến xe tải hoạt động.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active shipments on open
  useEffect(() => {
    if (isOpen) {
      fetchActiveShipments();
    }
  }, [isOpen]);

  // Set default proposed price when a shipment is selected
  useEffect(() => {
    if (!selectedShipmentId) return;
    const selected = activeShipments.find(s => s.id === selectedShipmentId);
    if (selected && selected.basePrice !== undefined) {
      setProposedPrice(selected.basePrice);
    }
  }, [selectedShipmentId, activeShipments]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShipmentId) {
      toast.error('Vui lòng chọn một chuyến xe tải.');
      return;
    }

    if (!proposedPrice || Number(proposedPrice) <= 0) {
      toast.error('Vui lòng nhập giá đề xuất hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createShipmentOfferApi({
        offerId: selectedShipmentId,
        requestId: requestId,
        proposedPrice: Number(proposedPrice)
      });

      toast.success('Gửi đề nghị nhận chuyến thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đề xuất.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedShipment = activeShipments.find(s => s.id === selectedShipmentId);

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Nhận chuyến xe tải
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Chọn một chuyến xe của bạn để gửi đề xuất cho khách hàng</p>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-left space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-8 w-8 text-emerald-500 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Đang tải chuyến xe tải hoạt động...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-800 font-extrabold text-sm mb-1">Không thể tải chuyến xe tải</p>
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            </div>
          ) : activeShipments.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-slate-600 font-black text-sm">Bạn không có chuyến xe tải nào đang hoạt động</p>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto mb-4">
                Bạn cần tạo một chuyến xe tải mới với lộ trình phù hợp trước khi nhận yêu cầu này.
              </p>
              <button
                type="button"
                onClick={() => setShowAddTripModal(true)}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md hover:shadow-emerald-600/10"
              >
                + Tạo chuyến đi mới
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                  Chọn chuyến xe tải đang chạy của bạn
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddTripModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 font-black text-[10px] uppercase transition-colors cursor-pointer"
                >
                  + Thêm chuyến mới
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                {activeShipments.map((shipment) => {
                  const isSelected = selectedShipmentId === shipment.id;
                  const startName = shipment.startPoint?.locationName || 'Điểm xuất phát';
                  const endName = shipment.endPoint?.locationName || 'Điểm kết thúc';
                  
                  return (
                    <button
                      key={shipment.id}
                      type="button"
                      onClick={() => setSelectedShipmentId(shipment.id)}
                      className={`w-full border rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/10'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-extrabold text-slate-800 bg-slate-100 py-1 px-2.5 rounded-lg">
                          {shipment.plateNumber}
                        </span>
                        <span className="text-xs font-black text-emerald-600">
                          {formatPrice(shipment.basePrice)}
                        </span>
                      </div>

                      <div className="text-xs font-extrabold text-slate-700 mt-1">
                        {shipment.vehicleName || 'Hyundai'}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mt-1">
                        <span className="text-slate-700 font-bold">{startName}</span>
                        <span>➔</span>
                        <span className="text-slate-700 font-bold">{endName}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-bold mt-1">
                        Khởi hành: {formatDateTime(shipment.departureTime)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Shipment details summary */}
          {selectedShipment && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                Thông tin chuyến xe đề xuất
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block">Phương tiện:</span>
                  <strong className="text-slate-800 font-bold block mt-0.5">
                    {selectedShipment.vehicleName} ({selectedShipment.plateNumber})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Thời gian khởi hành:</span>
                  <strong className="text-slate-800 font-bold block mt-0.5">
                    {formatDateTime(selectedShipment.departureTime)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Lộ trình chuyến:</span>
                  <strong className="text-slate-800 font-bold block mt-0.5">
                    {selectedShipment.startPoint?.locationName} ➔ {selectedShipment.endPoint?.locationName}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Giá gốc chuyến đi:</span>
                  <strong className="text-slate-800 font-bold block mt-0.5">
                    {formatPrice(selectedShipment.basePrice)}
                  </strong>
                </div>
              </div>

              {/* Price proposal input */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">
                  Giá tiền đề xuất (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    required
                    placeholder="Ví dụ: 350000"
                    className="w-full bg-white border border-slate-200 text-slate-850 font-black py-2.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                    VND
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5">
                  Tài xế có thể nhập giá đề xuất cao hoặc thấp hơn giá gốc tùy thuộc vào khối lượng hàng hóa của khách.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
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
              disabled={isSubmitting || isLoading || !selectedShipmentId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 px-6 rounded-2xl cursor-pointer shadow-md hover:shadow-emerald-600/10 transition-all flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4.5 w-4.5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Nhận chuyến'
              )}
            </button>
          </div>
        </form>

      </div>

      {/* Add Trip Modal */}
      <AddTripModal
        isOpen={showAddTripModal}
        onClose={() => setShowAddTripModal(false)}
        onSuccess={() => {
          fetchActiveShipments();
        }}
        forceVehicleType={2} // VehicleType.Truck is 2
      />

    </div>
  );
};

export default AcceptShipmentModal;
