import axiosInstance from './axiosInstance';

export const getSeatLayoutByIdApi = async (id) => {
  const response = await axiosInstance.get(`/seat-layouts/${id}`);
  return response.data;
};
