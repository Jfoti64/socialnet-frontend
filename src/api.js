// src/api.js
import axios from 'axios';

// Set the base URL for the API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userInfo) => {
  const response = await api.post('/auth/register', userInfo);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Other APIs (posts, users, etc.) can be added here similarly
