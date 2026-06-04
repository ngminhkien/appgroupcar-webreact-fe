import axiosInstance from './axiosInstance';

export const createRideRequestApi = async (data) => {
  const response = await axiosInstance.post('/RideRequest', data);
  return response.data;
};

export const getMyRideRequestsApi = async () => {
  const response = await axiosInstance.get('/RideRequest/me');
  return response.data;
};
