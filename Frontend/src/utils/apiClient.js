import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage or any other storage
        const token = localStorage.getItem('authToken');
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
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
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
