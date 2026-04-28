import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { clearAuthToken, getAuthToken, setAuthToken, isTokenExpired, getTokenExpiry } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => getAuthToken());
    const [loading, setLoading] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState(null);
    const [lastActivity, setLastActivity] = useState(Date.now());

    // Session timeout handling (30 minutes of inactivity)
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    // Check token expiry and update session
    const checkTokenExpiry = useCallback(() => {
        const storedToken = getAuthToken();
        if (storedToken && isTokenExpired(storedToken)) {
            console.warn('Token expired, clearing session');
            logout();
            return false;
        }
        return true;
    }, []);

    // Track user activity for session timeout
    const trackActivity = useCallback(() => {
        setLastActivity(Date.now());
    }, []);

    // Session timeout monitor
    useEffect(() => {
        const interval = setInterval(() => {
            if (user && token) {
                const now = Date.now();
                if (now - lastActivity > INACTIVITY_TIMEOUT) {
                    console.warn('Session timeout due to inactivity');
                    logout();
                } else {
                    // Check if token is about to expire
                    const expiry = getTokenExpiry(token);
                    if (expiry && expiry - now < 5 * 60 * 1000) { // Less than 5 minutes
                        console.warn('Token expiring soon');
                    }
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [user, token, lastActivity]);

    // Add activity listeners
    useEffect(() => {
        window.addEventListener('mousemove', trackActivity);
        window.addEventListener('keydown', trackActivity);
        window.addEventListener('click', trackActivity);

        return () => {
            window.removeEventListener('mousemove', trackActivity);
            window.removeEventListener('keydown', trackActivity);
            window.removeEventListener('click', trackActivity);
        };
    }, [trackActivity]);

    // Restore session on app load
    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = getAuthToken();
            if (!storedToken) {
                setLoading(false);
                return;
            }

            if (isTokenExpired(storedToken)) {
                console.warn('Stored token is expired');
                clearAuthToken();
                setLoading(false);
                return;
            }

            try {
                setAuthToken(storedToken);
                const response = await api.get('/auth/me');
                setUser(response.data);
                setToken(storedToken);
                console.debug('Session restored for', response.data.username);
            } catch (error) {
                console.warn('Failed to restore session:', error.message);
                clearAuthToken();
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token: jwtToken, user: authenticatedUser } = response.data;

            if (!jwtToken) {
                throw new Error('Login response did not include a token');
            }

            setAuthToken(jwtToken);
            setToken(jwtToken);
            setUser(authenticatedUser);
            setLastActivity(Date.now());
            console.debug('Login succeeded for', authenticatedUser.username);

            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = useCallback(async () => {
        try {
            // Call logout endpoint to invalidate token on server if needed
            await api.post('/auth/logout').catch(() => {
                // Server logout might fail if already logged out, that's fine
            });
        } catch (error) {
            console.warn('Server logout failed:', error);
        } finally {
            clearAuthToken();
            setToken(null);
            setUser(null);
            setLastActivity(Date.now());
            console.debug('Local session cleared');
        }
    }, []);

    const value = {
        user,
        token,
        login,
        logout,
        loading,
        setUser,
        setToken,
        checkTokenExpiry,
        lastActivity,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
