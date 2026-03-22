import { create } from 'zustand';
import api from '../services/api';

const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  versions: [],
  isLoading: false,
  error: null,

  fetchResumes: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/resumes');
      set({ resumes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resumes', isLoading: false });
    }
  },

  fetchResumeById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/resumes/${id}`);
      set({ currentResume: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resume', isLoading: false });
    }
  },

  createResume: async (resumeData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/resumes', resumeData);
      set((state) => ({ 
        resumes: [response.data, ...state.resumes],
        currentResume: response.data,
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create resume', isLoading: false });
      return null;
    }
  },

  updateResume: async (id, updateData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/resumes/${id}`, updateData);
      
      // Update locally
      set((state) => ({
        currentResume: response.data,
        resumes: state.resumes.map(r => r._id === id ? response.data : r),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update resume', isLoading: false });
      return false;
    }
  },

  fetchVersions: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/resumes/${id}/versions`);
      set({ versions: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch versions', isLoading: false });
    }
  },

  // State actions that do not call API immediately (for live preview mapping)
  updateCurrentResumeState: (newState) => {
    set({ currentResume: newState });
  },

  editResumeViaAI: async (prompt) => {
    try {
      set({ isLoading: true, error: null });
      const { currentResume } = get();
      
      // Call backend AI endpoint
      const response = await api.post('/ai/edit', { 
        resumeState: currentResume, 
        prompt 
      });
      
      // Update local state with the newly modified resume
      set({ currentResume: response.data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to process AI request', isLoading: false });
      return false;
    }
  }
}));

export default useResumeStore;
