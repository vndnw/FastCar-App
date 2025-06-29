import apiClient from '../utils/apiClient';
import { carService } from './carService';

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
    },

    // Check-in booking (condition check)
    checkInBooking: async (bookingId, conditionData) => {
        return apiClient.post(`/booking/${bookingId}/condition-check`, conditionData);
    },

    // Check-out booking
    checkOutBooking: async (bookingId, checkoutData) => {
        return apiClient.post(`/booking/${bookingId}/checkout`, checkoutData);
    },

    // Get all bookings for cars owned by the current user
    getOwnerBookings: async (userId, page = 0, size = 10) => {
        try {
            console.log('getOwnerBookings called with:', { userId, page, size });

            // First, get all cars owned by the user
            const carsResponse = await carService.getCarsByUserId(userId);
            console.log('Cars response:', carsResponse);

            const ownedCars = carsResponse.data || [];
            console.log('Owned cars:', ownedCars);

            if (ownedCars.length === 0) {
                console.log('No cars found for user', userId);
                return {
                    status: 200,
                    data: {
                        content: [],
                        totalElements: 0,
                        totalPages: 0,
                        size: size,
                        number: page
                    }
                };
            }

            // Then, get bookings for each car
            console.log('Fetching bookings for', ownedCars.length, 'cars');
            const bookingPromises = ownedCars.map(car => {
                console.log('Fetching bookings for car ID:', car.id);
                return apiClient.get(`/booking/car/${car.id}`);
            });

            const bookingResponses = await Promise.all(bookingPromises);
            console.log('Booking responses:', bookingResponses);

            // Flatten all bookings into a single array
            const allBookings = bookingResponses.flatMap(response => {
                const bookings = response.data?.content || response.data || [];
                console.log('Bookings from response:', bookings);
                return bookings;
            });

            console.log('All bookings combined:', allBookings);

            // Sort bookings by creation date (most recent first)
            allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Apply pagination
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedBookings = allBookings.slice(startIndex, endIndex);

            console.log('Final paginated bookings:', paginatedBookings);

            return {
                status: 200,
                data: {
                    content: paginatedBookings,
                    totalElements: allBookings.length,
                    totalPages: Math.ceil(allBookings.length / size),
                    size: size,
                    number: page
                }
            };
        } catch (error) {
            console.error('Error fetching owner bookings:', error);
            throw error;
        }
    }
};

export default bookingService;
