const BASE_URL = '/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('interviewmate_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // --- AUTH ---
  register: (body) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  login: (body) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  demoLogin: (role = 'student') =>
    fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders()
    }).then(handleResponse),

  updateProfile: (body) =>
    fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  // --- QUIZ & DASHBOARD ---
  getDashboardStats: () =>
    fetch(`${BASE_URL}/quiz/dashboard-stats`, {
      headers: getHeaders()
    }).then(handleResponse),

  getAptitudeQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/quiz/aptitude?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  getReasoningQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/quiz/reasoning?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  submitQuiz: (body) =>
    fetch(`${BASE_URL}/quiz/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  getQuizHistory: () =>
    fetch(`${BASE_URL}/quiz/history`, {
      headers: getHeaders()
    }).then(handleResponse),

  // --- TECHNICAL PREP ---
  getTechnicalQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/technical/questions?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  evaluateTechnicalAnswer: (body) =>
    fetch(`${BASE_URL}/technical/evaluate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  // --- MOCK INTERVIEW ---
  startMockInterview: (body) =>
    fetch(`${BASE_URL}/mock-interview/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  submitMockAnswer: (interviewId, body) =>
    fetch(`${BASE_URL}/mock-interview/${interviewId}/answer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  getMockHistory: () =>
    fetch(`${BASE_URL}/mock-interview/history`, {
      headers: getHeaders()
    }).then(handleResponse),

  getMockById: (id) =>
    fetch(`${BASE_URL}/mock-interview/${id}`, {
      headers: getHeaders()
    }).then(handleResponse),

  // --- HR PREP ---
  getHRQuestions: () =>
    fetch(`${BASE_URL}/hr/questions`, {
      headers: getHeaders()
    }).then(handleResponse),

  evaluateHRAnswer: (body) =>
    fetch(`${BASE_URL}/hr/evaluate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  // --- RESUME ANALYZER ---
  uploadResume: (formData) =>
    fetch(`${BASE_URL}/resume/analyze`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    }).then(handleResponse),

  getLatestResume: () =>
    fetch(`${BASE_URL}/resume/latest`, {
      headers: getHeaders()
    }).then(handleResponse),

  getResumeHistory: () =>
    fetch(`${BASE_URL}/resume/history`, {
      headers: getHeaders()
    }).then(handleResponse),

  // --- QUESTION BANK & BOOKMARKS ---
  getAllQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/questions?${query}`, {
      headers: getHeaders()
    }).then(handleResponse);
  },

  getBookmarks: () =>
    fetch(`${BASE_URL}/questions/bookmarks`, {
      headers: getHeaders()
    }).then(handleResponse),

  toggleBookmark: (id) =>
    fetch(`${BASE_URL}/questions/${id}/bookmark`, {
      method: 'POST',
      headers: getHeaders()
    }).then(handleResponse),

  // --- ADMIN ---
  getAdminStats: () =>
    fetch(`${BASE_URL}/admin/stats`, {
      headers: getHeaders()
    }).then(handleResponse),

  getAllUsers: () =>
    fetch(`${BASE_URL}/admin/users`, {
      headers: getHeaders()
    }).then(handleResponse),

  createQuestion: (body) =>
    fetch(`${BASE_URL}/admin/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  updateQuestion: (id, body) =>
    fetch(`${BASE_URL}/admin/questions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  deleteQuestion: (id) =>
    fetch(`${BASE_URL}/admin/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
};
