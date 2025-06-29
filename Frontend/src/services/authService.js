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
        return apiClient.post(`/auth/forgot-password?email=${email}`);
    },

    // Verify password OTP
    verifyPasswordOtp: async (email, otp) => {
        return apiClient.post('/auth/verify-password-otp', { email, otp });
    },

    // Reset password
    resetPassword: async (email, newPassword) => {
        // API của bạn dùng PATCH và body là { email, newPass }
        return apiClient.patch('/auth/set-password', { email, newPassword });
    },

    // Verify email
    verifyEmail: async (token) => {
        return apiClient.post('/auth/verify-email', { token });
    },

    // Verify OTP
    verifyOTP: async (otpData) => {
        return apiClient.post('/auth/verify-active-otp', otpData);
    },

    // Get current user profile
    getCurrentUser: async () => {
        return apiClient.get('/auth/me');
    },

    // Check if token is valid
    validateToken: async () => {
        return apiClient.get('/auth/validate_token');
    },

    // Get new access token using refresh token
    refreshAccessToken: async (refreshToken) => {
        return apiClient.post('/auth/refresh', { refreshToken });
    },

    // Change password by admin
    changePasswordByAdmin: async (email, newPassword) => {
        return apiClient.post('/auth/change-password-admin', null, {
            params: {
                email,
                newPassword
            }
        });
    },
};

export default authService;
