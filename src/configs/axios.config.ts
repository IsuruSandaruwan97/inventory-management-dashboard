import axios from 'axios';
import { KEY_CODES } from './keycodes.ts';

// Create an Axios instance
export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

Api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem(KEY_CODES.AUTH_TOKEN);
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error?.response?.data || error?.response || error);
  }
);
