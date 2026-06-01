import axiosInstance from '@/services/axiosInstance';

/**
 * Get route points for a specific offer
 * @param {string} offerId - Offer ID
 * API URL format: /OfferRoutePoint/OfferId?OfferId=...
 */
export const getOfferRoutePointsApi = async (offerId) => {
  const response = await axiosInstance.get('/OfferRoutePoint/OfferId', {
    params: { OfferId: offerId }
  });
  return response.data;
};
