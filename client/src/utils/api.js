import axios from 'axios';

// In production: use Render server URL
// In development: use local proxy
const BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds — Render free tier can be slow to wake up
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ten9_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. The server may be waking up — please try again in 30 seconds.';
    }
    if (!error.response) {
      error.message = 'Cannot connect to server. Please try again in a moment.';
    }
    return Promise.reject(error);
  }
);

export default API;