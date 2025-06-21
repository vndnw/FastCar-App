import apiClient from '../utils/apiClient';

// Discount API service
export const discountService = {
    // Get all discounts with pagination
    getDiscounts: async (page = 0, size = 10, sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/discount?${params}`);
    },

    // Get discount by ID
    getDiscountById: async (id) => {
        return apiClient.get(`/discount/${id}`);
    },

    // Create new discount
    createDiscount: async (discountData) => {
        return apiClient.post('/discount', discountData);
    },

    // Update discount
    updateDiscount: async (id, discountData) => {
        return apiClient.put(`/discount/${id}`, discountData);
    },

    // Delete discount
    deleteDiscount: async (id) => {
        return apiClient.delete(`/discount/${id}`);
    },

    // Get discount by code
    getDiscountByCode: async (code) => {
        return apiClient.get(`/discount/code/${code}`);
    },

    // Activate/Deactivate discount
    toggleDiscountStatus: async (id, isActive) => {
        return apiClient.patch(`/discount/${id}/status`, { isActive });
    },

    // Get active discounts
    getActiveDiscounts: async (page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            active: 'true'
        });

        return apiClient.get(`/discount/active?${params}`);
    },

    // Apply discount to order
    applyDiscount: async (code, orderValue) => {
        return apiClient.post('/discount/apply', { code, orderValue });
    },

    // Get discount usage statistics
    getDiscountStats: async (id) => {
        return apiClient.get(`/discount/${id}/stats`);
    }
};

export default discountService;
