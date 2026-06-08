import axiosInstance from './axiosInstance';

export const createBusBookingApi = async (data) => {
  const response = await axiosInstance.post('/bus-bookings', data);
  return response.data;
};

export const getMyBusBookingsApi = async () => {
  const response = await axiosInstance.get('/bus-bookings/me');
  return response.data;
};

export const getBusBookingByIdApi = async (id) => {
  const response = await axiosInstance.get(`/bus-bookings/${id}`);
  return response.data;
};
