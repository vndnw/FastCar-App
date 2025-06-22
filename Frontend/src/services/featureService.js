import apiClient from '../utils/apiClient';

// Feature service
export const featureService = {
    // Get all featured cars
    getFeaturedCars: async (page = 0, size = 10, sort = 'id,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/feature?${params}`);
    },

    // Get featured car by ID
    getFeaturedCarById: async (id) => {
        return apiClient.get(`/feature/${id}`);
    },

    // Add car to featured list
    addFeaturedCar: async (carId) => {
        return apiClient.post('/feature', { carId });
    },

    // Remove car from featured list
    removeFeaturedCar: async (id) => {
        return apiClient.delete(`/feature/${id}`);
    },

    // Update featured car
    updateFeaturedCar: async (id, featureData) => {
        return apiClient.put(`/feature/${id}`, featureData);
    },

    // Check if car is featured
    isCarFeatured: async (carId) => {
        return apiClient.get(`/feature/check/${carId}`);
    },

    // Get featured cars for public display (no pagination)
    getPublicFeaturedCars: async (limit = 6) => {
        const params = new URLSearchParams({
            limit: limit.toString()
        });

        return apiClient.get(`/feature/public?${params}`);
    },

    // Toggle featured status of a car
    toggleFeaturedStatus: async (carId) => {
        return apiClient.post(`/feature/toggle/${carId}`);
    },

    // Get featured cars by category
    getFeaturedCarsByCategory: async (category, page = 0, size = 10) => {
        const params = new URLSearchParams({
            category: category,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/feature/category?${params}`);
    },

    // Set featured car priority/order
    setFeaturedCarPriority: async (id, priority) => {
        return apiClient.patch(`/feature/${id}/priority`, { priority });
    },

    // Get all car features (tính năng xe)
    getFeatures: async (page = 0, size = 10, sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/feature?${params}`);
    },

    // Get feature by ID
    getFeatureById: async (id) => {
        return apiClient.get(`/feature/${id}`);
    },

    // Create new feature
    createFeature: async (featureData) => {
        return apiClient.post('/feature', featureData);
    },

    // Update feature
    updateFeature: async (id, featureData) => {
        return apiClient.put(`/feature/${id}`, featureData);
    },

    // Delete feature
    deleteFeature: async (id) => {
        return apiClient.delete(`/feature/${id}`);
    },
};

export default featureService;
