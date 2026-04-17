import axiosInstance from '@/services/axiosInstance';

/**
 * @typedef {import('@/types/companyRequestParams').CompanyListRequestParams} CompanyListRequestParams
 */

/**
 * Get paged companies for system admin page.
 * @param {CompanyListRequestParams} params
 */
export const getCompaniesApi = async (params) => {
  const response = await axiosInstance.get('/companies', { params });
  return response.data;
};

/**
 * Get company detail by id.
 * @param {string} companyId
 */
export const getCompanyDetailApi = async (companyId) => {
  const response = await axiosInstance.get(`/companies/${companyId}`);
  return response.data;
};

/**
 * Update a company by ID.
 * Sends multipart/form-data with CompanyName, Logo, Phone, Address, ProvinceCode, DistrictCode, BusinessLicenseNo.
 * @param {string} companyId
 * @param {FormData} formData
 */
export const updateCompanyApi = async (companyId, formData) => {
  const response = await axiosInstance.put(`/companies/${companyId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Delete a company by ID.
 * @param {string} companyId
 */
export const deleteCompanyApi = async (companyId) => {
  const response = await axiosInstance.delete(`/companies/${companyId}`);
  return response.data;
};
