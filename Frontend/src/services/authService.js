import apiClient from '../utils/apiClient';

// Authentication service
export const authService = {
    // Login
    login: async (emailOrPhone, password) => {
        return apiClient.post('/auth/login', { emailOrPhone, password });
    },

    // Register
    register: async (userData) => {
        return apiClient.post('/auth/register', userData);
    },

    // Logout
    logout: async () => {
        return apiClient.post('/auth/logout');
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        return apiClient.post('/auth/refresh', { refreshToken });
    },

    // Forgot password
    forgotPassword: async (email) => {
        return apiClient.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        return apiClient.post('/auth/reset-password', { token, newPassword });
    },

    // Verify email
    verifyEmail: async (token) => {
        return apiClient.post('/auth/verify-email', { token });
    },

    // Get current user profile
    getCurrentUser: async () => {
        return apiClient.get('/auth/me');
    }
};

export default authService;
