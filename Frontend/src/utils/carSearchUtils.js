// Car search utilities and builders
export const CarSearchCriteriaBuilder = {
    // Create empty search criteria
    create: () => ({}),

    // Add brand filter
    withBrand: (criteria, brandId) => ({
        ...criteria,
        brandId: brandId
    }),

    // Add name filter
    withName: (criteria, name) => ({
        ...criteria,
        name: name
    }),

    // Add car type filter
    withCarType: (criteria, carType) => ({
        ...criteria,
        carType: carType
    }),

    // Add fuel type filter
    withFuelType: (criteria, fuelType) => ({
        ...criteria,
        fuelType: fuelType
    }),

    // Add price range filter
    withPriceRange: (criteria, minPrice, maxPrice) => ({
        ...criteria,
        minPrice: minPrice,
        maxPrice: maxPrice
    }),

    // Add minimum seats filter
    withMinSeats: (criteria, minSeats) => ({
        ...criteria,
        minSeats: minSeats
    }),

    // Add date availability filter
    withDateRange: (criteria, startDate, endDate) => ({
        ...criteria,
        startDate: startDate,
        endDate: endDate
    }),

    // Add geographic location filter (highest priority)
    withCoordinates: (criteria, latitude, longitude, radiusInKm = 10) => ({
        ...criteria,
        latitude: latitude,
        longitude: longitude,
        radiusInKm: radiusInKm,
        // Clear other location filters
        city: undefined,
        district: undefined,
        location: undefined
    }),

    // Add city/district filter (medium priority)
    withCityDistrict: (criteria, city, district) => ({
        ...criteria,
        city: city,
        district: district,
        // Clear other location filters
        latitude: undefined,
        longitude: undefined,
        radiusInKm: undefined,
        location: undefined
    }),

    // Add general location filter (lowest priority)
    withLocation: (criteria, location) => ({
        ...criteria,
        location: location,
        // Clear other location filters
        latitude: undefined,
        longitude: undefined,
        radiusInKm: undefined,
        city: undefined,
        district: undefined
    })
};

// Predefined search criteria for common use cases
export const CommonSearchCriteria = {
    // Search for luxury cars
    luxuryCars: (page = 0, size = 10) => ({
        criteria: { carType: "LUXURY" },
        page,
        size
    }),

    // Search for standard cars
    standardCars: (page = 0, size = 10) => ({
        criteria: { carType: "STANDARD" },
        page,
        size
    }),

    // Search for super luxury cars
    superLuxuryCars: (page = 0, size = 10) => ({
        criteria: { carType: "SUPER_LUXURY" },
        page,
        size
    }),

    // Search cars by location
    carsByLocation: (location, page = 0, size = 10) => ({
        criteria: { location },
        page,
        size
    }),

    // Search available cars in date range
    availableCars: (startDate, endDate, page = 0, size = 10) => ({
        criteria: { startDate, endDate },
        page,
        size
    }),

    // Search cars by name
    carsByName: (name, page = 0, size = 10) => ({
        criteria: { name },
        page,
        size
    }),

    // Search cars in price range
    carsByPriceRange: (minPrice, maxPrice, page = 0, size = 10) => ({
        criteria: { minPrice, maxPrice },
        page,
        size
    })
};

// Location mapping utilities
export const LocationUtils = {
    // Vietnam cities mapping
    cityMapping: {
        'ho-chi-minh': 'Hồ Chí Minh',
        'ha-noi': 'Hà Nội',
        'da-nang': 'Đà Nẵng',
        'binh-duong': 'Bình Dương',
        'dong-nai': 'Đồng Nai',
        'ba-ria-vung-tau': 'Bà Rịa - Vũng Tàu',
        'can-tho': 'Cần Thơ',
        'hai-phong': 'Hải Phòng'
    },

    // Convert slug to city name
    slugToCity: (slug) => {
        return LocationUtils.cityMapping[slug] || slug;
    },

    // Convert city name to slug
    cityToSlug: (cityName) => {
        const entry = Object.entries(LocationUtils.cityMapping)
            .find(([_, value]) => value === cityName);
        return entry ? entry[0] : cityName.toLowerCase().replace(/\s+/g, '-');
    },

    // Get coordinates for major cities (mock data - in real app, use geocoding service)
    getCityCoordinates: (cityName) => {
        const coordinates = {
            'Hồ Chí Minh': { latitude: 10.762622, longitude: 106.660172 },
            'Hà Nội': { latitude: 21.028511, longitude: 105.804817 },
            'Đà Nẵng': { latitude: 16.047079, longitude: 108.206230 },
            'Bình Dương': { latitude: 11.324000, longitude: 106.477000 },
            'Đồng Nai': { latitude: 11.068000, longitude: 107.168000 },
            'Bà Rịa - Vũng Tàu': { latitude: 10.409000, longitude: 107.136000 },
            'Cần Thơ': { latitude: 10.046000, longitude: 105.747000 },
            'Hải Phòng': { latitude: 20.844000, longitude: 106.688000 }
        };
        return coordinates[cityName] || null;
    }
};

// Car type constants
export const CAR_TYPES = {
    STANDARD: 'STANDARD',
    LUXURY: 'LUXURY',
    SUPER_LUXURY: 'SUPER_LUXURY'
};

// Fuel type constants
export const FUEL_TYPES = {
    GASOLINE: 'GASOLINE',
    DIESEL: 'DIESEL',
    ELECTRIC: 'ELECTRIC',
    HYBRID: 'HYBRID'
};

export default {
    CarSearchCriteriaBuilder,
    CommonSearchCriteria,
    LocationUtils,
    CAR_TYPES,
    FUEL_TYPES
};
