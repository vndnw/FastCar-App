// Example usage of the new car search API
import { carService } from '../services/carService';
import { 
    CarSearchCriteriaBuilder, 
    CommonSearchCriteria, 
    LocationUtils,
    CAR_TYPES,
    FUEL_TYPES 
} from '../utils/carSearchUtils';

// Example 1: Basic search by car type
export const searchLuxuryCars = async () => {
    try {
        const response = await carService.searchCars({
            carType: CAR_TYPES.LUXURY
        });
        return response.data;
    } catch (error) {
        console.error('Error searching luxury cars:', error);
        throw error;
    }
};

// Example 2: Complex search using builder pattern
export const searchCarsWithBuilder = async () => {
    try {
        const criteria = CarSearchCriteriaBuilder
            .create()
            .withCarType(criteria, CAR_TYPES.LUXURY)
            .withPriceRange(criteria, 1000000, 5000000)
            .withMinSeats(criteria, 4)
            .withDateRange(criteria, '2025-07-01', '2025-07-03')
            .withLocation(criteria, 'Hồ Chí Minh');

        const response = await carService.searchCars(criteria, 0, 20);
        return response.data;
    } catch (error) {
        console.error('Error searching cars with builder:', error);
        throw error;
    }
};

// Example 3: Search by geographic coordinates
export const searchCarsByCoordinates = async (lat, lng, radius = 10) => {
    try {
        const criteria = {
            latitude: lat,
            longitude: lng,
            radiusInKm: radius,
            carType: CAR_TYPES.STANDARD
        };

        const response = await carService.searchCars(criteria);
        return response.data;
    } catch (error) {
        console.error('Error searching cars by coordinates:', error);
        throw error;
    }
};

// Example 4: Search available cars in Ho Chi Minh City
export const searchAvailableCarsInHCM = async (startDate, endDate) => {
    try {
        const hcmCoordinates = LocationUtils.getCityCoordinates('Hồ Chí Minh');
        
        const criteria = {
            startDate: startDate,
            endDate: endDate,
            latitude: hcmCoordinates.latitude,
            longitude: hcmCoordinates.longitude,
            radiusInKm: 20 // 20km radius
        };

        const response = await carService.searchCars(criteria, 0, 50);
        return response.data;
    } catch (error) {
        console.error('Error searching available cars in HCM:', error);
        throw error;
    }
};

// Example 5: Search cars with multiple filters
export const advancedCarSearch = async (searchParams) => {
    try {
        const {
            location,
            carType,
            minPrice,
            maxPrice,
            startDate,
            endDate,
            minSeats,
            fuelType,
            page = 0,
            size = 10
        } = searchParams;

        const criteria = {};

        // Add filters conditionally
        if (carType) criteria.carType = carType;
        if (minPrice) criteria.minPrice = minPrice;
        if (maxPrice) criteria.maxPrice = maxPrice;
        if (startDate) criteria.startDate = startDate;
        if (endDate) criteria.endDate = endDate;
        if (minSeats) criteria.minSeats = minSeats;
        if (fuelType) criteria.fuelType = fuelType;

        // Handle location with priority
        if (location) {
            const coordinates = LocationUtils.getCityCoordinates(location);
            if (coordinates) {
                criteria.latitude = coordinates.latitude;
                criteria.longitude = coordinates.longitude;
                criteria.radiusInKm = 15;
            } else {
                criteria.location = location;
            }
        }

        const response = await carService.searchCars(criteria, page, size);
        return response.data;
    } catch (error) {
        console.error('Error in advanced car search:', error);
        throw error;
    }
};

// Example 6: Search cars for specific brands
export const searchCarsByBrand = async (brandId, additionalFilters = {}) => {
    try {
        const criteria = {
            brandId: brandId,
            ...additionalFilters
        };

        const response = await carService.searchCars(criteria);
        return response.data;
    } catch (error) {
        console.error('Error searching cars by brand:', error);
        throw error;
    }
};

// Example 7: Search cars using common criteria
export const searchWithCommonCriteria = async () => {
    try {
        // Using predefined common search criteria
        const { criteria, page, size } = CommonSearchCriteria.luxuryCars(0, 20);
        const response = await carService.searchCars(criteria, page, size);
        return response.data;
    } catch (error) {
        console.error('Error using common criteria:', error);
        throw error;
    }
};

// Example 8: Search for CarListing component integration
export const searchCarsForListing = async (searchParams) => {
    try {
        const {
            category,
            location,
            pickupDate,
            returnDate,
            filters = [],
            sortBy,
            page = 0,
            size = 12
        } = searchParams;

        const criteria = {};

        // Handle category
        if (category === 'luxury') {
            criteria.carType = CAR_TYPES.LUXURY;
        } else if (category === 'normal') {
            criteria.carType = CAR_TYPES.STANDARD;
        }

        // Handle location
        if (location) {
            const cityName = LocationUtils.slugToCity(location);
            const coordinates = LocationUtils.getCityCoordinates(cityName);
            
            if (coordinates) {
                criteria.latitude = coordinates.latitude;
                criteria.longitude = coordinates.longitude;
                criteria.radiusInKm = 20;
            } else {
                criteria.location = cityName;
            }
        }

        // Handle date range
        if (pickupDate && returnDate) {
            criteria.startDate = pickupDate;
            criteria.endDate = returnDate;
        }

        // Handle additional filters (brands, etc.)
        // This would need to be expanded based on your filter implementation

        const response = await carService.searchCars(criteria, page, size);
        return response.data;
    } catch (error) {
        console.error('Error searching cars for listing:', error);
        throw error;
    }
};

export default {
    searchLuxuryCars,
    searchCarsWithBuilder,
    searchCarsByCoordinates,
    searchAvailableCarsInHCM,
    advancedCarSearch,
    searchCarsByBrand,
    searchWithCommonCriteria,
    searchCarsForListing
};
