import axiosInstance from '@/services/axiosInstance';

/**
 * Get shared ride list
 * @param {Object} params { PickupLocationId, DropoffLocationId, startTime, PageNumber, PageSize }
 */
export const getSharedRidesApi = async (params) => {
  const response = await axiosInstance.get('Offer/shared-ride', { params });
  return response.data;
};

/**
 * Get shipment list
 * @param {Object} params { PickupLocationId, DropoffLocationId, startTime, PageNumber, PageSize }
 */
export const getShipmentsApi = async (params) => {
  const response = await axiosInstance.get('Offer/shipment', { params });
  return response.data;
};

export const createBookingApi = async (data) => {
  const response = await axiosInstance.post('/booking', data);
  return response.data;
};
