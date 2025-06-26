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

        return apiClient.get(`/bookings?${params}`);
    },

    // Get booking by ID
    getBookingById: async (id) => {
        return apiClient.get(`/bookings/${id}`);
    },

    // Create new booking
    createBooking: async (bookingData) => {
        return apiClient.post('/bookings', bookingData);
    },

    // Update booking
    updateBooking: async (id, bookingData) => {
        return apiClient.put(`/bookings/${id}`, bookingData);
    },

    // Cancel booking
    cancelBooking: async (id, reason) => {
        return apiClient.patch(`/bookings/${id}/cancel`, { reason });
    },

    // Confirm booking
    confirmBooking: async (id) => {
        return apiClient.patch(`/bookings/${id}/confirm`);
    },

    // Complete booking
    completeBooking: async (id) => {
        return apiClient.patch(`/bookings/${id}/complete`);
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

        return apiClient.get(`/users/${userId}/bookings?${params}`);
    },

    // Get car bookings
    getCarBookings: async (carId, page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/cars/${carId}/bookings?${params}`);
    },

    // Get bookings by status
    getBookingsByStatus: async (status, page = 0, size = 10) => {
        const params = new URLSearchParams({
            status: status,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/bookings/status?${params}`);
    }
};

export default bookingService;
