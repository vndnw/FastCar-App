import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is authenticated on app load
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('authToken');
            const savedUser = localStorage.getItem('userInfo');

            if (savedToken) {
                setToken(savedToken);

                if (savedUser) {
                    try {
                        setUser(JSON.parse(savedUser));
                        setIsAuthenticated(true);
                    } catch (error) {
                        console.error('Error parsing saved user:', error);
                        localStorage.removeItem('userInfo');
                    }
                } else {
                    // Try to get user info from API
                    try {
                        const result = await authService.getCurrentUser();
                        if (result.status === 200) {
                            setUser(result.data);
                            setIsAuthenticated(true);
                            localStorage.setItem('userInfo', JSON.stringify(result.data));
                        }
                    } catch (error) {
                        console.error('Error getting current user:', error);
                        // Token might be expired, clear it
                        logout();
                    }
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = async (emailOrPhone, password) => {
        try {
            const result = await authService.login(emailOrPhone, password);

            if (result.status === 200) {
                const { accessToken: authToken, refreshToken, user: userData } = result.data;

                // Save to localStorage
                localStorage.setItem('authToken', authToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                localStorage.setItem('userInfo', JSON.stringify(userData));

                // Update state
                setToken(authToken);
                setUser(userData);
                setIsAuthenticated(true);

                return { success: true, data: result.data };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');

            // Reset state
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.roles?.includes(role) || false;
    };

    // Check if user is admin
    const isAdmin = () => {
        return hasRole('admin');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        hasRole,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
