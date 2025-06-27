/**
 * Examples và documentation cho SUPER_LUXURY car type
 */

// Import các utilities cần thiết
import { CarTypeUtils, UrlParamUtils } from '../utils/carTypeUtils.js';
import { CAR_TYPES } from '../utils/carSearchUtils.js';

// 1. Navigation examples cho tất cả 3 loại carType
export const navigationExamples = {
    // Xe thường
    standard: () => {
        const url = UrlParamUtils.buildCarListingUrl('STANDARD');
        console.log('Navigate to Standard cars:', url);
        // Output: /car-listing?carType=STANDARD
    },

    // Xe sang
    luxury: () => {
        const url = UrlParamUtils.buildCarListingUrl('LUXURY');
        console.log('Navigate to Luxury cars:', url);
        // Output: /car-listing?carType=LUXURY
    },

    // Siêu xe
    superLuxury: () => {
        const url = UrlParamUtils.buildCarListingUrl('SUPER_LUXURY');
        console.log('Navigate to Super Luxury cars:', url);
        // Output: /car-listing?carType=SUPER_LUXURY
    },

    // Với search criteria
    withSearchCriteria: () => {
        const url = UrlParamUtils.buildCarListingUrl(
            'SUPER_LUXURY',
            'ho-chi-minh',
            '2025-06-28',
            '08:00',
            '2025-06-30',
            '20:00'
        );
        console.log('Super Luxury cars with search criteria:', url);
        // Output: /car-listing?carType=SUPER_LUXURY&location=ho-chi-minh&pickupDate=2025-06-28&pickupTime=08:00&returnDate=2025-06-30&returnTime=20:00
    }
};

// 2. API search criteria examples
export const searchCriteriaExamples = {
    // Search cho từng loại xe riêng biệt
    searchStandardCars: {
        carType: CAR_TYPES.STANDARD,
        minPrice: 100000,
        maxPrice: 2000000
    },

    searchLuxuryCars: {
        carType: CAR_TYPES.LUXURY,
        minPrice: 1000000,
        maxPrice: 10000000
    },

    searchSuperLuxuryCars: {
        carType: CAR_TYPES.SUPER_LUXURY,
        minPrice: 5000000,
        maxPrice: 100000000
    },

    // Search với địa điểm
    searchSuperLuxuryInHCM: {
        carType: CAR_TYPES.SUPER_LUXURY,
        latitude: 10.776,
        longitude: 106.7037,
        radiusInKm: 20
    },

    // Search với brand name
    searchFerrari: {
        carType: CAR_TYPES.SUPER_LUXURY,
        name: 'ferrari'
    }
};

// 3. Filter examples cho UI
export const filterExamples = {
    // Filter options cho search page
    getSearchFilters: () => {
        return CarTypeUtils.getFilterOptionsByCarType(null, true);
        // Returns: Tất cả, Xe thường, Xe sang, Siêu xe
    },

    // Filter options cho SUPER_LUXURY page
    getSuperLuxuryFilters: () => {
        return CarTypeUtils.getFilterOptionsByCarType('SUPER_LUXURY', false);
        // Returns: Tất cả, Ferrari, Lamborghini, Porsche, Bentley
    },

    // Filter options cho LUXURY page
    getLuxuryFilters: () => {
        return CarTypeUtils.getFilterOptionsByCarType('LUXURY', false);
        // Returns: Tất cả, Mercedes, BMW, Audi, Lexus
    },

    // Filter options cho STANDARD page
    getStandardFilters: () => {
        return CarTypeUtils.getFilterOptionsByCarType('STANDARD', false);
        // Returns: Tất cả, Toyota, Hyundai, Honda, Suzuki, Kia, Mazda
    }
};

// 4. Display name examples
export const displayNameExamples = {
    getDisplayNames: () => {
        console.log('STANDARD:', CarTypeUtils.getDisplayName('STANDARD')); // "Xe thường"
        console.log('LUXURY:', CarTypeUtils.getDisplayName('LUXURY')); // "Xe sang - Xe cao cấp"
        console.log('SUPER_LUXURY:', CarTypeUtils.getDisplayName('SUPER_LUXURY')); // "Xe siêu sang"
        console.log('null:', CarTypeUtils.getDisplayName(null)); // "Tất cả xe cho thuê"
    }
};

