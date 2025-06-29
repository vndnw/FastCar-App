import apiClient from '../utils/apiClient';

// Car Brand API service
export const carBrandService = {
    // Get all car brands with pagination
    getCarBrands: async (page = 0, size = 100) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/carbrand?${params}`);
    },

    // Get car brand by ID
    getCarBrandById: async (id) => {
        return apiClient.get(`/carbrand/${id}`);
    },

    // Create new car brand
    createCarBrand: async (carBrandData) => {
        return apiClient.post('/carbrand', carBrandData);
    },

    // Update car brand
    updateCarBrand: async (id, carBrandData) => {
        return apiClient.put(`/carbrand/${id}`, carBrandData);
    },

    // Delete car brand
    deleteCarBrand: async (id) => {
        return apiClient.delete(`/carbrand/${id}`);
    },

    // Search car brands by name
    searchCarBrands: async (name, page = 0, size = 10) => {
        const params = new URLSearchParams({
            name: name,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/carbrand/search?${params}`);
    },


    // Toggle car brand status
    toggleCarBrandStatus: async (id, isActive) => {
        return apiClient.patch(`/carbrand/${id}/status`, { isActive });
    }
};

export default carBrandService;
