import apiClient from '../utils/apiClient';

// Booking service
export const bookingService = {
    // Get all bookings with pagination
    getBookings: async (page = 0, size = 10, sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/booking?${params}`);
    },

    // Get booking by ID
    getBookingById: async (id) => {
        return apiClient.get(`/booking/${id}`);
    },

    // Create new booking
    createBooking: async (bookingData) => {
        return apiClient.post('/booking', bookingData);
    },

    // Update booking
    updateBooking: async (id, bookingData) => {
        return apiClient.put(`/booking/${id}`, bookingData);
    },

    // Cancel booking (updated to use POST)
    cancelBooking: async (id, reason) => {
        return apiClient.post(`/booking/${id}/cancel`, { reason });
    },

    // Confirm booking
    confirmBooking: async (id) => {
        return apiClient.patch(`/booking/${id}/confirm`);
    },

    // Complete booking
    completeBooking: async (id) => {
        return apiClient.patch(`/booking/${id}/complete`);
    },

    getSchedulesByCar: async (carId) => {
        return apiClient.get(`/booking/car/${carId}/schedule`);
    },

    // Get user bookings
    getUserBookings: async (userId, page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/users/${userId}/booking?${params}`);
    },

    // Get car bookings
    getCarBookings: async (carId, page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/cars/${carId}/booking?${params}`);
    },

    // Get bookings by status
    getBookingsByStatus: async (status, page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/booking/status/${status}?${params}`);
    },

    // Update booking status
    updateBookingStatus: async (id, status) => {
        return apiClient.patch(`/booking/${id}/status`, { status });
    },

    // Cancel booking (updated to use POST)
    cancelBooking: async (id, reason) => {
        return apiClient.post(`/booking/${id}/cancel`, { reason });
    },

    // Process refund for booking
    processRefund: async (id) => {
        return apiClient.post(`/booking/${id}/refund`);
    },

    // Apply extra charge to booking
    applyExtraCharge: async (id) => {
        return apiClient.post(`/booking/${id}/extra-charge`);
    },

    // Get user booking history
    getUserBookingHistory: async (userId, page = 0, size = 10) => {
        const params = new URLSearchParams({
            userId: userId.toString(),
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/booking/history?${params}`);
    }
};

export default bookingService;
