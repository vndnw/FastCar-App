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
    },

    // Get cars by user ID
    getCarsByUserId: async (userId) => {
        return apiClient.get(`/user/${userId}/list-car`);
    },    // Create new car
    createCar: async (carData) => {
        return apiClient.post('/car', carData);
    },

    // Create new car by user with images
    createCarByUser: async (userId, carData, files) => {
        const formData = new FormData();
        
        // Add car data as JSON string
        formData.append('carRequest', new Blob([JSON.stringify(carData)], {
            type: 'application/json'
        }));
        
        // Add multiple files
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('file', file);
            });
        }
        
        return apiClient.post(`/user/${userId}/create-car`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Update car
    updateCar: async (id, carData) => {
        return apiClient.put(`/car/${id}`, carData);
    },

    // Delete car
    deleteCar: async (id) => {
        return apiClient.delete(`/car/${id}`);
    },
    
    // Advanced search cars with multiple criteria
    searchCars: async (searchCriteria = {}, page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        // Add search criteria to params if they exist
        if (searchCriteria.brandId) {
            params.append('brandId', searchCriteria.brandId.toString());
        }
        if (searchCriteria.name) {
            params.append('name', searchCriteria.name);
        }
        if (searchCriteria.carType) {
            params.append('carType', searchCriteria.carType);
        }
        if (searchCriteria.fuelType) {
            params.append('fuelType', searchCriteria.fuelType);
        }
        if (searchCriteria.minPrice) {
            params.append('minPrice', searchCriteria.minPrice.toString());
        }
        if (searchCriteria.maxPrice) {
            params.append('maxPrice', searchCriteria.maxPrice.toString());
        }
        if (searchCriteria.minSeats) {
            params.append('minSeats', searchCriteria.minSeats.toString());
        }
        
        // Date availability filters
        if (searchCriteria.startDate) {
            params.append('startDate', searchCriteria.startDate);
        }
        if (searchCriteria.endDate) {
            params.append('endDate', searchCriteria.endDate);
        }
        
        // Location filters (priority order)
        // Priority 1: Geographic radius (most accurate)
        if (searchCriteria.latitude && searchCriteria.longitude) {
            params.append('latitude', searchCriteria.latitude.toString());
            params.append('longitude', searchCriteria.longitude.toString());
            if (searchCriteria.radiusInKm) {
                params.append('radiusInKm', searchCriteria.radiusInKm.toString());
            }
        }
        // Priority 2: City/District (structured)
        else if (searchCriteria.city || searchCriteria.district) {
            if (searchCriteria.city) {
                params.append('city', searchCriteria.city);
            }
            if (searchCriteria.district) {
                params.append('district', searchCriteria.district);
            }
        }
        // Priority 3: General location text (least accurate)
        else if (searchCriteria.location) {
            params.append('location', searchCriteria.location);
        }

        return apiClient.get(`/car/search?${params}`);
    },

    // Search cars by name (kept for backward compatibility)
    getCarsByName: async (name, page = 0, size = 10) => {
        return carService.searchCars({ name }, page, size);
    },

    // Get cars by location (kept for backward compatibility)
    getCarsByLocation: async (location, page = 0, size = 10) => {
        return carService.searchCars({ location }, page, size);
    },

    // Get available cars (kept for backward compatibility)
    getAvailableCars: async (startDate, endDate, page = 0, size = 10) => {
        return carService.searchCars({ startDate, endDate }, page, size);
    },

    // Upload car images
    uploadCarImages: async (carId, formData) => {
        return apiClient.post(`/car/${carId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // lấy xe xịn
    getCarsSuperLuxury: async (page = 0, size = 10) => {
        return carService.searchCars({ carType: "SUPER_LUXURY" }, page, size);
    },

    // lấy xe sang
    getCarsLuxury: async (page = 0, size = 7) => {
        return carService.searchCars({ carType: "LUXURY" }, page, size);
    },

    getCarsStandard: async (page = 0, size = 7) => {
        return carService.searchCars({ carType: "STANDARD" }, page, size);
    },

    // Update car status
    updateCarStatus: async (id, status) => {
        return apiClient.patch(`/car/${id}/update-status/${status}`);
    },
};

export default carService;
