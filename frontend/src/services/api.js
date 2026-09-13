// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ─── AUTH INTERCEPTOR ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── LANGUAGE MAP HELPER ───
const LANG_MAP = {
  'JavaScript (Node.js)': 'javascript',
  'Python': 'python',
  'Java': 'java',
  'C++': 'cpp'
};

const normalizeLanguage = (lang) => LANG_MAP[lang] || 'javascript';

// ─── LISTS ───
export const addQuestionsToList = async (listId, questionIds) => {
  const response = await api.patch(`/lists/${listId}/questions`, { questionIds });
  return response.data;
};

export const getRandomQuestionFromList = async (listId) => {
  const response = await api.get(`/lists/${listId}/random-question`);
  return response.data;
};

// ─── PRACTICE ATTEMPTS ───
export const recordPracticeAttempt = async (attemptData) => {
  const response = await api.post('/practice/attempt', attemptData);
  return response.data;
};

// ─── PROGRESS ───
export const getProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

// ─── CODE EXECUTION ───
// RUN: Public test cases only
export const runCode = async (data) => {
  const payload = { ...data, language: normalizeLanguage(data.language) };
  const response = await api.post('/submissions/run', payload);
  return response.data;
};

// SUBMIT: All test cases + save
export const submitCode = async (data) => {
  const payload = { ...data, language: normalizeLanguage(data.language) };
  const response = await api.post('/submissions/submit', payload);
  return response.data;
};

export default api;