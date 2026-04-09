import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => getAuthToken());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = getAuthToken();
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                setAuthToken(storedToken);
                const response = await api.get('/auth/me');
                setUser(response.data);
                setToken(storedToken);
                console.debug('Restored authenticated session for', response.data.username);
            } catch (error) {
                console.warn('Failed to restore session from token', error);
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
        const response = await api.post('/auth/login', credentials);
        const { token: jwtToken, user: authenticatedUser } = response.data;

        if (!jwtToken) {
            throw new Error('Login response did not include a token');
        }

        setAuthToken(jwtToken);
        setToken(jwtToken);
        setUser(authenticatedUser);
        console.debug('Login succeeded for', authenticatedUser.username);

        return response.data;
    };

    const logout = async () => {
        clearAuthToken();
        setToken(null);
        setUser(null);
        console.debug('Logged out locally and cleared JWT');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, setUser, setToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
