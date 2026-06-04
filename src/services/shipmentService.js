import axiosInstance from './axiosInstance';

/**
 * Create a new shipment request
 * @param {Object} data - Cargo details: DeliveryDate, Weight, Volume, Description, IsFragile, HandlingNote, ImageUrl, proposedPrice, PickupLocationId, DropoffLocationId
 */
export const createShipmentRequestApi = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await axiosInstance.post('/ShipmentRequest', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

/**
 * Create a shipmentOffer offer
 * @param {Object} body - offerId, requestId, proposedPrice
 */
export const createShipmentOfferApi = async (body) => {
  const response = await axiosInstance.post('/ShipmentOffer/offer', body);
  return response.data;
};

export const getMyShipmentsApi = async () => {
  const response = await axiosInstance.get('/shipment/me');
  return response.data;
};

export const getMyShipmentRequestsApi = async () => {
  const response = await axiosInstance.get('/ShipmentRequest/me');
  return response.data;
};
