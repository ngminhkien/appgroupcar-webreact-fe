import axiosInstance from './axiosInstance';

export const createBusBookingApi = async (data) => {
  const response = await axiosInstance.post('/bus-bookings', data);
  return response.data;
};
