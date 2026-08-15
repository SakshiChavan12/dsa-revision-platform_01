import api from './api';

// 1. Register a new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 2. Login a user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// 3. Get current logged-in user
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 4. Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};