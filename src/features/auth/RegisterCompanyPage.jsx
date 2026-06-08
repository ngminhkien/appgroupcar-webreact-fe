import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCompanyApi } from '@/services/companyService';
import toast from 'react-hot-toast';

const RegisterCompanyPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    companyCode: '',
    phone: '',
    email: '',
    address: '',
    provinceCode: '',
    districtCode: '',
    businessLicenseNo: '',
    taxCode: '',
    licenseIssuedDate: '',
    licenseIssuedBy: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Vui lòng nhập tên công ty';
    }
    if (!formData.companyCode.trim()) {
      newErrors.companyCode = 'Vui lòng nhập mã viết tắt của công ty';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\+?\d{9,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ trụ sở';
    }
    if (!formData.provinceCode.trim()) {
      newErrors.provinceCode = 'Vui lòng nhập mã tỉnh thành';
    }
    if (!formData.businessLicenseNo.trim()) {
      newErrors.businessLicenseNo = 'Vui lòng nhập số đăng ký kinh doanh';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Vui lòng kiểm tra lại các thông tin bắt buộc.');
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('CompanyName', formData.companyName);
      data.append('CompanyCode', formData.companyCode);
      data.append('Phone', formData.phone);
      if (formData.email) data.append('Email', formData.email);
      data.append('Address', formData.address);
      data.append('ProvinceCode', formData.provinceCode);
      if (formData.districtCode) data.append('DistrictCode', formData.districtCode);
      data.append('BusinessLicenseNo', formData.businessLicenseNo);
      if (formData.taxCode) data.append('TaxCode', formData.taxCode);
      if (formData.licenseIssuedDate) {
        data.append('LicenseIssuedDate', new Date(formData.licenseIssuedDate).toISOString());
      }
      if (formData.licenseIssuedBy) data.append('LicenseIssuedBy', formData.licenseIssuedBy);
      data.append('CompanyType', 1); // Send companyType = 1 silently
      
      if (logoFile) {
        data.append('Logo', logoFile);
      }

      await createCompanyApi(data);
      toast.success('Gửi yêu cầu đăng ký công ty thành công! Vui lòng chờ quản trị viên phê duyệt.');
      navigate('/login');
    } catch (err) {
      console.error('Register company error:', err);
      toast.error(err.response?.data?.message || 'Đăng ký công ty thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 py-16 px-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 shadow-md shadow-blue-500/20">
            C
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Đăng ký đối tác doanh nghiệp</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Đưa doanh nghiệp của bạn lên hệ thống vận tải thông minh NexusRide
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
              1. Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tên doanh nghiệp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Công ty TNHH Vận tải ABC"
                  value={formData.companyName}
                  onChange={handleChange('companyName')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                    errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {errors.companyName && <span className="text-xs text-red-500 mt-1">{errors.companyName}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mã viết tắt công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ABC_TRANS"
                  value={formData.companyCode}
                  onChange={handleChange('companyCode')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                    errors.companyCode ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {errors.companyCode && <span className="text-xs text-red-500 mt-1">{errors.companyCode}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
              2. Thông tin liên hệ & Logo
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 mb-5">
              {/* Logo upload */}
              <div className="flex flex-col items-center gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider self-start">
                  Logo doanh nghiệp
                </label>
                <div className="relative w-28 h-28 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 overflow-hidden hover:bg-slate-100/55 transition-colors cursor-pointer">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-bold">Chọn Ảnh</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                      errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone}</span>}
                </div>

                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email doanh nghiệp
                  </label>
                  <input
                    type="email"
                    placeholder="contact@abc.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
                </div>
              </div>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2 flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Địa chỉ trụ sở <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123 Đường Nguyễn Trãi"
                  value={formData.address}
                  onChange={handleChange('address')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                    errors.address ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {errors.address && <span className="text-xs text-red-500 mt-1">{errors.address}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mã Tỉnh thành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VN-HN hoặc 01"
                  value={formData.provinceCode}
                  onChange={handleChange('provinceCode')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                    errors.provinceCode ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {errors.provinceCode && <span className="text-xs text-red-500 mt-1">{errors.provinceCode}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5">
              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mã Quận huyện
                </label>
                <input
                  type="text"
                  placeholder="001"
                  value={formData.districtCode}
                  onChange={handleChange('districtCode')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Business & Licensing */}
          <div>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
              3. Giấy phép kinh doanh
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Số đăng ký kinh doanh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="0101234567"
                  value={formData.businessLicenseNo}
                  onChange={handleChange('businessLicenseNo')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white transition-all ${
                    errors.businessLicenseNo ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {errors.businessLicenseNo && <span className="text-xs text-red-500 mt-1">{errors.businessLicenseNo}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  placeholder="0101234567"
                  value={formData.taxCode}
                  onChange={handleChange('taxCode')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Ngày cấp giấy phép
                </label>
                <input
                  type="date"
                  value={formData.licenseIssuedDate}
                  onChange={handleChange('licenseIssuedDate')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nơi cấp giấy phép
                </label>
                <input
                  type="text"
                  placeholder="Sở Kế hoạch và Đầu tư HN"
                  value={formData.licenseIssuedBy}
                  onChange={handleChange('licenseIssuedBy')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Gửi hồ sơ đăng ký'
            )}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-sm text-slate-600 mt-8 font-semibold">
          Quay lại{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-extrabold transition-colors">
            Đăng ký tài khoản cá nhân
          </Link>
          {' '}hoặc{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-extrabold transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterCompanyPage;
