// src/services/postService.js
import api from './api';

const getAuthConfig = async (getToken) => {
  if (!getToken) return {};
  const token = await getToken();
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Post API services
export const postService = {
  // Get all posts with optional pagination and filters
  getAllPosts: async (getToken, page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const config = await getAuthConfig(getToken);
    const response = await api.get(url, config);
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.get(`/posts/${idOrSlug}`, config);
    return response.data;
  },

  // Create a new post
  createPost: async (postData, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.post('/posts', postData, config);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.put(`/posts/${id}`, postData, config);
    return response.data;
  },

  // Delete a post
  deletePost: async (id, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.delete(`/posts/${id}`, config);
    return response.data;
  },

  // Upload an image
  uploadImage: async (formData, getToken) => {
    const config = await getAuthConfig(getToken);
    const response = await api.post('/upload', formData, config);
    return response.data;
  },
};