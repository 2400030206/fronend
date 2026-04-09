import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'student-portfolio-jwt';

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: '/api',
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        return;
    }

    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const clearAuthToken = () => setAuthToken(null);

const storedToken = getAuthToken();
if (storedToken) {
    setAuthToken(storedToken);
}

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
