// Migration guide and examples for using carType instead of category

import { CarTypeUtils, UrlParamUtils } from '../utils/carTypeUtils';

/**
 * MIGRATION GUIDE: category → carType
 * 
 * OLD WAY (deprecated):
 * /car-listing?category=luxury
 * /car-listing?category=normal
 * 
 * NEW WAY (recommended):
 * /car-listing?carType=LUXURY
 * /car-listing?carType=STANDARD
 * /car-listing?carType=SUPER_LUXURY
 */

// Example 1: Creating navigation links with new carType parameter
export const NavigationExamples = {
    // Standard cars link
    getStandardCarsUrl: () => {
        return UrlParamUtils.buildCarListingUrl('STANDARD');
    },

    // Luxury cars link  
    getLuxuryCarsUrl: () => {
        return UrlParamUtils.buildCarListingUrl('LUXURY');
    },

    // Super luxury cars link
    getSuperLuxuryCarsUrl: () => {
        return UrlParamUtils.buildCarListingUrl('SUPER_LUXURY');
    },

    // Search with location and carType
    getSearchUrl: (location, carType, pickupDate, returnDate) => {
        return UrlParamUtils.buildCarListingUrl(carType, location, pickupDate, '08:00', returnDate, '20:00');
    }
};

// Example 2: Converting old category-based URLs to new carType URLs
export const MigrationExamples = {
    // Convert old category parameter to new carType
    convertOldUrl: (searchParams) => {
        const oldParams = Object.fromEntries(searchParams.entries());
        const migratedParams = UrlParamUtils.migrateOldUrls(oldParams);
        
        const newParams = new URLSearchParams(migratedParams);
        return `/car-listing?${newParams.toString()}`;
    },

    // Handle backward compatibility in components
    getCarTypeFromParams: (searchParams) => {
        // Try carType first, then fallback to category
        const carType = searchParams.get('carType');
        if (carType) return carType;

        const category = searchParams.get('category');
        return CarTypeUtils.convertCategoryToCarType(category);
    }
};

// Example 3: Usage in React components
export const ComponentExamples = {
    // Button component for car type navigation
    CarTypeButton: ({ carType, children, onClick }) => {
        const handleClick = () => {
            const url = UrlParamUtils.buildCarListingUrl(carType);
            if (onClick) {
                onClick(url);
            } else {
                window.location.href = url;
            }
        };

        return (
            <button onClick={handleClick} className="car-type-button">
                {children || CarTypeUtils.getDisplayName(carType)}
            </button>
        );
    },

    // Dropdown component for car type selection
    CarTypeSelect: ({ value, onChange }) => {
        const carTypes = CarTypeUtils.getAllCarTypes();

        return (
            <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
                <option value="">Tất cả loại xe</option>
                {carTypes.map(carType => (
                    <option key={carType} value={carType}>
                        {CarTypeUtils.getDisplayName(carType)}
                    </option>
                ))}
            </select>
        );
    }
};

// Example 4: API integration examples
export const ApiIntegrationExamples = {
    // Search cars by carType
    searchCarsByType: async (carType, page = 0, size = 12) => {
        const { carService } = await import('../services/carService');
        
        const criteria = {
            carType: carType
        };

        try {
            const response = await carService.searchCars(criteria, page, size);
            return response.data;
        } catch (error) {
            console.error('Error searching cars by type:', error);
            throw error;
        }
    },

    // Combined search with multiple criteria
    advancedSearchWithCarType: async (searchParams) => {
        const { carService } = await import('../services/carService');
        
        const criteria = {};
        
        // Add carType if provided
        if (searchParams.carType) {
            criteria.carType = searchParams.carType;
        }
        
        // Add other search criteria
        if (searchParams.location) {
            criteria.location = searchParams.location;
        }
        
        if (searchParams.startDate && searchParams.endDate) {
            criteria.startDate = searchParams.startDate;
            criteria.endDate = searchParams.endDate;
        }

        try {
            const response = await carService.searchCars(criteria, 0, 20);
            return response.data;
        } catch (error) {
            console.error('Error in advanced search:', error);
            throw error;
        }
    }
};

// Example 5: URL routing examples for React Router
export const RoutingExamples = {
    // Route configuration
    routes: [
        {
            path: '/car-listing',
            element: 'CarListing',
            // Handle both old and new parameters
            loader: ({ request }) => {
                const url = new URL(request.url);
                const searchParams = url.searchParams;
                
                // Migrate old category to carType if needed
                const carType = MigrationExamples.getCarTypeFromParams(searchParams);
                
                return {
                    carType,
                    location: searchParams.get('location'),
                    pickupDate: searchParams.get('pickupDate'),
                    returnDate: searchParams.get('returnDate')
                };
            }
        }
    ],

    // Navigation helper
    navigateToCarListing: (navigate, carType, searchOptions = {}) => {
        const url = UrlParamUtils.buildCarListingUrl(
            carType,
            searchOptions.location,
            searchOptions.pickupDate,
            searchOptions.pickupTime,
            searchOptions.returnDate,
            searchOptions.returnTime
        );
        navigate(url);
    }
};

// Example 6: Testing examples
export const TestingExamples = {
    // Test cases for carType conversion
    testConversion: () => {
        console.assert(
            CarTypeUtils.convertCategoryToCarType('luxury') === 'LUXURY',
            'Should convert luxury to LUXURY'
        );
        
        console.assert(
            CarTypeUtils.convertCategoryToCarType('normal') === 'STANDARD',
            'Should convert normal to STANDARD'
        );
        
        console.assert(
            CarTypeUtils.getDisplayName('LUXURY') === 'Xe sang - Xe cao cấp',
            'Should return correct display name'
        );
    },

    // Mock data for testing
    mockSearchParams: (params) => {
        const searchParams = new URLSearchParams(params);
        return {
            get: (key) => searchParams.get(key),
            entries: () => searchParams.entries()
        };
    }
};

export default {
    NavigationExamples,
    MigrationExamples,
    ComponentExamples,
    ApiIntegrationExamples,
    RoutingExamples,
    TestingExamples
};
