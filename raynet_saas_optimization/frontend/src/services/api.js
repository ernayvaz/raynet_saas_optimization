// src/services/api.js

import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'
    : `http://${window.location.hostname}:8000/api`;

export const fetchUsers = () => axios.get(`${API_BASE_URL}/users/`);
export const fetchLicenses = () => axios.get(`${API_BASE_URL}/licenses/`);
export const fetchUsageStats = () => axios.get(`${API_BASE_URL}/usage_stats/`);
export const fetchOptimizations = () => axios.get(`${API_BASE_URL}/optimizations/`);
