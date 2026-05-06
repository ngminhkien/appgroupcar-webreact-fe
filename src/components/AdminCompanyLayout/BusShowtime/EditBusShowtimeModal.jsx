import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateBusShowtimeApi, getBusShowtimeByIdApi } from '@/services/busShowtimeService';
import { getBusRoutesApi } from '@/services/busRouteService';

const EditBusShowtimeModal = ({ isOpen, onClose, onUpdated, showtime }) => {
  const [formData, setFormData] = useState({
    routeId: '',
    departureDate: '',
    departureTime: '',
    price: ''
  });
  
  const [routes, setRoutes] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && showtime?.id) {
      let cancelled = false;
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          // Fetch both details and routes in parallel
          const [detailRes, routeRes] = await Promise.all([
            getBusShowtimeByIdApi(showtime.id),
            getBusRoutesApi({ PageSize: 1000 })
          ]);
          
          if (cancelled) return;
          
          const detailData = detailRes?.data?.items ? detailRes.data.items[0] : (detailRes?.data ?? detailRes);
          const routeData = routeRes?.data?.items || routeRes?.items || routeRes?.data || routeRes || [];
          
          setRoutes(Array.isArray(routeData) ? routeData : []);
          
          if (detailData) {
            setFormData({
              routeId: detailData.routeId || '',
              departureDate: detailData.departureDate ? detailData.departureDate.split('T')[0] : '',
              departureTime: detailData.departureTime ? detailData.departureTime.substring(0, 5) : '',
              price: detailData.price ?? ''
            });
          }
        } catch (error) {
          if (!cancelled) {
            toast.error('Lỗi khi tải dữ liệu chi tiết');
            onClose();
          }
        } finally {
          if (!cancelled) {
            setIsLoadingData(false);
          }
        }
      };
      
      fetchData();
      return () => { cancelled = true; };
    }
  }, [isOpen, showtime?.id, onClose]);

  if (!isOpen || !showtime) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.routeId || !formData.departureDate || !formData.departureTime || formData.price === '') {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const payload = {
      routeId: formData.routeId,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime.length === 5 ? formData.departureTime + ':00' : formData.departureTime,
      price: parseFloat(formData.price)
    };

    setIsSubmitting(true);
    try {
      const res = await updateBusShowtimeApi(showtime.id, payload);
      toast.success(res?.message || 'Cập nhật lịch trình thành công!');
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật lịch trình.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">Cập nhật lịch trình</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {isLoadingData ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-slate-500 text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Chọn Tuyến xe */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Tuyến xe <span className="text-red-500">*</span></label>
                <select
                  name="routeId"
                  value={formData.routeId}
                  onChange={handleChange}
                  className="admin-filter-btn w-full outline-none bg-white min-h-[42px]"
                  disabled={isSubmitting}
                >
                  <option value="">Chọn tuyến xe</option>
                  {routes.map(r => {
                    const val = r.id || r.routeId;
                    return (
                      <option key={val} value={val}>{r.name}</option>
                    );
                  })}
                </select>
              </div>

              {/* Ngày khởi hành */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Ngày khởi hành <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="admin-filter-btn w-full outline-none bg-white min-h-[42px]"
                  disabled={isSubmitting}
                />
              </div>

              {/* Giờ khởi hành */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Giờ khởi hành <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="admin-filter-btn w-full outline-none bg-white min-h-[42px]"
                  disabled={isSubmitting}
                />
              </div>

              {/* Giá vé */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Giá vé (VNĐ) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ví dụ: 150000"
                  min="0"
                  step="0.01"
                  className="admin-filter-btn w-full outline-none bg-white min-h-[42px]"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditBusShowtimeModal;
