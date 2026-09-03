import axios from 'axios';

// This creates a pre-configured axios instance
// Every request made with this will automatically start with 'http://localhost:5000/api'
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ... existing api.js code ...

// NEW BULK ADD FUNCTION
export const addQuestionsToList = async (listId, questionIds) => {
  const response = await api.patch(`/lists/${listId}/questions`, { questionIds });
  return response.data;
};

// Helper to automatically attach the JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRandomQuestionFromList = async (listId) => {
  const response = await api.get(`/lists/${listId}/random-question`);
  return response.data;
};

// Record a practice attempt
export const recordPracticeAttempt = async (attemptData) => {
  const response = await api.post('/practice/attempt', attemptData);
  return response.data;
};

// Fetch user progress
export const getProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

export default api;