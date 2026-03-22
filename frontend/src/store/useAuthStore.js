import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', { email, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', { name, email, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Logout failed:', error);
      set({ isLoading: false });
    }
  }
}));

export default useAuthStore;
