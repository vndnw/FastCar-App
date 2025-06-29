import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { bankInformationService } from '../services/bankInformationService';
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

    const refreshUserData = useCallback(async () => {
        try {
            // Gọi API lấy thông tin user hiện tại
            const result = await userService.getCurrentUser();
            if (result.data) {
                const newUserData = result.data;
                setUser(newUserData);
                localStorage.setItem('userInfo', JSON.stringify(newUserData));
            } else {
                throw new Error("Không tìm thấy dữ liệu người dùng trong phản hồi API.");
            }
        } catch (error) {
            console.error('Lỗi khi làm mới dữ liệu người dùng:', error);
        }
    }, []);

    const updateUserProfile = useCallback(async (newProfileData) => {
        if (!user?.id) {
            throw new Error("Không tìm thấy người dùng để cập nhật.");
        }
        // Gọi API service để cập nhật thông tin
        const result = await userService.updateUserInfo(user.id, newProfileData);

        // Tự động làm mới dữ liệu sau khi cập nhật thành công
        await refreshUserData();

        return result; // Trả về kết quả của lời gọi API
    }, [user?.id, refreshUserData]);

    const addUserBankInfo = useCallback(async (bankData) => {
        if (!user?.id) throw new Error("Không tìm thấy người dùng.");

        const result = await bankInformationService.createBankUserInfo(user.id, bankData);
        await refreshUserData(); // Tự động làm mới sau khi thêm
        return result;
    }, [user?.id, refreshUserData]);

    const updateUserBankInfo = useCallback(async (bankData) => {
        if (!user?.id) throw new Error("Không tìm thấy người dùng.");

        const result = await bankInformationService.updateBankUserInfo(user.id, bankData);
        await refreshUserData(); // Tự động làm mới sau khi cập nhật
        return result;
    }, [user?.id, refreshUserData]);


    // Update Avatar
    const updateUserAvatar = useCallback(async (file) => {
        if (!user?.id) {
            throw new Error("Không tìm thấy người dùng.");
        }

        try {
            const result = await userService.updateAvatar(file);
            await refreshUserData(); // Tự động làm mới sau khi cập nhật
            return result;
        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh đại diện:', error);
            throw error;
        }
    }, [user, refreshUserData]);

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
        forceLogout,
        refreshUserData,
        updateUserProfile,
        addUserBankInfo,
        updateUserBankInfo,
        updateUserAvatar
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
