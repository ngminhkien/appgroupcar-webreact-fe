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

export const getMyBookingsApi = async () => {
  const response = await axiosInstance.get('/booking/me');
  return response.data;
};

/**
 * Get driver's own offers
 */
export const getMyOffersApi = async () => {
  const response = await axiosInstance.get('/offer/me');
  return response.data;
};

/**
 * Get pending bookings for a specific offer
 */
export const getPendingBookingsApi = async (offerId) => {
  const response = await axiosInstance.get(`/booking/offer/${offerId}`);
  return response.data;
};

/**
 * Confirm a booking request
 */
export const confirmBookingApi = async (bookingId) => {
  const response = await axiosInstance.post(`/booking/${bookingId}/accept`);
  return response.data;
};

/**
 * Cancel/reject a booking request
 */
export const cancelBookingApi = async (bookingId) => {
  const response = await axiosInstance.post(`/booking/${bookingId}/reject`);
  return response.data;
};

/**
 * User cancels their own booking
 */
export const cancelBookingByUserApi = async (bookingId) => {
  const response = await axiosInstance.post(`/booking/${bookingId}/cancel`);
  return response.data;
};

/**
 * Create a shared ride offer (Carpool)
 */
export const createSharedRideOfferApi = async (data) => {
  const response = await axiosInstance.post('/offer/shared-ride', data);
  return response.data;
};

/**
 * Create a shipment offer (Truck)
 */
export const createShipmentOfferApi = async (data) => {
  const response = await axiosInstance.post('/offer/shipment', data);
  return response.data;
};

/**
 * Get details of a shared ride offer
 */
export const getSharedRideDetailApi = async (id) => {
  const response = await axiosInstance.get(`/offer/shared-ride/${id}/detail`);
  return response.data;
};

/**
 * Get details of a shipment offer
 */
export const getShipmentDetailApi = async (id) => {
  const response = await axiosInstance.get(`/offer/shipment/${id}/detail`);
  return response.data;
};

/**
 * Cancel a shared ride offer
 */
export const cancelOfferApi = async (offerId) => {
  const response = await axiosInstance.post(`/offer/shared-ride/${offerId}/cancel`);
  return response.data;
};

/**
 * Complete a shared ride offer
 */
export const completeOfferApi = async (offerId) => {
  const response = await axiosInstance.post(`/offer/shared-ride/${offerId}/complete`);
  return response.data;
};

/**
 * Get pending shipments for a specific offer
 */
export const getPendingShipmentsApi = async (offerId) => {
  const response = await axiosInstance.get(`/ShipmentOffer/offer/${offerId}`);
  return response.data;
};

/**
 * Driver accepts a pending shipment offer
 */
export const driverAcceptShipmentApi = async (shipmentOfferId, offerId) => {
  const response = await axiosInstance.post(`/ShipmentOffer/${shipmentOfferId}/driver-accept`, null, {
    params: { offerId }
  });
  return response.data;
};

/**
 * Driver cancels/rejects a pending shipment offer
 */
export const driverCancelShipmentApi = async (shipmentOfferId) => {
  const response = await axiosInstance.post(`/ShipmentOffer/${shipmentOfferId}/driver-reject`);
  return response.data;
};

/**
 * Get active shared ride offers for current driver
 */
export const getActiveSharedRideOffersApi = async () => {
  const response = await axiosInstance.get('/offer/me/shared-ride/active');
  return response.data;
};

/**
 * Create a booking offer
 */
export const postBookingOfferApi = async (rideRequestId, offerId) => {
  const response = await axiosInstance.post('/bookingoffer', null, { 
    params: { rideRequestId, offerId } 
  });
  return response.data;
};

/**
 * Get booking offers for a specific ride request
 */
export const getBookingOffersByRideRequestApi = async (rideRequestId) => {
  const response = await axiosInstance.get(`/BookingOffer/ride-request/${rideRequestId}`);
  return response.data;
};

/**
 * Accept a booking offer
 */
export const acceptBookingOfferApi = async (id) => {
  const response = await axiosInstance.post(`/bookingoffer/${id}/accept`);
  return response.data;
};

/**
 * Reject a booking offer
 */
export const rejectBookingOfferApi = async (id) => {
  const response = await axiosInstance.post(`/bookingoffer/${id}/reject`);
  return response.data;
};

