import axios from 'axios';
import { KEY_CODES } from './keycodes.ts';

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

Api.interceptors.response.use((config) => {
  config.headers['Authorization'] = localStorage.getItem(KEY_CODES.AUTH_TOKEN);
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    Promise.reject(error);
  }
);
