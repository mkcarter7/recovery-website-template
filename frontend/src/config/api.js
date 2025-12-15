import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Log API URL for debugging (only in production)
if (process.env.NODE_ENV === 'production') {
  console.log('API Base URL:', API_BASE_URL);
  if (!process.env.REACT_APP_API_URL) {
    console.error('⚠️ REACT_APP_API_URL is not set! API requests will fail.');
    console.error('Please set REACT_APP_API_URL in Railway environment variables and redeploy.');
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
