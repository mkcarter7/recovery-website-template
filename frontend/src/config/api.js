import axios from 'axios';

let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Validate API URL configuration (only in production)
if (process.env.NODE_ENV === 'production') {
  if (!process.env.REACT_APP_API_URL) {
    console.error('⚠️ REACT_APP_API_URL is not set! API requests will fail.');
    console.error('Please set REACT_APP_API_URL in Railway environment variables and redeploy.');
  } else if (API_BASE_URL.startsWith('/')) {
    console.error('⚠️ REACT_APP_API_URL appears to be a relative path:', API_BASE_URL);
    console.error('It must be a full URL like: https://your-backend.up.railway.app/api');
  } else if (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
    console.error('⚠️ REACT_APP_API_URL must start with http:// or https://:', API_BASE_URL);
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
