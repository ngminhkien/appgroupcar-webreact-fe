import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getShipmentByIdApi, updateShipmentStatusApi } from '@/services/shipmentService';
import { ShipmentStatus } from '@/types/enums';

const ShipmentDetailModal = ({ shipmentId, onClose }) => {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  // Fetch shipment details using react-query
  const { data: responseData, isLoading, error, refetch } = useQuery({
    queryKey: ['shipmentDetail', shipmentId],
    queryFn: () => getShipmentByIdApi(shipmentId),
    enabled: !!shipmentId,
  });

  const detail = responseData?.data || responseData;
  const shipment = detail?.shipment || {};
  const shipmentOffer = detail?.shipmentOffer || {};
  const shipmentRequest = detail?.shipmentRequest || {};

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: updateShipmentStatusApi,
    onSuccess: () => {
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      queryClient.invalidateQueries(['pendingShipmentProposals']);
      queryClient.invalidateQueries(['shipmentDetail', shipmentId]);
      refetch();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    },
    onSettled: () => {
      setUpdating(false);
    }
  });

  const handleUpdateStatus = (newStatus) => {
    setUpdating(true);
    updateStatusMutation.mutate({
      shipmentId: shipment.id,
      shipmentStatus: newStatus,
    });
  };

  const getStatusLabelAndColor = (status) => {
    switch (status) {
      case ShipmentStatus.Created:
        return { label: 'Đang xử lý / Chờ lấy hàng', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case ShipmentStatus.InTransit:
        return { label: 'Đang vận chuyển', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case ShipmentStatus.Delivered:
        return { label: 'Đã giao hàng (Hoàn thành)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case ShipmentStatus.Cancelled:
        return { label: 'Đã hủy', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case ShipmentStatus.Return:
        return { label: 'Trả hàng (Hoàn hàng)', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Không xác định', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}đ` : '0đ';
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  const statusInfo = getStatusLabelAndColor(shipment.shipmentStatus);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-emerald-600 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black tracking-tight">Chi tiết đơn hàng vận chuyển</h3>
            <p className="text-xs text-emerald-100 font-semibold mt-0.5">Mã vận đơn #{shipment.id?.substring(0, 8).toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[60vh] flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-emerald-600 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-500 font-black text-xs uppercase tracking-wider">Đang tải thông tin đơn hàng...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
              <p className="text-red-950 font-black text-sm mb-1">Không thể tải thông tin đơn hàng</p>
              <p className="text-red-800 text-xs font-bold">{error?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              
              {/* Status Header Block */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Trạng thái hiện tại</span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Cước phí</span>
                  <span className="text-lg font-black text-emerald-600 block mt-0.5">{formatPrice(shipmentOffer.proposedPrice)}</span>
                </div>
              </div>

              {/* Cargo Information Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1.5">Thông tin hàng hóa</h4>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Khối lượng</span>
                    <strong className="text-slate-800 font-extrabold block mt-0.5">{shipmentRequest.weight} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Thể tích</span>
                    <strong className="text-slate-800 font-extrabold block mt-0.5">{shipmentRequest.volume} m³</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 font-semibold block">Mô tả</span>
                    <strong className="text-slate-800 font-extrabold block mt-0.5">{shipmentRequest.description || 'Không có mô tả'}</strong>
                  </div>
                  {shipmentRequest.handlingNote && (
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold block">Lưu ý bốc dỡ</span>
                      <strong className="text-slate-800 font-extrabold block mt-0.5">{shipmentRequest.handlingNote}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 font-semibold block">Hàng dễ vỡ</span>
                    <strong className="text-slate-800 font-extrabold block mt-0.5">
                      {shipmentRequest.isFragile ? <span className="text-rose-600 font-black">Có</span> : 'Không'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Ngày giao hàng</span>
                    <strong className="text-slate-800 font-bold block mt-0.5">{formatDate(shipmentRequest.deliveryDate)}</strong>
                  </div>
                </div>
              </div>

              {/* Booking Metadata details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1.5">Thông tin vận đơn</h4>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400 font-semibold">Thời gian tạo đơn</span>
                  <span className="text-slate-700 font-bold">{formatDate(shipment.createdAt)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400 font-semibold">Phương thức thanh toán</span>
                  <span className="text-slate-700 font-bold">{shipment.paymentStatus === 1 ? 'Chưa thanh toán' : 'Đã thanh toán'}</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between gap-3">
          <button 
            onClick={onClose}
            disabled={updating}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-2.5 px-5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Đóng
          </button>

          {/* Conditional Action Buttons based on shipmentStatus */}
          {detail && !isLoading && !error && (
            <div className="flex gap-2">
              {shipment.shipmentStatus === ShipmentStatus.Created && (
                <button
                  onClick={() => handleUpdateStatus(ShipmentStatus.InTransit)}
                  disabled={updating}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/10"
                >
                  {updating ? 'Đang cập nhật...' : 'Đã lấy hàng'}
                </button>
              )}

              {shipment.shipmentStatus === ShipmentStatus.InTransit && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(ShipmentStatus.Return)}
                    disabled={updating}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/10"
                  >
                    {updating ? 'Đang cập nhật...' : 'Hoàn hàng'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(ShipmentStatus.Delivered)}
                    disabled={updating}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/10"
                  >
                    {updating ? 'Đang cập nhật...' : 'Hoàn thành'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShipmentDetailModal;
