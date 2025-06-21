// API Base URL
export const API_BASE_URL = 'http://localhost:8080/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        ME: '/auth/me'
    },

    // User endpoints
    USER: {
        LIST: '/user',
        DETAIL: (id) => `/user/${id}`,
        CREATE: '/user',
        UPDATE: (id) => `/user/${id}`,
        DELETE: (id) => `/user/${id}`,
        STATUS: (id) => `/user/${id}/status`,
        SEARCH: '/user/search',
        BY_ROLE: '/user/role'
    },

    // Car endpoints
    CAR: {
        LIST: '/cars',
        DETAIL: (id) => `/cars/${id}`,
        CREATE: '/cars',
        UPDATE: (id) => `/cars/${id}`,
        DELETE: (id) => `/cars/${id}`,
        SEARCH: '/cars/search',
        BY_LOCATION: '/cars/location',
        AVAILABLE: '/cars/available',
        IMAGES: (id) => `/cars/${id}/images`
    },

    // Booking endpoints
    BOOKING: {
        LIST: '/bookings',
        DETAIL: (id) => `/bookings/${id}`,
        CREATE: '/bookings',
        UPDATE: (id) => `/bookings/${id}`,
        CANCEL: (id) => `/bookings/${id}/cancel`,
        CONFIRM: (id) => `/bookings/${id}/confirm`,
        COMPLETE: (id) => `/bookings/${id}/complete`,
        USER_BOOKINGS: (userId) => `/users/${userId}/bookings`,
        CAR_BOOKINGS: (carId) => `/cars/${carId}/bookings`,
        BY_STATUS: '/bookings/status'
    }
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_INFO: 'userInfo'
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    DEFAULT_SORT: 'id,desc'
};

// Car status
export const CAR_STATUS = {
    AVAILABLE: 'AVAILABLE',
    BOOKED: 'BOOKED',
    MAINTENANCE: 'MAINTENANCE',
    INACTIVE: 'INACTIVE'
};

// Booking status
export const BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

// User roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    DRIVER: 'driver'
};
