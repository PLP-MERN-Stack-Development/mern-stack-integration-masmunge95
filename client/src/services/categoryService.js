import api from './api';

const getAuthConfig = async (getToken) => {
  if (!getToken) return {};
  const token = await getToken();
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const categoryService = {
  getAllCategories: async () => {
    // This is likely a public endpoint, so no auth is needed.
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.post('/categories', categoryData, config);
    return response.data;
  },

  updateCategory: async (id, categoryData, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.put(`/categories/${id}`, categoryData, config);
    return response.data;
  },

  deleteCategory: async (id, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.delete(`/categories/${id}`, config);
    return response.data;
  },
};