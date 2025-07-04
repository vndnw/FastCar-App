import axios from 'axios';
import tokenManager from './tokenManager';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from tokenManager
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common responses
apiClient.interceptors.response.use(
    (response) => {
        // Return only data if response is successful
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - try to refresh token
                    if (originalRequest.url?.includes('/auth/refresh')) {
                        // If refresh token also failed, logout user
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    if (!originalRequest._retry) {
                        if (isRefreshing) {
                            // If already refreshing, queue this request
                            return new Promise((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            }).then(token => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return apiClient(originalRequest);
                            }).catch(err => {
                                return Promise.reject(err);
                            });
                        } originalRequest._retry = true;
                        isRefreshing = true;

                        const refreshToken = tokenManager.getRefreshToken();

                        if (!refreshToken) {
                            // No refresh token, logout user
                            tokenManager.clearTokens();
                            window.location.href = '/login';
                            return Promise.reject(error);
                        }

                        try {
                            // Try to refresh the token
                            const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                                refreshToken: refreshToken
                            });

                            if (response.data.status === 200 && response.data.data) {
                                const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;

                                // Save new tokens using tokenManager
                                tokenManager.setTokens(accessToken, newRefreshToken);

                                // Update user info if provided
                                if (user) {
                                    localStorage.setItem('userInfo', JSON.stringify(user));
                                }

                                // Update the authorization header
                                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                                // Process queued requests
                                processQueue(null, accessToken);

                                // Retry the original request
                                return apiClient(originalRequest);
                            } else {
                                throw new Error('Failed to refresh token');
                            }
                        } catch (refreshError) {
                            // Refresh failed, logout user
                            processQueue(refreshError, null);
                            tokenManager.clearTokens();
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        } finally {
                            isRefreshing = false;
                        }
                    }
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden:', data.message);
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found:', data.message);
                    break;
                case 500:
                    // Server error
                    console.error('Server error:', data.message);
                    break;
                default:
                    console.error('API Error:', data.message || 'Unknown error');
            }

            return Promise.reject({
                status,
                message: data.message || 'API Error',
                data: data.data
            });
        } else if (error.request) {
            // Network error
            console.error('Network error:', error.message);
            return Promise.reject({
                status: 0,
                message: 'Network error. Please check your connection.',
                data: null
            });
        } else {
            // Other error
            console.error('Error:', error.message);
            return Promise.reject({
                status: 0,
                message: error.message,
                data: null
            });
        }
    }
);

export default apiClient;