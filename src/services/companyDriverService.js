import axiosInstance from '@/services/axiosInstance';

export const getCompanyDriversApi = async (companyId, params) => {
  const response = await axiosInstance.get(`/company-drivers/`, { params });
  return response.data;
};

export const getCompanyDriverByIdApi = async (id, companyId) => {
  const response = await axiosInstance.get(`/company-drivers/${id}`, { params: { companyId } });
  return response.data;
};

