import axiosInstance from '@/services/axiosInstance';

/**
 * Get paged vehicles.
 * @param {Object} params - The query parameters.
 */
export const getVehiclesApi = async (params) => {
  const response = await axiosInstance.get('/vehicle', { params });
  return response.data;
};

export const getMyVehiclesApi = async () => {
  const response = await axiosInstance.get('/vehicle/my-vehicles');
  return response.data;
};

export const createVehicleApi = async (formData) => {
  const response = await axiosInstance.post('/vehicle/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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

/**
 * Lock a vehicle by ID.
 * @param {string} id
 */
export const lockVehicleApi = async (id) => {
  const response = await axiosInstance.put(`/vehicle/${id}/lock`);
  return response.data;
};

/**
 * Unlock a vehicle by ID.
 * @param {string} id
 */
export const unlockVehicleApi = async (id) => {
  const response = await axiosInstance.put(`/vehicle/${id}/unlock`);
  return response.data;
};
