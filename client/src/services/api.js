// api.js - API service for making requests to the backend

import axios from 'axios';

// Create axios instance with base URL
// Create axios instance with base URL.
// Prefer VITE_API_URL when provided. If not present (e.g. you didn't set it on Render),
// fall back to the current page origin (window.location.origin) so the client will
// call the same host that served the frontend. As a final fallback use localhost.
const rawBase = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
const baseURL = rawBase.endsWith('/api')
  ? rawBase
  : rawBase.replace(/\/$/, '') + '/api';

// Helper function to get full URL for uploaded files
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const apiBaseUrl = rawBase.replace('/api', '');
  return `${apiBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api; 