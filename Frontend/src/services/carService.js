import apiClient from '../utils/apiClient';

// Car service
export const carService = {
    // Get all cars with pagination
    getCars: async (page = 0, size = 10, sort = 'id,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/car?${params}`);
    },

    // Get car by ID
    getCarById: async (id) => {
        return apiClient.get(`/car/${id}`);
    },    // Create new car
    createCar: async (carData) => {
        return apiClient.post('/car', carData);
    },

    // Create new car by user
    createCarByUser: async (userId, carData) => {
        return apiClient.post(`/user/${userId}/create-car`, carData);
    },

    // Update car
    updateCar: async (id, carData) => {
        return apiClient.put(`/car/${id}`, carData);
    },

    // Delete car
    deleteCar: async (id) => {
        return apiClient.delete(`/car/${id}`);
    },

    // Search cars
    searchCars: async (query, page = 0, size = 10) => {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/car/search?${params}`);
    },

    // Get cars by location
    getCarsByLocation: async (location, page = 0, size = 10) => {
        const params = new URLSearchParams({
            location: location,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/car/location?${params}`);
    },

    // Get available cars
    getAvailableCars: async (startDate, endDate, page = 0, size = 10) => {
        const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/car/available?${params}`);
    },

    // Upload car images
    uploadCarImages: async (carId, formData) => {
        return apiClient.post(`/car/${carId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default carService;
