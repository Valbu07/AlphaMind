// src/services/axiosConfig.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log(API_URL)
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('token');
    if (stored) {
      const clean = stored.startsWith('Bearer ') ? stored.slice(7) : stored;
      config.headers.Authorization = `Bearer ${clean}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.error('Token inválido o expirado');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/'; // Redirigir al login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;