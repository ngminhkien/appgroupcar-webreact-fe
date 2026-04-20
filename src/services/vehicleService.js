import axiosInstance from '@/services/axiosInstance';

/**
 * Get paged vehicles.
 * @param {Object} params - The query parameters.
 */
export const getVehiclesApi = async (params) => {
  const response = await axiosInstance.get('/vehicle', { params });
  return response.data;
};

export const getVehicleByIdApi = async (id) => {
  const response = await axiosInstance.get(`/vehicle/${id}`);
  return response.data;
};

export const approveVehicleApi = async (id) => {
  const response = await axiosInstance.patch(`/vehicle/approval/${id}`);
  return response.data;
};
