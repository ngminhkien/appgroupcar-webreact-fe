import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getUserProfileApi } from '@/services/userService';
import { createMarketDriverApi } from '@/services/driverService';

const RegisterDriverPage = () => {
  const navigate = useNavigate();
  const [identityNumber, setIdentityNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseClass, setLicenseClass] = useState('B2');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profileInfo, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await getUserProfileApi();
      return response?.data || response;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ chọn tệp hình ảnh.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identityNumber.trim()) {
      toast.error('Vui lòng nhập số CCCD.');
      return;
    }
    if (!licenseNumber.trim()) {
      toast.error('Vui lòng nhập số GPLX.');
      return;
    }
    if (!licenseClass) {
      toast.error('Vui lòng chọn hạng bằng lái.');
      return;
    }
    if (!imageFile) {
      toast.error('Vui lòng tải ảnh bằng lái lên.');
      return;
    }

    const name = profileInfo?.fullName || '';
    if (!name) {
      toast.error('Không thể xác thực thông tin tài khoản người dùng.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('IdentityNumber', identityNumber.trim());
      formData.append('LicenseNumber', licenseNumber.trim());
      formData.append('LicenseClass', licenseClass);
      formData.append('LicenseDocumentImg', imageFile);

      await createMarketDriverApi(formData);
      toast.success('Đăng ký tài xế thành công! Vui lòng chờ phê duyệt.');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 bg-slate-50 min-h-[80vh] flex items-center justify-center">
         <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-slate-500 font-medium">Đang kiểm tra tài khoản...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-slate-550 min-h-[80vh] font-['Inter'] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Đăng ký làm đối tác tài xế</h2>
          <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
            Vui lòng điền đầy đủ và chính xác thông tin bên dưới để gửi yêu cầu xét duyệt.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên tài xế (Truyền ngầm - hiển thị ReadOnly) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Họ và tên</label>
            <div className="w-full bg-slate-100/70 border border-slate-350 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm">
              {profileInfo?.fullName || 'N/A'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IdentityNumber (CCCD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Số CCCD / ID Card</label>
              <input
                type="text"
                placeholder="Nhập số CCCD"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                maxLength={20}
                className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* LicenseNumber */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Số GPLX / Driving License</label>
              <input
                type="text"
                placeholder="Nhập số bằng lái"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                maxLength={20}
                className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* LicenseClass */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hạng bằng lái</label>
            <select
              value={licenseClass}
              onChange={(e) => setLicenseClass(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 font-semibold text-sm focus:outline-none transition-colors cursor-pointer"
            >
              <option value="A1">Hạng A1 (Mô tô hai bánh dung tích xi lanh từ 50cm3 đến dưới 175cm3)</option>
              <option value="A2">Hạng A2 (Mô tô hai bánh không giới hạn dung tích xi lanh)</option>
              <option value="B1">Hạng B1 (Ô tô chở người đến 9 chỗ, tải dưới 3.500kg không hành nghề lái xe)</option>
              <option value="B2">Hạng B2 (Ô tô chở người đến 9 chỗ, tải dưới 3.500kg có hành nghề lái xe)</option>
              <option value="C">Hạng C (Ô tô tải, máy kéo rơ moóc trọng tải trên 3.500kg)</option>
              <option value="D">Hạng D (Ô tô chở người từ 10 đến 30 chỗ ngồi)</option>
              <option value="E">Hạng E (Ô tô chở người trên 30 chỗ ngồi)</option>
              <option value="FC">Hạng FC (Các xe hạng C kéo rơ moóc, đầu kéo kéo sơ mi rơ moóc)</option>
            </select>
          </div>

          {/* LicenseDocumentImg */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ảnh bằng lái xe / License Image</label>
            
            <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-450 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer bg-slate-100/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {imagePreview ? (
                <div className="space-y-3 w-full">
                  <img
                    src={imagePreview}
                    alt="License Document Preview"
                    className="max-h-40 mx-auto rounded-xl object-contain shadow-sm"
                  />
                  <p className="text-xs text-slate-600 font-medium">Nhấp hoặc kéo thả để thay đổi hình ảnh khác</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-500 flex items-center justify-center mx-auto transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    <span className="text-emerald-600">Tải ảnh lên</span> hoặc kéo và thả vào đây
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Chấp nhận định dạng PNG, JPG hoặc JPEG</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 rounded-xl font-bold transition-all text-sm cursor-pointer shadow-sm active:scale-95"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-400 rounded-xl font-bold transition-all text-sm cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                'Gửi đăng ký'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDriverPage;
