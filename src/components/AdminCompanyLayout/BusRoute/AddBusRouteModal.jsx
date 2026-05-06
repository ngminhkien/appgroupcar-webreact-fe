import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createBusRouteApi } from '@/services/busRouteService';
import { getLocationsApi } from '@/services/locationService';

const AddBusRouteModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    routePoints: []
  });
  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch locations
      const fetchLocations = async () => {
        setIsLoadingLocations(true);
        try {
          const res = await getLocationsApi({ PageSize: 1000 });
          const locData = res?.data?.items || res?.data || res || [];
          setLocations(Array.isArray(locData) ? locData : []);
        } catch (error) {
          toast.error('Lỗi khi tải danh sách địa điểm');
        } finally {
          setIsLoadingLocations(false);
        }
      };
      fetchLocations();
      
      // Reset form
      setFormData({
        name: '',
        routePoints: [
          { locationId: '', pickupAllowed: true, dropoffAllowed: true },
          { locationId: '', pickupAllowed: true, dropoffAllowed: true }
        ]
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChangeName = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleAddPoint = () => {
    setFormData(prev => ({
      ...prev,
      routePoints: [
        ...prev.routePoints,
        { locationId: '', pickupAllowed: true, dropoffAllowed: true }
      ]
    }));
  };

  const handleRemovePoint = (index) => {
    setFormData(prev => ({
      ...prev,
      routePoints: prev.routePoints.filter((_, i) => i !== index)
    }));
  };

  const handleChangePoint = (index, field, value) => {
    setFormData(prev => {
      const newPoints = [...prev.routePoints];
      newPoints[index][field] = value;
      return { ...prev, routePoints: newPoints };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên tuyến xe');
      return;
    }
    if (formData.routePoints.length < 2) {
      toast.error('Vui lòng thêm ít nhất hai điểm dừng (điểm đi và điểm đến)');
      return;
    }
    
    // Validate points
    const hasEmptyLocation = formData.routePoints.some(p => !p.locationId);
    if (hasEmptyLocation) {
      toast.error('Vui lòng chọn địa điểm cho tất cả các điểm dừng');
      return;
    }

    // Format data for API
    const payload = {
      name: formData.name,
      routePoints: formData.routePoints.map((p, idx) => ({
        locationId: p.locationId,
        sequence: idx + 1,
        pickupAllowed: true,
        dropoffAllowed: true
      }))
    };

    setIsSubmitting(true);
    try {
      const res = await createBusRouteApi(payload);
      toast.success(res?.message || 'Thêm tuyến xe thành công!');
      if (onAdded) onAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm tuyến xe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">Thêm mới tuyến xe</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Tên tuyến xe <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChangeName}
              placeholder="VD: Hà Nội - Hải Phòng"
              className="admin-filter-btn w-full outline-none"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Danh sách điểm dừng <span className="text-red-500">*</span></label>
              <button
                type="button"
                onClick={handleAddPoint}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                disabled={isSubmitting}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Thêm điểm
              </button>
            </div>

            <div className="space-y-3">
              {formData.routePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="pt-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <select
                      value={point.locationId}
                      onChange={(e) => handleChangePoint(index, 'locationId', e.target.value)}
                      className="admin-filter-btn w-full outline-none bg-white min-h-[42px]"
                      disabled={isSubmitting || isLoadingLocations}
                    >
                      <option value="">Chọn địa điểm</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name || loc.locationName || loc.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePoint(index)}
                    className="mt-1.5 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || formData.routePoints.length <= 2}
                    title="Xóa điểm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              {formData.routePoints.length < 2 && (
                <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
                  Cần ít nhất 2 điểm dừng (điểm đi và điểm đến) cho một tuyến xe.
                </div>
              )}
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

export default AddBusRouteModal;