// 5. Validation examples
export const validationExamples = {
    checkValidCarTypes: () => {
        console.log('STANDARD is valid:', CarTypeUtils.isValidCarType('STANDARD')); // true
        console.log('LUXURY is valid:', CarTypeUtils.isValidCarType('LUXURY')); // true
        console.log('SUPER_LUXURY is valid:', CarTypeUtils.isValidCarType('SUPER_LUXURY')); // true
        console.log('INVALID is valid:', CarTypeUtils.isValidCarType('INVALID')); // false
    },

    getAllValidTypes: () => {
        const validTypes = CarTypeUtils.getAllCarTypes();
        console.log('All valid car types:', validTypes);
        // Output: ['LUXURY', 'STANDARD', 'SUPER_LUXURY']
    }
};

// 6. Migration examples từ old category system
export const migrationExamples = {
    convertOldCategories: () => {
        console.log('luxury ->', CarTypeUtils.convertCategoryToCarType('luxury')); // "LUXURY"
        console.log('normal ->', CarTypeUtils.convertCategoryToCarType('normal')); // "STANDARD"
        console.log('super_luxury ->', CarTypeUtils.convertCategoryToCarType('super_luxury')); // "SUPER_LUXURY"
        console.log('super-luxury ->', CarTypeUtils.convertCategoryToCarType('super-luxury')); // "SUPER_LUXURY"
    },

    migrateOldUrls: () => {
        const oldParams = {
            category: 'super_luxury',
            location: 'ho-chi-minh',
            pickupDate: '2025-06-28'
        };

        const newParams = UrlParamUtils.migrateOldUrls(oldParams);
        console.log('Migrated params:', newParams);
        // Output: { carType: 'SUPER_LUXURY', location: 'ho-chi-minh', pickupDate: '2025-06-28' }
    }
};

// 7. Sample car data structure for SUPER_LUXURY
export const superLuxuryCarSample = {
    id: 100,
    name: "Ferrari 488 GTB",
    carBrand: {
        id: 14,
        name: "Ferrari"
    },
    carType: "SUPER_LUXURY",
    pricePer24Hour: 48000000,
    seats: 2,
    transmission: "AUTO",
    fuelType: "GASOLINE",
    year: 2023,
    description: "Siêu xe thể thao đẳng cấp với động cơ V8 twin-turbo mạnh mẽ.",
    images: [
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
    ]
};

// 8. Usage examples trong React components
export const reactUsageExamples = {
    // Trong Home component
    navigateToSuperLuxury: (navigate) => {
        navigate('/car-listing?carType=SUPER_LUXURY');
    },

    // Trong CarListing component - filter cars by type
    filterCarsByType: (cars, carType) => {
        if (carType === 'SUPER_LUXURY') {
            return cars.filter(car => car.carType === 'SUPER_LUXURY');
        } else if (carType === 'LUXURY') {
            return cars.filter(car => car.carType === 'LUXURY');
        } else if (carType === 'STANDARD') {
            return cars.filter(car => car.carType === 'STANDARD' || !car.carType);
        } else {
            return cars; // All cars
        }
    },

    // Build search criteria với carType
    buildSearchCriteria: (carType, location, dateRange) => {
        const criteria = {};

        if (carType) {
            criteria.carType = carType;
        }

        if (location) {
            criteria.location = location;
        }

        if (dateRange) {
            criteria.startDate = dateRange.start;
            criteria.endDate = dateRange.end;
        }

        return criteria;
    }
};

// Export all examples
export default {
    navigationExamples,
    searchCriteriaExamples,
    filterExamples,
    displayNameExamples,
    validationExamples,
    migrationExamples,
    superLuxuryCarSample,
    reactUsageExamples
};
