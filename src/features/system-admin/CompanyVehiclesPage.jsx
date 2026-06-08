import React, { useState, useEffect, useMemo } from 'react';
import '@/components/AdminSysLayout/AdminShared.css';
import { useQuery } from '@tanstack/react-query';
import { getCompaniesApi } from '@/services/companyService';
import { getCompanyVehiclesByCompanyIdApi, updateCompanyVehicleStatusApi } from '@/services/companyVehicleService';
import { CompanyStatus } from '@/types/enums';
import toast from 'react-hot-toast';

const DEFAULT_PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value || value.startsWith('0001-01-01')) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getVehicleTypeLabel = (type) => {
  switch (type) {
    case 1: return 'Xe du lịch / Ô tô';
    case 2: return 'Xe tải';
    default: return 'Khác';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 1: return 'Chờ duyệt';
    case 2: return 'Hoạt động';
    case 3: return 'Tạm dừng';
    case 4: return 'Bảo trì';
    case 5: return 'Từ chối';
    default: return 'Không xác định';
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 1:
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 2:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 3:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    case 4:
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 5:
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100';
  }
};

const CompanyVehiclesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Fetch approved companies for dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const response = await getCompaniesApi({
          CompanyStatus: CompanyStatus.Approved, // get only approved companies
          PageNumber: 1,
          PageSize: 100, // load first 100 companies
        });
        if (response?.data?.items) {
          setCompanies(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Không tải được danh sách công ty.');
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  // Reset page when company changes
  const handleCompanyChange = (e) => {
    setSelectedCompanyId(e.target.value);
    setPageNumber(1);
  };

  // Fetch vehicles using React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['company-vehicles', selectedCompanyId, pageNumber],
    queryFn: async () => {
      if (!selectedCompanyId) return {};
      const response = await getCompanyVehiclesByCompanyIdApi(selectedCompanyId, {
        companyId: selectedCompanyId,
        PageNumber: pageNumber,
        PageSize: DEFAULT_PAGE_SIZE,
      });
      return response?.data ?? {};
    },
    enabled: !!selectedCompanyId,
    staleTime: 2 * 60 * 1000,
  });

  const vehicles = useMemo(() => {
    return Array.isArray(data?.items) ? data.items : [];
  }, [data]);

  const pagination = {
    totalCount: data?.totalCount ?? 0,
    pageNumber: data?.pageNumber ?? pageNumber,
    pageSize: data?.pageSize ?? DEFAULT_PAGE_SIZE,
    totalPages: data?.totalPages ?? 1,
  };

  // Handle status toggle
  const handleStatusToggle = async (vehicleId, currentStatus) => {
    const newStatus = currentStatus === 2 ? 3 : 2;
    const actionText = newStatus === 3 ? 'tạm ngưng hoạt động' : 'kích hoạt hoạt động';
    
    setUpdatingStatusId(vehicleId);
    try {
      const res = await updateCompanyVehicleStatusApi(vehicleId, selectedCompanyId, newStatus);
      toast.success(res?.message || `Cập nhật trạng thái thành ${actionText} thành công!`);
      refetch();
    } catch (err) {
      console.error('Error updating vehicle status:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="companies-page p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">Danh sách Phương tiện Công ty</h1>
            <p className="admin-page-desc">Xem và quản lý danh sách phương tiện trực thuộc từng công ty.</p>
          </div>
        </div>
      </div>

      {/* Toolbar - Select Company */}
      <div className="admin-table-toolbar bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col gap-1.5 flex-1 max-w-md">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Chọn công ty vận tải
          </label>
          <select
            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            value={selectedCompanyId}
            onChange={handleCompanyChange}
            disabled={loadingCompanies}
          >
            <option value="">-- Chọn công ty --</option>
            {companies.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.companyName} ({comp.companyCode || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        {selectedCompanyId && (
          <div className="flex items-center gap-2 mt-auto text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Tổng số phương tiện:</span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
              {pagination.totalCount}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      {!selectedCompanyId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Chưa chọn công ty</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Vui lòng chọn một công ty vận tải từ danh sách phía trên để tra cứu danh sách phương tiện tương ứng.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
          {(isLoading || updatingStatusId) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {isError && (
            <div className="p-8 text-center text-rose-600">
              <p className="font-semibold">Đã xảy ra lỗi khi tải danh sách phương tiện.</p>
              <p className="text-xs text-slate-400 mt-1">{error.message || 'Lỗi kết nối API'}</p>
            </div>
          )}

          {!isLoading && !isError && vehicles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2H6a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2" />
              </svg>
              <p className="font-semibold text-slate-700">Không tìm thấy phương tiện nào</p>
              <p className="text-sm text-slate-400 mt-1">Công ty này hiện chưa đăng ký phương tiện nào trên hệ thống.</p>
            </div>
          ) : (
            <>
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Biển số xe</th>
                    <th>Loại phương tiện</th>
                    <th>Số ghế ngồi</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Cập nhật trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.companyVehicleId}>
                      <td>
                        {vehicle.urlImage ? (
                          <img
                            src={vehicle.urlImage}
                            alt={vehicle.plateNumber}
                            className="w-16 h-10 object-cover rounded border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-slate-100 flex items-center justify-center rounded text-xs text-slate-400 font-semibold">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="font-semibold text-slate-800">
                        {vehicle.plateNumber || '--'}
                      </td>
                      <td className="text-sm text-slate-600">
                        {getVehicleTypeLabel(vehicle.vehicleType)}
                      </td>
                      <td>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-xs">
                          {vehicle.seatCapacity} ghế
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(vehicle.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-currentColor"></span>
                          {getStatusLabel(vehicle.status)}
                        </span>
                      </td>
                      <td className="text-sm text-slate-500">
                        {formatDate(vehicle.createdAt)}
                      </td>
                      <td>
                        {vehicle.status === 2 ? (
                          <button
                            onClick={() => handleStatusToggle(vehicle.companyVehicleId, vehicle.status)}
                            disabled={updatingStatusId === vehicle.companyVehicleId}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                          >
                            Tạm ngưng
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusToggle(vehicle.companyVehicleId, vehicle.status)}
                            disabled={updatingStatusId === vehicle.companyVehicleId}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                          >
                            Kích hoạt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="admin-pagination border-t border-slate-100 bg-slate-50/50">
                  <div className="pagination-info text-slate-500">
                    Trang <span className="font-semibold">{pagination.pageNumber}</span> trên <span className="font-semibold">{pagination.totalPages}</span>
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn pagination-btn--nav"
                      onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                      disabled={pagination.pageNumber === 1}
                    >
                      Trước
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${pagination.pageNumber === page ? 'pagination-btn--active bg-blue-600 text-white' : 'text-slate-600'}`}
                        onClick={() => setPageNumber(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="pagination-btn pagination-btn--nav"
                      onClick={() => setPageNumber((prev) => Math.min(prev + 1, pagination.totalPages))}
                      disabled={pagination.pageNumber === pagination.totalPages}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyVehiclesPage;
