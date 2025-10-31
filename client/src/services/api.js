import axios from 'axios';

// In development, the Vite proxy in `vite.config.js` will forward requests from /api to the backend.
// In production (on Netlify), the redirect rule in `netlify.toml` will do the same.
// Therefore, we can use a relative baseURL.
const baseURL = '/api';

// Helper function to get full URL for uploaded files
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (typeof imagePath !== 'string') return '';
  if (imagePath.startsWith('http')) return imagePath;
  // In production, image URLs should point directly to the backend service.
  // In development, they can be relative to the backend proxy.
  const apiBaseUrl = import.meta.env.PROD
    ? 'https://mern-stack-integration-masmunge95.onrender.com'
    : '';
  return `${apiBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const api = axios.create({
  baseURL,
});

export default api;