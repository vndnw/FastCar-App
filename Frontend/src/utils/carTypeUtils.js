// Car type utilities and mappings
export const CarTypeUtils = {
    // Mapping from old category values to new carType values
    categoryToCarType: {
        'luxury': 'LUXURY',
        'normal': 'STANDARD',
        'standard': 'STANDARD',
        'super_luxury': 'SUPER_LUXURY',
        'super-luxury': 'SUPER_LUXURY'
    },

    // Mapping from carType values to display names
    carTypeToDisplayName: {
        'LUXURY': 'Xe sang - Xe cao cấp',
        'STANDARD': 'Xe thường',
        'SUPER_LUXURY': 'Xe siêu sang'
    },

    // Mapping from carType values to URL-friendly values
    carTypeToUrlParam: {
        'LUXURY': 'LUXURY',
        'STANDARD': 'STANDARD', 
        'SUPER_LUXURY': 'SUPER_LUXURY'
    },

    // Convert old category parameter to new carType
    convertCategoryToCarType: (category) => {
        if (!category) return null;
        return CarTypeUtils.categoryToCarType[category.toLowerCase()] || category.toUpperCase();
    },

    // Get display name for carType
    getDisplayName: (carType) => {
        if (!carType) return 'Tất cả xe cho thuê';
        return CarTypeUtils.carTypeToDisplayName[carType] || carType;
    },

    // Get URL parameter for carType
    getUrlParam: (carType) => {
        if (!carType) return null;
        return CarTypeUtils.carTypeToUrlParam[carType] || carType;
    },

    // Check if carType is valid
    isValidCarType: (carType) => {
        const validTypes = ['LUXURY', 'STANDARD', 'SUPER_LUXURY'];
        return validTypes.includes(carType);
    },

    // Get all valid car types
    getAllCarTypes: () => {
        return ['LUXURY', 'STANDARD', 'SUPER_LUXURY'];
    },

    // Get filter options based on carType
    getFilterOptionsByCarType: (carType, isFromSearch = false) => {
        const baseFilter = { key: 'all', label: 'Tất cả', icon: null, color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' };

        // Nếu từ thanh tìm kiếm
        if (isFromSearch) {
            return [
                baseFilter,
                { key: 'normal', label: 'Xe thường', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
                { key: 'luxury', label: 'Xe sang', icon: '⭐', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' },
                { key: 'super_luxury', label: 'Siêu xe', icon: '🏎️', color: '#ff4d4f', bgColor: '#fff1f0', borderColor: '#ff4d4f' }
            ];
        }

        // Nếu từ trang chủ → Xe thường
        if (carType === 'STANDARD') {
            return [
                baseFilter,
                { key: 'toyota', label: 'Toyota', icon: '🚗', color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'hyundai', label: 'Hyundai', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'honda', label: 'Honda', icon: '🚗', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
                { key: 'suzuki', label: 'Suzuki', icon: '🚗', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
                { key: 'kia', label: 'Kia', icon: '🚗', color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'mazda', label: 'Mazda', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
            ];
        }

        // Nếu từ trang chủ → Xe sang
        if (carType === 'LUXURY') {
            return [
                baseFilter,
                { key: 'mercedes', label: 'Mercedes', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
                { key: 'bmw', label: 'BMW', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
                { key: 'audi', label: 'Audi', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'lexus', label: 'Lexus', icon: '🚗', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
            ];
        }

        // Xe siêu sang
        if (carType === 'SUPER_LUXURY') {
            return [
                baseFilter,
                { key: 'ferrari', label: 'Ferrari', icon: '🏎️', color: '#ff4d4f', bgColor: '#fff1f0', borderColor: '#ff4d4f' },
                { key: 'lamborghini', label: 'Lamborghini', icon: '🏎️', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' },
                { key: 'porsche', label: 'Porsche', icon: '🏎️', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'bentley', label: 'Bentley', icon: '🏎️', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
            ];
        }

        // Trường hợp mặc định
        return [baseFilter];
    }
};

// URL parameter utilities
export const UrlParamUtils = {
    // Build URL with carType parameter
    buildCarListingUrl: (carType, location, pickupDate, pickupTime, returnDate, returnTime) => {
        const params = new URLSearchParams();
        
        if (carType) {
            params.append('carType', carType);
        }
        if (location) {
            params.append('location', location);
        }
        if (pickupDate) {
            params.append('pickupDate', pickupDate);
        }
        if (pickupTime) {
            params.append('pickupTime', pickupTime);
        }
        if (returnDate) {
            params.append('returnDate', returnDate);
        }
        if (returnTime) {
            params.append('returnTime', returnTime);
        }

        return `/car-listing?${params.toString()}`;
    },

    // Parse URL parameters for car listing
    parseCarListingParams: (searchParams) => {
        return {
            carType: searchParams.get('carType'),
            location: searchParams.get('location'),
            pickupDate: searchParams.get('pickupDate'),
            pickupTime: searchParams.get('pickupTime'),
            returnDate: searchParams.get('returnDate'),
            returnTime: searchParams.get('returnTime')
        };
    },

    // Convert old category URLs to new carType URLs
    migrateOldUrls: (oldParams) => {
        const newParams = { ...oldParams };
        
        // Convert category to carType
        if (oldParams.category && !oldParams.carType) {
            newParams.carType = CarTypeUtils.convertCategoryToCarType(oldParams.category);
            delete newParams.category;
        }

        return newParams;
    }
};

export default {
    CarTypeUtils,
    UrlParamUtils
};
