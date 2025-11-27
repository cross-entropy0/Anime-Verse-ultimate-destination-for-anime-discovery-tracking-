import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for all requests
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout - server is taking too long to respond');
      error.userMessage = 'Request timed out. The server is busy, please try again.';
    }
    
    // Log errors for debugging
    if (error.response?.status === 401) {
      console.log('401 Error:', error.response?.data);
    }
    
    // Don't auto-logout on 401 errors - let components handle it
    // This prevents random logouts while browsing
    if (error.response?.status === 429) {
      // Rate limit - show user-friendly message
      console.warn('Rate limit reached. Some content may be temporarily unavailable.');
      error.userMessage = 'Too many requests. Please wait a moment.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
