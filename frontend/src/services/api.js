import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);
export const getProfile = () => apiClient.get('/users/profile');
export const updateProfile = (data) => apiClient.put('/users/profile', data);
export const fetchJobs = (params) => apiClient.get('/jobs', { params });
export const createJob = (data) => apiClient.post('/jobs', data);
export const applyJob = (data) => apiClient.post('/applications', data);
export const getMyApplications = () => apiClient.get('/applications/me');
export const getCompanyApplications = () => apiClient.get('/applications/company');
export const updateApplicationStatus = (id, data) => apiClient.put(`/applications/${id}`, data);
export const uploadResume = (formData) => apiClient.post('/uploads/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAllUsers = () => apiClient.get('/users');
export const deleteJob = (id) => apiClient.delete(`/jobs/${id}`);
export const updateJob = (id, data) => apiClient.put(`/jobs/${id}`, data);
export const getJobById = (id) => apiClient.get(`/jobs/${id}`);
