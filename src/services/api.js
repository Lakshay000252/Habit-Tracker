import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('habitai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method.toUpperCase(), config.url, config.data || '');
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('habitai_token');
        localStorage.removeItem('habitai_refresh');
        localStorage.removeItem('habitai_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
      console.log('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('API Network Error - No response received');
      const networkError = new Error('Unable to connect to the server. Please ensure the backend is running.');
      networkError.originalError = error;
      return Promise.reject(networkError);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => {
    console.log('Register Request:', data);
    return api.post('/auth/register', data);
  },
  login: (data) => {
    console.log('Login Request:', { email: data.email });
    return api.post('/auth/login', data);
  },
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/change-password', data),
};

export const habitsAPI = {
  getAll: (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/habits${query}`);
  },
  getById: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
};

export const progressAPI = {
  markComplete: (habitId, date, note) => api.post('/progress/complete', { habitId, date, note }),
  markIncomplete: (habitId, date) => api.post('/progress/incomplete', { habitId, date }),
  getHistory: (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/progress/history${query}`);
  },
  getDaily: (date) => api.get(`/progress/daily${date ? '?date=' + date : ''}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getHabitAnalytics: (habitId) => api.get(`/analytics/habit/${habitId}`),
};

export const aiAPI = {
  motivate: (mood) => api.post('/ai/motivate', { mood }),
  suggestions: () => api.post('/ai/suggestions'),
};

export default api;
