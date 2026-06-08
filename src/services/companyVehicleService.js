import axiosInstance from '@/services/axiosInstance';

/**
 * Get paged company vehicles.
 * @param {Object} params - The query parameters.
 */
export const getCompanyVehiclesApi = async (params) => {
  const response = await axiosInstance.get('/company-vehicles', { params });
  return response.data;
};

/**
 * Get company vehicle detail by ID.
 * @param {string} id - The company vehicle ID.
 */
export const getCompanyVehicleByIdApi = async (id) => {
  const response = await axiosInstance.get(`/company-vehicles/${id}`);
  return response.data;
};

export const getSeatLayoutsApi = async () => {
  const response = await axiosInstance.get('/seat-layouts');
  return response.data;
};

export const createCompanyVehicleApi = async (data) => {
  const response = await axiosInstance.post('/company-vehicles', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCompanyVehicleApi = async (id) => {
  const response = await axiosInstance.delete(`/company-vehicles/${id}`);
  return response.data;
};

export const getCompanyVehiclesByCompanyIdApi = async (companyId, params) => {
  const response = await axiosInstance.get(`/company-vehicles/companyId`, {
    params: { ...params, companyId }
  });
  return response.data;
};

export const updateCompanyVehicleStatusApi = async (id, companyId, status) => {
  const formData = new FormData();
  formData.append('Status', status);

  const response = await axiosInstance.put(`/company-vehicles/${id}/status`, formData, {
    params: { companyId },
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
