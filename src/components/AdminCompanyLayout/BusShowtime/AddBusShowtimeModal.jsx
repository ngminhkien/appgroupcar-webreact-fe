import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createBusShowtimeApi } from '@/services/busShowtimeService';
import { getCompanyVehiclesApi } from '@/services/companyVehicleService';
import { getBusRoutesApi } from '@/services/busRouteService';

const AddBusShowtimeModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    companyVehicleId: '',
    routeId: '',
    departureDate: '',
    departureTime: '',
    price: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          const [vehRes, routeRes] = await Promise.all([
            getCompanyVehiclesApi({ PageSize: 1000 }),
            getBusRoutesApi({ PageSize: 1000 })
          ]);
          
          const vehData = vehRes?.data?.items || vehRes?.items || vehRes?.data || vehRes || [];
          const routeData = routeRes?.data?.items || routeRes?.items || routeRes?.data || routeRes || [];
          
          setVehicles(Array.isArray(vehData) ? vehData : []);
          setRoutes(Array.isArray(routeData) ? routeData : []);
        } catch (error) {
          toast.error('Lỗi khi tải dữ liệu xe và tuyến');
        } finally {
          setIsLoadingData(false);
        }
      };
      
      fetchData();
      
      // Reset form
      setFormData({
        companyVehicleId: '',
        routeId: '',
        departureDate: '',
        departureTime: '',
        price: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyVehicleId || !formData.routeId || !formData.departureDate || !formData.departureTime || !formData.price) {
      toast.error('Vui lòng điền đầy đủ thông tin (chọn xe, tuyến, ngày, giờ, giá vé)');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price)
    };

    setIsSubmitting(true);
    try {
      const res = await createBusShowtimeApi(payload);
      toast.success(res?.message || 'Thêm lịch trình thành công!');
      if (onAdded) onAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm lịch trình.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">Thêm mới lịch trình</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
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
                disabled={isSubmitting || isLoadingData}
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

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Xe chạy <span className="text-red-500">*</span></label>
              <select
                name="companyVehicleId"
                value={formData.companyVehicleId}
                onChange={handleChange}
                className="admin-filter-btn w-full outline-none bg-white min-h-[42px]"
                disabled={isSubmitting || isLoadingData}
              >
                <option value="">Chọn xe</option>
                {vehicles.map(v => {
                  const val = v.id || v.companyVehicleId;
                  return (
                    <option key={val} value={val}>
                      {v.licensePlate || v.plateNumber || val}
                    </option>
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
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusShowtimeModal;
