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
  if (typeof imagePath !== 'string') return '';
  if (imagePath.startsWith('http')) return imagePath;
  const apiBaseUrl = rawBase.replace('/api', '');
  return `${apiBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const api = axios.create({
  baseURL,
});

export default api;