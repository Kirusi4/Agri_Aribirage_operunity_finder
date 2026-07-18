import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const agriApi = {
  getMarkets: (limit = 10, offset = 0, state = '', commodity = '', district = '') => {
    let url = `/agri/markets?limit=${limit}&offset=${offset}`;
    if (state) url += `&state=${encodeURIComponent(state)}`;
    if (commodity) url += `&commodity=${encodeURIComponent(commodity)}`;
    if (district) url += `&district=${encodeURIComponent(district)}`;
    return api.get(url);
  },
  getStats: () => api.get('/agri/stats'),
  getOpportunities: () => api.get('/agri/opportunities'),
  getProData: () => api.get('/agri/pro-data'),
  sendTelegramAlert: (chatId, details) => api.post('/agri/telegram-alert', { chatId, details }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getAlertLogs: () => api.get('/admin/alerts'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
