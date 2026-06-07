import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyVehiclesApi, createVehicleApi } from '@/services/vehicleService';

const DriverVehiclesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brand, setBrand] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [seatCapacity, setSeatCapacity] = useState('5');
  const [vehicleType, setVehicleType] = useState('1'); // 1 = car, 2 = truck
  const [vehicleImg, setVehicleImg] = useState(null);
  const [vehicleImgPreview, setVehicleImgPreview] = useState('');
  const [docImg, setDocImg] = useState(null);
  const [docImgPreview, setDocImgPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myVehicles'],
    queryFn: async () => {
      return await getMyVehiclesApi();
    },
    staleTime: 5 * 60 * 1000,
  });

  const vehicles = response?.data || response || [];

  React.useEffect(() => {
    if (isError) {
      toast.error(error.response?.data?.message || 'Không thể tải danh sách phương tiện.');
    }
  }, [isError, error]);

  const getFullImageUrl = (url) => {
    if (!url) return 'https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    baseUrl = baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  };

  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 1:
        return 'Xe ghép / Du lịch';
      case 2:
        return 'Xe tải / Gửi hàng';
      default:
        return 'Khác';
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ duyệt
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
            Đang hoạt động
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Ngừng hoạt động
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-750 border border-blue-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Đang bảo trì
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
            Bị từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            Chưa xác minh
          </span>
        );
    }
  };


  const handleVehicleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ chọn tệp hình ảnh.');
        return;
      }
      setVehicleImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ chọn tệp hình ảnh.');
        return;
      }
      setDocImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setBrand('');
    setPlateNumber('');
    setSeatCapacity('5');
    setVehicleType('1');
    setVehicleImg(null);
    setVehicleImgPreview('');
    setDocImg(null);
    setDocImgPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brand.trim()) {
      toast.error('Vui lòng nhập hiệu xe (Ví dụ: Vinfast).');
      return;
    }
    if (!plateNumber.trim()) {
      toast.error('Vui lòng nhập biển số xe.');
      return;
    }
    if (!seatCapacity.trim() || Number(seatCapacity) <= 0) {
      toast.error('Vui lòng nhập số chỗ ngồi hợp lệ.');
      return;
    }
    if (!vehicleImg) {
      toast.error('Vui lòng tải lên hình ảnh xe.');
      return;
    }
    if (!docImg) {
      toast.error('Vui lòng tải lên ảnh giấy đăng ký xe.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('Brand', brand.trim());
      formData.append('PlateNumber', plateNumber.trim());
      formData.append('SeatCapacity', Number(seatCapacity));
      formData.append('VehicleType', Number(vehicleType));
      formData.append('UrlImage', vehicleImg);
      formData.append('RegistrationDocumentUrl', docImg);

      await createVehicleApi(formData);
      toast.success('Đăng ký phương tiện thành công! Vui lòng chờ phê duyệt.');
      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Không thể đăng ký phương tiện. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 bg-slate-50 min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-550 font-medium">Đang tải danh sách phương tiện...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-[80vh] font-['Inter']">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quản lý phương tiện</h1>
            <p className="text-slate-550 text-sm">Danh sách các phương tiện đã đăng ký hoạt động của bạn.</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Thêm phương tiện
          </button>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <div className="bg-white border border-slate-250 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-850">Chưa có phương tiện nào</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                Bạn chưa thực hiện đăng ký phương tiện hoạt động nào trên hệ thống NexusRide. Hãy đăng ký ngay!
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all text-sm shadow-md"
            >
              Thêm phương tiện đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Vehicle Images/Cover */}
                <div className="relative h-48 bg-slate-100 shrink-0">
                  <img 
                    src={getFullImageUrl(vehicle.urlImage)} 
                    alt={vehicle.brand} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://res.cloudinary.com/dq0taj0x9/image/upload/v1780546536/vehicle-market-imgs/zkosgra26kpo0vspwdlb.webp'; }}
                  />
                  <div className="absolute top-4 right-4">
                    {renderStatusBadge(vehicle.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-slate-800">{vehicle.brand}</h3>
                      <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                        {getVehicleTypeLabel(vehicle.vehicleType)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-slate-100 text-sm">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Biển số xe</span>
                        <p className="font-bold text-slate-800">{vehicle.plateNumber}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Số chỗ ngồi</span>
                        <p className="font-bold text-slate-800">{vehicle.seatCapacity} chỗ</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Info */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <a 
                      href={getFullImageUrl(vehicle.registrationDocumentUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Xem giấy đăng ký xe
                    </a>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Đăng ký lúc: {new Date(vehicle.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-800">Thêm phương tiện mới</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hiệu xe / Brand</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Vinfast, Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    maxLength={100}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors placeholder:text-slate-400"
                  />
                </div>

                {/* PlateNumber */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Biển số xe / Plate Number</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 30A-12345"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    maxLength={20}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seat Capacity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Số chỗ ngồi / Capacity</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Nhập số chỗ ngồi"
                    value={seatCapacity}
                    onChange={(e) => setSeatCapacity(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors placeholder:text-slate-400"
                  />
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phân loại xe / Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="1">Xe ghép / Du lịch (Car)</option>
                    <option value="2">Xe tải / Gửi hàng (Truck)</option>
                  </select>
                </div>
              </div>

              {/* UrlImage */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hình ảnh xe / Vehicle Image</label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-450 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVehicleImgChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {vehicleImgPreview ? (
                    <div className="space-y-2 w-full">
                      <img
                        src={vehicleImgPreview}
                        alt="Vehicle Preview"
                        className="max-h-32 mx-auto rounded-xl object-contain shadow-sm"
                      />
                      <p className="text-xs text-slate-500 font-medium">Thay đổi hình ảnh khác</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-700">
                        <span className="text-emerald-500">Tải ảnh xe lên</span> hoặc kéo thả vào đây
                      </div>
                      <p className="text-[10px] text-slate-400">PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RegistrationDocumentUrl */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ảnh đăng ký xe / Registration Document</label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-450 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDocImgChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {docImgPreview ? (
                    <div className="space-y-2 w-full">
                      <img
                        src={docImgPreview}
                        alt="Doc Preview"
                        className="max-h-32 mx-auto rounded-xl object-contain shadow-sm"
                      />
                      <p className="text-xs text-slate-500 font-medium">Thay đổi hình ảnh khác</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-700">
                        <span className="text-emerald-500">Tải ảnh giấy đăng ký xe lên</span> hoặc kéo thả vào đây
                      </div>
                      <p className="text-[10px] text-slate-400">PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 rounded-xl font-bold transition-all text-sm cursor-pointer active:scale-95"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-400 rounded-xl font-bold transition-all text-sm cursor-pointer shadow-md active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang đăng ký...
                    </>
                  ) : (
                    'Đăng ký phương tiện'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverVehiclesPage;
