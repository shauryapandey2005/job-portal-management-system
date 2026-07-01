import axios from 'axios';

// This is your bridge to the backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Matches your backend port
});

// Interceptor to automatically attach the token if a user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
