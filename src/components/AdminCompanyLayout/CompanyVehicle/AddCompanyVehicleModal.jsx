import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createCompanyVehicleApi, getSeatLayoutsApi } from '@/services/companyVehicleService';
import { VehicleStatus, VehicleType } from '@/types/enums';

const AddCompanyVehicleModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    SeatLayoutId: '',
    PlateNumber: '',
    SeatCapacity: '',
    VehicleType: '',
    Status: '',
    UrlImage: null,
    RegistrationDocumentImage: null,
  });
  const [seatLayouts, setSeatLayouts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [regDocPreview, setRegDocPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch seat layouts
      getSeatLayoutsApi()
        .then(res => {
          // Assume response.data or response is the array
          const layouts = Array.isArray(res?.data?.items) ? res.data.items : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          setSeatLayouts(layouts);
        })
        .catch(err => console.error('Failed to fetch seat layouts', err));
    } else {
      // Reset form
      setFormData({
        SeatLayoutId: '',
        PlateNumber: '',
        SeatCapacity: '',
        VehicleType: '',
        Status: '',
        UrlImage: null,
        RegistrationDocumentImage: null,
      });
      setImagePreview(null);
      setRegDocPreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      const previewUrl = URL.createObjectURL(file);
      if (name === 'UrlImage') {
        setImagePreview(previewUrl);
      } else if (name === 'RegistrationDocumentImage') {
        setRegDocPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.PlateNumber || !formData.SeatCapacity || !formData.VehicleType || !formData.Status) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      if (formData.SeatLayoutId) data.append('SeatLayoutId', formData.SeatLayoutId);
      data.append('PlateNumber', formData.PlateNumber);
      data.append('SeatCapacity', formData.SeatCapacity);
      data.append('VehicleType', formData.VehicleType);
      data.append('Status', formData.Status);
      if (formData.UrlImage) data.append('UrlImage', formData.UrlImage);
      if (formData.RegistrationDocumentImage) data.append('RegistrationDocumentImage', formData.RegistrationDocumentImage);

      const res = await createCompanyVehicleApi(data);
      toast.success(res?.message || 'Thêm phương tiện thành công!');
      if (onAdded) onAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm phương tiện.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">Thêm mới phương tiện</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="addVehicleForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Thông tin cơ bản */}
            <div>
              <h3 className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Biển số <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="PlateNumber"
                    value={formData.PlateNumber}
                    onChange={handleChange}
                    placeholder="Ví dụ: 29A-12345"
                    className="admin-filter-btn w-full uppercase outline-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Sức chứa/Số chỗ <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="SeatCapacity"
                    value={formData.SeatCapacity}
                    onChange={handleChange}
                    placeholder="Ví dụ: 4"
                    className="admin-filter-btn w-full outline-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Phân loại & Cấu hình */}
            <div>
              <h3 className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                Phân loại & Cấu hình
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Loại phương tiện <span className="text-red-500">*</span></label>
                  <select
                    name="VehicleType"
                    value={formData.VehicleType}
                    onChange={handleChange}
                    className="admin-filter-btn w-full outline-none"
                    disabled={isSubmitting}
                  >
                    <option value="">-- Chọn loại phương tiện --</option>
                    <option value={VehicleType.Car}>Ô tô</option>
                    <option value={VehicleType.Truck}>Xe tải</option>
                    <option value={VehicleType.Motorcycle}>Xe máy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Sơ đồ ghế (Seat Layout)</label>
                  <select
                    name="SeatLayoutId"
                    value={formData.SeatLayoutId}
                    onChange={handleChange}
                    className="admin-filter-btn w-full outline-none"
                    disabled={isSubmitting}
                  >
                    <option value="">-- Chọn sơ đồ ghế --</option>
                    {seatLayouts.map(layout => (
                      <option key={layout.id || layout.seatLayoutId} value={layout.id || layout.seatLayoutId}>
                        {layout.seatLayoutName || layout.name || 'Sơ đồ chưa có tên'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Trạng thái <span className="text-red-500">*</span></label>
                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                    className="admin-filter-btn w-full outline-none"
                    disabled={isSubmitting}
                  >
                    <option value="">-- Chọn trạng thái --</option>
                    <option value={VehicleStatus.Pending}>Chờ duyệt</option>
                    <option value={VehicleStatus.Active}>Hoạt động</option>
                    <option value={VehicleStatus.Inactive}>Không hoạt động</option>
                    <option value={VehicleStatus.Maintenance}>Bảo trì</option>
                    <option value={VehicleStatus.Rejected}>Từ chối</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Hình ảnh & Giấy tờ */}
            <div>
              <h3 className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
                Hình ảnh & Giấy tờ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Ảnh phương tiện</label>
                  <input
                    type="file"
                    name="UrlImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="admin-filter-btn w-full outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#001f3f] hover:file:bg-blue-100"
                    disabled={isSubmitting}
                  />
                  {imagePreview && (
                    <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Giấy đăng ký xe</label>
                  <input
                    type="file"
                    name="RegistrationDocumentImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="admin-filter-btn w-full outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#001f3f] hover:file:bg-blue-100"
                    disabled={isSubmitting}
                  />
                  {regDocPreview && (
                    <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
                      <img src={regDocPreview} alt="Preview doc" className="h-full w-full object-contain bg-slate-50" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 shrink-0">
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
            form="addVehicleForm"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#001f3f] hover:bg-blue-900 transition-colors flex items-center gap-2"
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
      </div>
    </div>
  );
};

export default AddCompanyVehicleModal;
