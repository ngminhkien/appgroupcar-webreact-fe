import axiosInstance from '@/services/axiosInstance';

export const getCompanyDriversApi = async (companyId, params) => {
  const response = await axiosInstance.get(`/company-drivers/`, { params });
  return response.data;
};

export const getCompanyDriverByIdApi = async (id, companyId) => {
  const response = await axiosInstance.get(`/company-drivers/${id}`, { params: { companyId } });
  return response.data;
};

export const getCompanyDriversByCompanyIdApi = async (companyId, params) => {
  const response = await axiosInstance.get(`/company-drivers/company/${companyId}`, { params });
  return response.data;
};

export const updateCompanyDriverStatusApi = async (id, companyId, status) => {
  const formData = new FormData();
  formData.append('DriverVerificationStatus', status);

  const response = await axiosInstance.put(`/company-drivers/${id}/status`, formData, {
    params: { companyId },
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


