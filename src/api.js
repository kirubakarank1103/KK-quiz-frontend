import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kk-quiz-backend.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quizToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('quizToken');
      localStorage.removeItem('quizUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ───────────────────────────────────
export const signup = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);

// ─── QUIZZES ─────────────────────────────────
export const getQuizzes = (params) => api.get('/api/quizzes', { params });
export const getQuizById = (id) => api.get(`/api/quizzes/${id}`);
export const createQuiz = (data) => api.post('/api/quizzes', data);
export const updateQuiz = (id, data) => api.put(`/api/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/api/quizzes/${id}`);
export const submitQuiz = (id, answers) => api.post(`/api/quizzes/${id}/submit`, { answers });

export default api;