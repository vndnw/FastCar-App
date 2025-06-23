import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import tokenManager from '../utils/tokenManager';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(tokenManager.getAccessToken());
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is authenticated on app load
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = tokenManager.getAccessToken();
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
                        const result = await userService.getCurrentUser();
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

    // Register function
    const register = async (userData) => {
        try {
            // Gửi thông tin đăng ký đến API
            const result = await authService.register(userData);
            if (result.status === 200) {
                // Đăng ký thành công, thông báo cho người dùng
                return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.' };
        }
    };

    // Verify OTP function
    const verifyOTP = async (otpData) => {
        try {
            // Gửi mã OTP đến API để xác thực
            const result = await authService.verifyOTP(otpData);
            if (result.status === 200) {
                return { success: true, message: 'Xác thực OTP thành công!' };
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            return { success: false, error: error.response?.data?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.' };
        }
    };

    // Login function
    const login = async (emailOrPhone, password) => {
        try {
            const result = await authService.login(emailOrPhone, password); if (result.status === 200) {
                const { accessToken: authToken, refreshToken, user: userData } = result.data;

                // Save to localStorage using tokenManager
                tokenManager.setTokens(authToken, refreshToken);
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
            // Clear localStorage using tokenManager
            tokenManager.clearTokens();

            // Reset state
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.roles?.includes(role) || false;
    };    // Check if user is admin
    const isAdmin = () => {
        return hasRole('admin');
    };    // Update tokens (called by API client when refresh token succeeds)
    const updateTokens = (newAccessToken, newRefreshToken) => {
        tokenManager.setTokens(newAccessToken, newRefreshToken);
        setToken(newAccessToken);
    };

    // Force logout (called by API client when refresh token fails)
    const forceLogout = () => {
        tokenManager.clearTokens();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        verifyOTP,
        hasRole,
        isAdmin,
        updateTokens,
        forceLogout
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
