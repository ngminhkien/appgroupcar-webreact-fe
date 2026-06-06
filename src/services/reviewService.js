import axiosInstance from './axiosInstance';

/**
 * Post a review
 */
export const postReviewApi = async (payload) => {
  const response = await axiosInstance.post('/review', payload);
  return response.data;
};

/**
 * Get reviews for a reviewee (driver or company)
 * @param {string} revieweeId
 */
export const getReviewsByRevieweeApi = async (revieweeId) => {
  const response = await axiosInstance.get(`/Review/reviewee/${revieweeId}`);
  return response.data;
};
