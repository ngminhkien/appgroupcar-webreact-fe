import axiosInstance from '@/services/axiosInstance';

export const getCompanyUsersApi = async (params) => {
  const response = await axiosInstance.get('/company-users', { params });
  return response.data;
};

export const createCompanyUserApi = async (data) => {
  const response = await axiosInstance.post('/company-users', data);
  return response.data;
};
