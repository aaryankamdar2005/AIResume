import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle common API errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if unauthorized and handle it (e.g. redirect to login)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized, please log in.');
    }
    return Promise.reject(error);
  }
);

export const getLatexPreview = async (content) => {
  const response = await api.post('/export/preview', { content }, { responseType: 'blob' });
  return response.data;
};

export default api;
