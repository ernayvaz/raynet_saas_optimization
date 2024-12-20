// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // '/api' prefix'i ekleyin

export const fetchUsers = () => axios.get(`${API_BASE_URL}/users/`);
export const fetchLicenses = () => axios.get(`${API_BASE_URL}/licenses/`);
export const fetchUsageStats = () => axios.get(`${API_BASE_URL}/usage_stats/`);
export const fetchOptimizations = () => axios.get(`${API_BASE_URL}/optimizations/`);
