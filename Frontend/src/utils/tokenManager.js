// Token management utilities
export const tokenManager = {
    // Get access token from localStorage
    getAccessToken: () => {
        return localStorage.getItem('authToken');
    },

    // Get refresh token from localStorage
    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    },

    // Set access token
    setAccessToken: (token) => {
        localStorage.setItem('authToken', token);
    },

    // Set refresh token
    setRefreshToken: (token) => {
        localStorage.setItem('refreshToken', token);
    },

    // Set both tokens
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('authToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    // Clear all tokens
    clearTokens: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
    },

    // Check if access token exists
    hasAccessToken: () => {
        return !!localStorage.getItem('authToken');
    },

    // Check if refresh token exists
    hasRefreshToken: () => {
        return !!localStorage.getItem('refreshToken');
    },

    // Parse JWT token to get expiry (without verification)
    isTokenExpired: (token) => {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    },

    // Get token expiry time
    getTokenExpiry: (token) => {
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000; // Convert to milliseconds
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }
};

export default tokenManager;
