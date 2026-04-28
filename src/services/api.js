import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'student-portfolio-jwt';
export const REFRESH_TOKEN_KEY = 'student-portfolio-refresh-jwt';

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://fullstackreview-3.onrender.com/api',
    timeout: 10000,
});

// Token Management Functions
export const setAuthToken = (token, refreshToken = null) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        return;
    }

    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const clearAuthToken = () => setAuthToken(null);

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiryTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const getTokenExpiry = (token) => {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Initialize token from storage
const storedToken = getAuthToken();
if (storedToken && !isTokenExpired(storedToken)) {
    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
} else {
    clearAuthToken();
}

// Request Interceptor - Add token to all requests
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        if (isTokenExpired(token)) {
            console.warn('Token is expired, clearing session');
            clearAuthToken();
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor - Handle 401 and token expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized: Token may be invalid or expired');
            clearAuthToken();
            // Redirect to login will be handled by ProtectedRoute
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
