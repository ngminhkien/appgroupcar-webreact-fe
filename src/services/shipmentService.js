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
  const { offerId, requestId, ...rest } = body;
  const response = await axiosInstance.post('/ShipmentOffer/offer', rest, {
    params: { offerId, requestId }
  });
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

export const getShipmentRequestsApi = async (params) => {
  const response = await axiosInstance.get('/shipmentRequest', { params });
  return response.data;
};

/**
 * Get driver's active shipment trips
 */
export const getActiveShipmentsApi = async () => {
  const response = await axiosInstance.get('offer/me/shipment/active');
  return response.data;
};

/**
 * Get shipment offers (driver proposals) for a specific shipment request
 * @param {string} shipmentRequestId
 */
export const getShipmentOffersByRequestApi = async (shipmentRequestId) => {
  const response = await axiosInstance.get(`/ShipmentOffer/shipmentRequestId`, {
    params: { shipmentRequestId }
  });
  return response.data;
};

export const getShipmentByIdApi = async (id) => {
  const response = await axiosInstance.get(`/shipment/offer/${id}`);
  return response.data;
};

export const getShipmentDetailsApi = async (id) => {
  const response = await axiosInstance.get(`/shipment/${id}`);
  return response.data;
};

/**
 * Update shipment status
 */
export const updateShipmentStatusApi = async (data) => {
  const response = await axiosInstance.patch('/shipment/status', data);
  return response.data;
};

/**
 * User cancels their own shipment
 */
export const cancelShipmentByUserApi = async (shipmentId) => {
  const response = await axiosInstance.post(`/shipment/${shipmentId}/cancel`);
  return response.data;
};

