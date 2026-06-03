import axiosInstance from './axiosInstance';

export const getShowtimeSeatMapApi = async (id) => {
  const response = await axiosInstance.get(`/showtimes/${id}/seat-map`);
  return response.data;
};
