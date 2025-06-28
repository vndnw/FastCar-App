
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Button, Select, Spin, message, Checkbox, Slider, Drawer, Space } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CarCard from '../../components/CarCard';
import { carService } from '../../services/carService';
import { carBrandService } from '../../services/carBrandService';
import { LocationUtils, CAR_TYPES } from '../../utils/carSearchUtils';
import { CarTypeUtils } from '../../utils/carTypeUtils';
import './CarListing.css';

const { Option } = Select;

const CarListing = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Support backward compatibility with old "category" parameter
    const rawCarType = searchParams.get('carType') || CarTypeUtils.convertCategoryToCarType(searchParams.get('category'));
    
    // Validate carType
    const carType = useMemo(() => {
        if (!rawCarType) return null;
        
        const validCarTypes = ['LUXURY', 'STANDARD'];
        const normalizedCarType = rawCarType.toUpperCase();
        
        console.log('🚗 Validating carType:', { rawCarType, normalizedCarType, validCarTypes });
        
        if (validCarTypes.includes(normalizedCarType)) {
            return normalizedCarType;
        }
        
        console.warn('Invalid carType received:', rawCarType, 'Using null instead');
        return null;
    }, [rawCarType]);

    // Lấy thông tin tìm kiếm từ URL params
    const location = searchParams.get('location');
    const pickupDate = searchParams.get('pickupDate');
    const pickupTime = searchParams.get('pickupTime');
    const returnDate = searchParams.get('returnDate');
    const returnTime = searchParams.get('returnTime');

    // Kiểm tra xem có phải từ search không (có location hoặc pickupDate)
    const isFromSearch = location || pickupDate;

    // Cập nhật tiêu đề động
    const pageTitle = useMemo(() => {
        return CarTypeUtils.getDisplayName(carType);
    }, [carType]);

    const sortOptions = [
        { value: 'price-asc', label: 'Giá tăng dần' },
        { value: 'price-desc', label: 'Giá giảm dần' },
        { value: 'newest', label: 'Xe mới nhất' },
    ];


    const [filteredCars, setFilteredCars] = useState([]);
    const [activeFilters, setActiveFilters] = useState(['all']);
    const [loading, setLoading] = useState(false);
    const [totalCars, setTotalCars] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    // Additional filter states
    const [selectedBrands, setSelectedBrands] = useState([]); // Array of brand IDs
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [availableBrands, setAvailableBrands] = useState([]); // Array of brand objects {id, name}
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [activeFilterDrawer, setActiveFilterDrawer] = useState(null);

    // Search cars using API
    const searchCarsWithAPI = useCallback(async (searchCriteria = {}, page = 0, reset = true, sort = 'id,desc') => {
        try {
            setLoading(true);
            console.log('API Search with criteria:', searchCriteria, 'page:', page, 'sort:', sort);

            const response = await carService.searchCars(searchCriteria, page, 12, sort);
            console.log('API Response:', response.data.content);
            
            if (response?.data?.content) {
                let newCars = response.data.content;
                const totalElements = response.data.totalElements;
                const totalPages = response.data.totalPages;

                console.log('Cars received:', newCars.length, 'Total:', totalElements);

                if (reset) {
                    setFilteredCars(newCars);
                    setCurrentPage(0);
                } else {
                    setFilteredCars(prev => [...prev, ...newCars]);
                    setCurrentPage(page);
                }

                setTotalCars(totalElements);
                setHasMore(page < totalPages - 1);
            } else {
                console.warn('No data in API response');
                setFilteredCars([]);
                setTotalCars(0);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error searching cars:', error);
            message.error('Không thể tải dữ liệu xe. Vui lòng thử lại sau.');
            setFilteredCars([]);
            setTotalCars(0);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [carType]);

    // Build search criteria from URL params and filters
    const buildSearchCriteria = useCallback(() => {
        const criteria = {};

        // Handle carType - ưu tiên carType từ URL params, sau đó mới đến activeFilters
        console.log('🔧 buildSearchCriteria - inputs:', { carType, activeFilters });
        
        if (carType) {
            // Nếu có carType từ URL params, luôn sử dụng nó
            criteria.carType = carType;
            console.log('🔧 buildSearchCriteria - Using carType from URL params:', carType);
        } else {
            // Nếu không có carType từ URL, xem xét activeFilters
            const luxuryFilters = activeFilters.filter(f => f === 'luxury');
            const standardFilters = activeFilters.filter(f => f === 'standard');
            const isAllFilter = activeFilters.includes('all');
            
            if (isAllFilter) {
                // Khi chọn "Tất cả", không set carType để lấy tất cả loại xe
                console.log('🔧 buildSearchCriteria - ALL filter active, no carType restriction');
            } else if (luxuryFilters.length > 0) {
                // Khi chọn "Xe xịn", set carType = LUXURY để API chỉ trả về xe LUXURY
                criteria.carType = 'LUXURY';
                console.log('🔧 buildSearchCriteria - LUXURY filter active, setting carType=LUXURY');
            } else if (standardFilters.length > 0) {
                // Khi chọn "Xe thường", set carType = STANDARD để API chỉ trả về xe STANDARD
                criteria.carType = 'STANDARD';
                console.log('🔧 buildSearchCriteria - STANDARD filter active, setting carType=STANDARD');
            }
        }

        // Handle advanced filters - chỉ gửi những filter được chọn
        if (selectedBrands.length > 0) {
            // Send brand IDs to the API
            if (selectedBrands.length === 1) {
                criteria.brandId = selectedBrands[0]; // Single brand ID
            } else {
                criteria.brandIds = selectedBrands; // Multiple brand IDs (if API supports)
            }
        }

        if (selectedSeats.length > 0) {
            // Lấy seats nhỏ nhất được chọn làm minSeats
            criteria.minSeats = Math.min(...selectedSeats);
        }

        if (selectedFuelTypes.length > 0) {
            // API chỉ support single fuelType, lấy cái đầu tiên
            criteria.fuelType = selectedFuelTypes[0];
        }

        // Car types - mapping to general carType (có thể cần adjust tùy API)
        // Removed selectedCarTypes filter

        // Location filter từ selectedLocations
        if (selectedLocations.length > 0) {
            // Lấy location đầu tiên được chọn
            criteria.location = selectedLocations[0];
        }

        // Price range filter
        if (priceRange[0] > 0 || priceRange[1] < 5000000) {
            criteria.minPrice = priceRange[0];
            criteria.maxPrice = priceRange[1];
        }

        // Handle location with priority
        if (location) {
            const cityName = LocationUtils.slugToCity(location);
            const coordinates = LocationUtils.getCityCoordinates(cityName);
            
            if (coordinates) {
                criteria.latitude = coordinates.latitude;
                criteria.longitude = coordinates.longitude;
                criteria.radiusInKm = 20; // 20km radius
            } else {
                criteria.location = cityName;
            }
        }

        // Handle date range
        if (pickupDate && returnDate) {
            criteria.startDate = pickupDate;
            criteria.endDate = returnDate;
        }

        return criteria;
    }, [carType, location, pickupDate, returnDate, activeFilters, selectedBrands, selectedSeats, selectedFuelTypes, selectedLocations, priceRange]);

    // Initial load and when search params change
    useEffect(() => {
        // Debug logging
        console.log('CarListing params:', { carType, location, pickupDate, returnDate });
        
        const criteria = buildSearchCriteria();
        console.log('Search criteria:', criteria);
        
        searchCarsWithAPI(criteria, 0, true);
        
        // Set activeFilters based on carType from URL params
        if (carType === 'LUXURY') {
            console.log('🔧 Setting activeFilters to [luxury] based on URL carType=LUXURY');
            setActiveFilters(['luxury']);
        } else if (carType === 'STANDARD') {
            console.log('🔧 Setting activeFilters to [standard] based on URL carType=STANDARD');
            setActiveFilters(['standard']);
        } else if (activeFilters.length === 0 || (activeFilters.length === 1 && activeFilters[0] === 'all')) {
            // Only set to 'all' if no filters are active or only 'all' is active
            console.log('🔧 Setting activeFilters to [all] - no specific carType from URL');
            setActiveFilters(['all']);
        }
        
        // Load available brands for filter
        loadAvailableBrands();
    }, [carType, location, pickupDate, returnDate]);

    // Auto search when activeFilters change (but not on initial load)
    useEffect(() => {
        // Skip if it's the initial load or no filters
        if (activeFilters.length === 0) return;
        
        console.log('🔄 activeFilters changed, triggering search:', activeFilters);
        
        const criteria = buildSearchCriteria();
        console.log('🔄 Search criteria from activeFilters change:', criteria);
        
        searchCarsWithAPI(criteria, 0, true);
    }, [activeFilters]);

    // Load available brands for filter dropdown
    const loadAvailableBrands = useCallback(async () => {
        try {
            const response = await carBrandService.getCarBrands(0, 100); // Get more brands
            if (response?.data?.content) {
                const brands = response.data.content.map(brand => ({
                    id: brand.id,
                    name: brand.name
                })).sort((a, b) => a.name.localeCompare(b.name));
                console.log('Available brands loaded:', brands);
                setAvailableBrands(brands);
            }
        } catch (error) {
            console.error('Error loading brands:', error);
            // Fallback: extract brands from cars
            try {
                const carResponse = await carService.getCars(0, 100);
                if (carResponse?.data?.content) {
                    const uniqueBrands = [...new Set(carResponse.data.content.map(car => car.brand))].filter(Boolean);
                    const brands = uniqueBrands.map((brandName, index) => ({
                        id: `fallback-${index}`, // Fallback ID
                        name: brandName
                    })).sort((a, b) => a.name.localeCompare(b.name));
                    setAvailableBrands(brands);
                }
            } catch (fallbackError) {
                console.error('Error loading brands from cars:', fallbackError);
            }
        }
    }, []);

    // Danh sách các khu vực trong TP.HCM
    const hoChiMinhDistricts = useMemo(() => [
        { label: 'Quận 1', value: 'quan-1' },
        { label: 'Quận 2 (Thủ Đức)', value: 'quan-2' },
        { label: 'Quận 3', value: 'quan-3' },
        { label: 'Quận 4', value: 'quan-4' },
        { label: 'Quận 5', value: 'quan-5' },
        { label: 'Quận 6', value: 'quan-6' },
        { label: 'Quận 7', value: 'quan-7' },
        { label: 'Quận 8', value: 'quan-8' },
        { label: 'Quận 9 (Thủ Đức)', value: 'quan-9' },
        { label: 'Quận 10', value: 'quan-10' },
        { label: 'Quận 11', value: 'quan-11' },
        { label: 'Quận 12', value: 'quan-12' },
        { label: 'Quận Bình Thạnh', value: 'quan-binh-thanh' },
        { label: 'Quận Gò Vấp', value: 'quan-go-vap' },
        { label: 'Quận Phú Nhuận', value: 'quan-phu-nhuan' },
        { label: 'Quận Tân Bình', value: 'quan-tan-binh' },
        { label: 'Quận Tân Phú', value: 'quan-tan-phu' },
        { label: 'Thành phố Thủ Đức', value: 'thanh-pho-thu-duc' },
        { label: 'Huyện Bình Chánh', value: 'huyen-binh-chanh' },
        { label: 'Huyện Cần Giờ', value: 'huyen-can-gio' },
        { label: 'Huyện Củ Chi', value: 'huyen-cu-chi' },
        { label: 'Huyện Hóc Môn', value: 'huyen-hoc-mon' },
        { label: 'Huyện Nhà Bè', value: 'huyen-nha-be' },
    ], []);

    const getFilterOptions = useMemo(() => {
        // Base filters theo hình design
        const baseFilters = [
            { key: 'all', label: 'Tất cả', icon: null, color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },
            { key: 'luxury', label: 'Xe xịn', icon: '⭐', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' },
            { key: 'standard', label: 'Xe thường', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
            { key: 'seats', label: 'Số chỗ', icon: '🪑', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
            { key: 'brand', label: 'Hãng xe', icon: '🏷️', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
            { key: 'fuel', label: 'Nhiên liệu', icon: '⛽', color: '#f5222d', bgColor: '#fff1f0', borderColor: '#f5222d' },
            { key: 'location', label: 'Khu vực xe', icon: '📍', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
        ];

        return baseFilters;
    }, [carType]);


    // Helper function to clear URL params
    const clearURLParams = useCallback(() => {
        const newSearchParams = new URLSearchParams();
        
        // Giữ lại location và date params nếu có
        if (location) newSearchParams.set('location', location);
        if (pickupDate) newSearchParams.set('pickupDate', pickupDate);
        if (pickupTime) newSearchParams.set('pickupTime', pickupTime);
        if (returnDate) newSearchParams.set('returnDate', returnDate);
        if (returnTime) newSearchParams.set('returnTime', returnTime);
        
        // Xóa carType và category params
        // Không set lại carType hoặc category
        
        navigate(`/car-listing?${newSearchParams.toString()}`, { replace: true });
    }, [location, pickupDate, pickupTime, returnDate, returnTime, navigate]);

    // Xử lý click filter - cập nhật logic
    const handleFilterClick = useCallback((filterKey) => {
        console.log('🎯 Filter clicked:', filterKey, 'Current activeFilters:', activeFilters);
        
        // Special handling for advanced filters - show specific drawer
        if (filterKey === 'seats') {
            setActiveFilterDrawer('seats');
            return;
        }
        if (filterKey === 'brand') {
            setActiveFilterDrawer('brand');
            return;
        }
        if (filterKey === 'fuel') {
            setActiveFilterDrawer('fuel');
            return;
        }
        if (filterKey === 'location') {
            setActiveFilterDrawer('location');
            return;
        }

        if (filterKey === 'all') {
            console.log('🎯 Setting filter to ALL - reset state and search');
            setActiveFilters(['all']);
            // Reset advanced filters
            setSelectedBrands([]);
            setSelectedSeats([]);
            setSelectedFuelTypes([]);
            setSelectedLocations([]);
            setPriceRange([0, 5000000]);
            // Clear URL params
            clearURLParams();
            return;
        }

        // Special handling for luxury filter
        if (filterKey === 'luxury') {
            console.log('🎯 Setting filter to LUXURY');
            setActiveFilters(['luxury']);
            // Reset advanced filters
            setSelectedBrands([]);
            setSelectedSeats([]);
            setSelectedFuelTypes([]);
            setSelectedLocations([]);
            setPriceRange([0, 5000000]);
            // Clear URL params
            clearURLParams();
            return;
        }

        // Special handling for standard filter
        if (filterKey === 'standard') {
            console.log('🎯 Setting filter to STANDARD');
            setActiveFilters(['standard']);
            // Reset advanced filters
            setSelectedBrands([]);
            setSelectedSeats([]);
            setSelectedFuelTypes([]);
            setSelectedLocations([]);
            setPriceRange([0, 5000000]);
            // Clear URL params
            clearURLParams();
            return;
        }

        // For other filters, we don't support them as main filters anymore
        // They should only be handled through drawers
        console.log('🎯 Unsupported main filter:', filterKey);
    }, [activeFilters, clearURLParams]);

    // Handle advanced filter changes
    const handleAdvancedFilterChange = useCallback((filterType) => {
        const criteria = buildSearchCriteria();
        searchCarsWithAPI(criteria, 0, true);
        setActiveFilterDrawer(null);
    }, [buildSearchCriteria, searchCarsWithAPI]);

    // Close filter drawer
    const closeFilterDrawer = useCallback(() => {
        setActiveFilterDrawer(null);
    }, []);

    // Reset advanced filters
    const handleResetAdvancedFilters = useCallback((filterType = null) => {
        if (!filterType) {
            // Reset all filters
            setSelectedBrands([]);
            setSelectedSeats([]);
            setSelectedFuelTypes([]);
            setSelectedLocations([]);
            setPriceRange([0, 5000000]);
            setActiveFilters(['all']);
            
            // Clear URL params
            clearURLParams();
            
            // Search tất cả xe mà không bị giới hạn bởi carType
            const criteria = {};
            
            // Chỉ giữ lại location và date filters, bỏ carType
            if (location) {
                const cityName = LocationUtils.slugToCity(location);
                const coordinates = LocationUtils.getCityCoordinates(cityName);
                
                if (coordinates) {
                    criteria.latitude = coordinates.latitude;
                    criteria.longitude = coordinates.longitude;
                    criteria.radiusInKm = 20; // 20km radius
                } else {
                    criteria.location = cityName;
                }
            }

            // Handle date range
            if (pickupDate && returnDate) {
                criteria.startDate = pickupDate;
                criteria.endDate = returnDate;
            }
            
            searchCarsWithAPI(criteria, 0, true);
        } else {
            // Reset specific filter
            switch (filterType) {
                case 'brand':
                    setSelectedBrands([]);
                    break;
                case 'seats':
                    setSelectedSeats([]);
                    break;
                case 'fuel':
                    setSelectedFuelTypes([]);
                    break;
                case 'location':
                    setSelectedLocations([]);
                    break;
            }
            
            const criteria = buildSearchCriteria();
            searchCarsWithAPI(criteria, 0, true);
        }
    }, [carType, location, pickupDate, returnDate, selectedBrands, selectedSeats, selectedFuelTypes, selectedLocations, priceRange, buildSearchCriteria, searchCarsWithAPI, clearURLParams]);

    // Format price for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Count active advanced filters
    const activeAdvancedFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedBrands.length > 0) count++;
        if (selectedSeats.length > 0) count++;
        if (selectedFuelTypes.length > 0) count++;
        if (selectedLocations.length > 0) count++;
        if (priceRange[0] > 0 || priceRange[1] < 5000000) count++;
        return count;
    }, [selectedBrands, selectedSeats, selectedFuelTypes, selectedLocations, priceRange]);

    // Format active filters summary
    const getActiveFiltersSummary = useMemo(() => {
        const summary = [];
        if (selectedBrands.length > 0) {
            summary.push(`${selectedBrands.length} hãng xe`);
        }
        if (selectedSeats.length > 0) {
            summary.push(`${selectedSeats.length} loại chỗ ngồi`);
        }
        if (selectedFuelTypes.length > 0) {
            summary.push(`${selectedFuelTypes.length} nhiên liệu`);
        }
        if (selectedLocations.length > 0) {
            summary.push(`${selectedLocations.length} khu vực`);
        }
        if (priceRange[0] > 0 || priceRange[1] < 5000000) {
            summary.push('khoảng giá');
        }
        return summary.join(', ');
    }, [selectedBrands, selectedSeats, selectedFuelTypes, selectedLocations, priceRange]);

    // Xử lý sắp xếp
    // const handleSortChange = useCallback((value) => {
    //     // Use API search with sorting
    //     const criteria = buildSearchCriteria();
    //     let sort = 'id,desc';

    //     switch (value) {
    //         case 'price-asc':
    //             sort = 'pricePer24Hour,asc';
    //             break;
    //         case 'price-desc':
    //             sort = 'pricePer24Hour,desc';
    //             break;
    //         case 'newest':
    //             sort = 'year,desc';
    //             break;
    //         case 'price-asc':
    //         default:
    //             sort = 'pricePer24Hour,asc';
    //             break;
    //     }

    //     // Re-search with new sorting
    //     searchCarsWithAPI(criteria, 0, true, sort);
    // }, [buildSearchCriteria, searchCarsWithAPI]);

    // Load more cars
    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            const criteria = buildSearchCriteria();
            searchCarsWithAPI(criteria, currentPage + 1, false);
        }
    }, [loading, hasMore, currentPage, buildSearchCriteria, searchCarsWithAPI]);

    // Handle search button click
    const handleSearchClick = useCallback(() => {
        const criteria = buildSearchCriteria();
        searchCarsWithAPI(criteria, 0, true);
    }, [buildSearchCriteria, searchCarsWithAPI]);

    // Hàm format thông tin tìm kiếm để hiển thị
    const formatSearchInfo = useMemo(() => {
        const locationMap = {
            'ho-chi-minh': 'Hồ Chí Minh',
            'ha-noi': 'Hà Nội',
            'da-nang': 'Đà Nẵng',
            'binh-duong': 'Bình Dương'
        };

        const locationDisplay = locationMap[location] || 'Chọn địa điểm tìm xe';

        let dateTimeDisplay = '';
        if (pickupDate && pickupTime && returnDate && returnTime) {
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('vi-VN');
            };

            dateTimeDisplay = `${pickupTime}, ${formatDate(pickupDate)} đến ${returnTime}, ${formatDate(returnDate)}`;
        } else {
            // Sử dụng ngày hiện tại thay vì hard-code
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            dateTimeDisplay = `08h00, ${today.toLocaleDateString('vi-VN')} đến 20h00, ${tomorrow.toLocaleDateString('vi-VN')}`;
        }

        return { locationDisplay, dateTimeDisplay };
    }, [location, pickupDate, pickupTime, returnDate, returnTime]);

    const { locationDisplay, dateTimeDisplay } = formatSearchInfo;

    return (
        <div className="car-listing-page">
            {/* Search Section */}
            <div className="search-section-dark">
                <div className="search-container">
                    <Row gutter={16} align="middle">
                        <Col flex="200px">
                            <h2 className="search-title">Tìm xe tự lái</h2>
                        </Col>
                        <Col flex="auto">
                            <div className="search-input-white">
                                <EnvironmentOutlined style={{ color: '#51c09f', marginRight: 8 }} />
                                <span>{locationDisplay}</span>
                            </div>
                        </Col>
                        <Col flex="auto">
                            <div className="search-input-white">
                                <CalendarOutlined style={{ color: '#51c09f', marginRight: 8 }} />
                                <span>{dateTimeDisplay}</span>
                            </div>
                        </Col>
                        <Col flex="200px">
                            <Button 
                                type="primary" 
                                size="large" 
                                className="search-button"
                                onClick={handleSearchClick}
                                loading={loading}
                            >
                                TÌM XE
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Filter Section */}
            <div className="filter-section-new">
                <div className="filter-container">
                    <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 0 }}>
                        {/* Filter Tags */}
                        {getFilterOptions.map(filter => (
                            <Col key={filter.key}>
                                <div
                                    className={`filter-tag-modern ${activeFilters.includes(filter.key) ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(filter.key)}
                                    style={{
                                        borderColor: activeFilters.includes(filter.key) ? filter.color : '#d9d9d9',
                                        color: activeFilters.includes(filter.key) ? '#fff' : '#666',
                                        backgroundColor: activeFilters.includes(filter.key) ? filter.color : '#fff',
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        border: '1px solid',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        minHeight: '36px',
                                        boxShadow: activeFilters.includes(filter.key) ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                        transform: activeFilters.includes(filter.key) ? 'translateY(-1px)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!activeFilters.includes(filter.key)) {
                                            e.target.style.borderColor = filter.color;
                                            e.target.style.color = filter.color;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!activeFilters.includes(filter.key)) {
                                            e.target.style.borderColor = '#d9d9d9';
                                            e.target.style.color = '#666';
                                        }
                                    }}
                                >
                                    {filter.icon && <span className="filter-icon" style={{ fontSize: '16px' }}>{filter.icon}</span>}
                                    <span>{filter.label}</span>
                                    {(selectedBrands.length > 0 && filter.key === 'brand') && 
                                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '2px 6px' }}>
                                            {selectedBrands.length}
                                        </span>
                                    }
                                    {(selectedSeats.length > 0 && filter.key === 'seats') && 
                                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '2px 6px' }}>
                                            {selectedSeats.length}
                                        </span>
                                    }
                                    {(selectedFuelTypes.length > 0 && filter.key === 'fuel') && 
                                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '2px 6px' }}>
                                            {selectedFuelTypes.length}
                                        </span>
                                    }
                                    {(selectedLocations.length > 0 && filter.key === 'location') && 
                                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '2px 6px' }}>
                                            {selectedLocations.length}
                                        </span>
                                    }
                                </div>
                            </Col>
                        ))}

                        <Col flex="auto" />

                        {/* Advanced Filters Button */}
                        <Col>
                            <div
                                style={{
                                    borderRadius: '20px',
                                    border: `1px solid ${activeAdvancedFiltersCount > 0 ? '#52c41a' : '#d9d9d9'}`,
                                    padding: '8px 16px',
                                    backgroundColor: activeAdvancedFiltersCount > 0 ? '#52c41a' : '#fff',
                                    color: activeAdvancedFiltersCount > 0 ? '#fff' : '#666',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    minWidth: '140px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeAdvancedFiltersCount > 0 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                                }}
                                onClick={() => setShowAdvancedFilters(true)}
                                onMouseEnter={(e) => {
                                    if (activeAdvancedFiltersCount === 0) {
                                        e.target.style.borderColor = '#52c41a';
                                        e.target.style.color = '#52c41a';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeAdvancedFiltersCount === 0) {
                                        e.target.style.borderColor = '#d9d9d9';
                                        e.target.style.color = '#666';
                                    }
                                }}
                            >
                                <FilterOutlined />
                                <span>Bộ lọc nâng cao</span>
                                {activeAdvancedFiltersCount > 0 && (
                                    <span style={{
                                        fontSize: '12px',
                                        background: 'rgba(255,255,255,0.3)',
                                        borderRadius: '10px',
                                        padding: '2px 6px',
                                        minWidth: '18px',
                                        textAlign: 'center'
                                    }}>
                                        {activeAdvancedFiltersCount}
                                    </span>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="cars-grid-section">
                <div className="cars-container">
                    {/* Active Filters Summary */}
                    {(activeAdvancedFiltersCount > 0 || activeFilters.some(f => f !== 'all')) && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '12px 16px',
                            background: '#f6ffed',
                            border: '1px solid #b7eb8f',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#52c41a', fontWeight: '500' }}>
                                Đang lọc:
                            </span>
                            {activeFilters.filter(f => f !== 'all').map(filter => (
                                <span key={filter} style={{
                                    background: '#52c41a',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {getFilterOptions.find(f => f.key === filter)?.label}
                                </span>
                            ))}
                            {getActiveFiltersSummary && (
                                <span style={{
                                    background: '#1890ff',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {getActiveFiltersSummary}
                                </span>
                            )}
                            <Button
                                type="text"
                                size="small"
                                icon={<ClearOutlined />}
                                onClick={() => {
                                    console.log('🔄 Reset all filters - reset state and search');
                                    // Reset tất cả filters và search tất cả xe
                                    setActiveFilters(['all']);
                                    setSelectedBrands([]);
                                    setSelectedSeats([]);
                                    setSelectedFuelTypes([]);
                                    setSelectedLocations([]);
                                    setPriceRange([0, 5000000]);
                                    
                                    // Clear URL params
                                    clearURLParams();
                                    
                                    // Search tất cả xe mà không bị giới hạn bởi carType
                                    const criteria = {};
                                    
                                    // Chỉ giữ lại location và date filters, bỏ carType
                                    if (location) {
                                        const cityName = LocationUtils.slugToCity(location);
                                        const coordinates = LocationUtils.getCityCoordinates(cityName);
                                        
                                        if (coordinates) {
                                            criteria.latitude = coordinates.latitude;
                                            criteria.longitude = coordinates.longitude;
                                            criteria.radiusInKm = 20; // 20km radius
                                        } else {
                                            criteria.location = cityName;
                                        }
                                    }

                                    // Handle date range
                                    if (pickupDate && returnDate) {
                                        criteria.startDate = pickupDate;
                                        criteria.endDate = returnDate;
                                    }
                                    
                                    searchCarsWithAPI(criteria, 0, true);
                                }}
                                style={{ marginLeft: 'auto', color: '#666' }}
                            >
                                Xóa tất cả
                            </Button>
                        </div>
                    )}

                    {/* Hiển thị thông tin tìm kiếm nếu có */}
                    {isFromSearch && (
                        <div className="search-info-display">
                            <p className="search-info-title">
                                Kết quả tìm kiếm cho: <strong>{locationDisplay}</strong>
                                {pickupDate && (
                                    <span className="search-info-details">
                                        <br />Thời gian: <strong>{dateTimeDisplay}</strong>
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Results count */}
                    {filteredCars.length > 0 && (
                        <div style={{
                            marginBottom: '24px',
                            padding: '16px',
                            background: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                                    Tìm thấy {totalCars.toLocaleString()} xe
                                </span>
                                <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                                    (Hiển thị {filteredCars.length} xe)
                                </span>
                            </div>
                            {hasMore && (
                                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                                    Còn {(totalCars - filteredCars.length).toLocaleString()} xe khác
                                </span>
                            )}
                        </div>
                    )}

                    {loading && filteredCars.length === 0 ? (
                        <div className="cars-loading-container">
                            <Spin size="large" />
                            <p className="cars-loading-text">Đang tìm kiếm xe...</p>
                        </div>
                    ) : (
                        <>
                            <Row gutter={[16, 24]}>
                                {filteredCars.map(car => (
                                    <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
                                        <CarCard car={car} />
                                    </Col>
                                ))}
                            </Row>

                            {/* Loading more indicator */}
                            {loading && filteredCars.length > 0 && (
                                <div style={{ textAlign: 'center', marginTop: 20 }}>
                                    <Spin />
                                    <p className="cars-loading-text">Đang tải thêm xe...</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Show more button */}
                    {hasMore && filteredCars.length >= 8 && (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <Button 
                                className="load-more-button"
                                size="large" 
                                style={{ padding: '0 40px' }}
                                onClick={handleLoadMore}
                                loading={loading}
                            >
                                Xem thêm xe
                            </Button>
                        </div>
                    )}

                    {/* Empty state */}
                    {filteredCars.length === 0 && !loading && (
                        <div className="empty-state-container">
                            <div className="empty-state-icon">🚗</div>
                            <div className="empty-state-title">
                                Không tìm thấy xe phù hợp
                            </div>
                            <div className="empty-state-description">
                                Không có xe nào khớp với bộ lọc đã chọn.<br />
                                Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc xem tất cả xe.
                            </div>
                            <Button
                                type="primary"
                                onClick={() => {
                                    console.log('🔄 Show all cars - reset state and search');
                                    // Reset tất cả filters và search tất cả xe
                                    setActiveFilters(['all']);
                                    setSelectedBrands([]);
                                    setSelectedSeats([]);
                                    setSelectedFuelTypes([]);
                                    setSelectedLocations([]);
                                    setPriceRange([0, 5000000]);
                                    
                                    // Clear URL params
                                    clearURLParams();
                                    
                                    // Search tất cả xe mà không bị giới hạn bởi carType
                                    const criteria = {};
                                    
                                    // Chỉ giữ lại location và date filters, bỏ carType
                                    if (location) {
                                        const cityName = LocationUtils.slugToCity(location);
                                        const coordinates = LocationUtils.getCityCoordinates(cityName);
                                        
                                        if (coordinates) {
                                            criteria.latitude = coordinates.latitude;
                                            criteria.longitude = coordinates.longitude;
                                            criteria.radiusInKm = 20; // 20km radius
                                        } else {
                                            criteria.location = cityName;
                                        }
                                    }

                                    // Handle date range
                                    if (pickupDate && returnDate) {
                                        criteria.startDate = pickupDate;
                                        criteria.endDate = returnDate;
                                    }
                                    
                                    searchCarsWithAPI(criteria, 0, true);
                                }}
                                className="search-button"
                            >
                                Xem tất cả xe
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Individual Filter Drawers */}
            
            {/* Brand Filter Drawer */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🏷️</span>
                        <span>Chọn hãng xe</span>
                    </div>
                }
                placement="right"
                onClose={closeFilterDrawer}
                open={activeFilterDrawer === 'brand'}
                width={350}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button 
                                icon={<ClearOutlined />} 
                                onClick={() => handleResetAdvancedFilters('brand')}
                                type="text"
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button onClick={closeFilterDrawer}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => handleAdvancedFilterChange('brand')}
                                loading={loading}
                            >
                                Áp dụng ({selectedBrands.length > 0 ? `${selectedBrands.length} hãng` : 'tất cả'})
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ padding: '20px 0' }}>
                    <Checkbox.Group
                        options={availableBrands.map(brand => ({ label: brand.name, value: brand.id }))}
                        value={selectedBrands}
                        onChange={setSelectedBrands}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    />
                </div>
            </Drawer>

            {/* Seats Filter Drawer */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🪑</span>
                        <span>Chọn số chỗ ngồi</span>
                    </div>
                }
                placement="right"
                onClose={closeFilterDrawer}
                open={activeFilterDrawer === 'seats'}
                width={350}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button 
                                icon={<ClearOutlined />} 
                                onClick={() => handleResetAdvancedFilters('seats')}
                                type="text"
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button onClick={closeFilterDrawer}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => handleAdvancedFilterChange('seats')}
                                loading={loading}
                            >
                                Áp dụng ({selectedSeats.length > 0 ? `${selectedSeats.length} loại` : 'tất cả'})
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ padding: '20px 0' }}>
                    <Checkbox.Group
                        options={[
                            { label: '2 chỗ', value: 2 },
                            { label: '4 chỗ', value: 4 },
                            { label: '5 chỗ', value: 5 },
                            { label: '7 chỗ', value: 7 },
                            { label: '8+ chỗ', value: 8 }
                        ]}
                        value={selectedSeats}
                        onChange={setSelectedSeats}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    />
                </div>
            </Drawer>

            {/* Fuel Type Filter Drawer */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>⛽</span>
                        <span>Chọn loại nhiên liệu</span>
                    </div>
                }
                placement="right"
                onClose={closeFilterDrawer}
                open={activeFilterDrawer === 'fuel'}
                width={350}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button 
                                icon={<ClearOutlined />} 
                                onClick={() => handleResetAdvancedFilters('fuel')}
                                type="text"
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button onClick={closeFilterDrawer}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => handleAdvancedFilterChange('fuel')}
                                loading={loading}
                            >
                                Áp dụng ({selectedFuelTypes.length > 0 ? `${selectedFuelTypes.length} loại` : 'tất cả'})
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ padding: '20px 0' }}>
                    <Checkbox.Group
                        options={[
                            { label: 'Xăng', value: 'GASOLINE' },
                            { label: 'Dầu Diesel', value: 'DIESEL' },
                            { label: 'Điện', value: 'ELECTRIC' },
                            { label: 'Hybrid', value: 'HYBRID' }
                        ]}
                        value={selectedFuelTypes}
                        onChange={setSelectedFuelTypes}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    />
                </div>
            </Drawer>

            {/* Location Filter Drawer */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📍</span>
                        <span>Chọn khu vực TP.HCM</span>
                    </div>
                }
                placement="right"
                onClose={closeFilterDrawer}
                open={activeFilterDrawer === 'location'}
                width={350}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button 
                                icon={<ClearOutlined />} 
                                onClick={() => handleResetAdvancedFilters('location')}
                                type="text"
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button onClick={closeFilterDrawer}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => handleAdvancedFilterChange('location')}
                                loading={loading}
                            >
                                Áp dụng ({selectedLocations.length > 0 ? `${selectedLocations.length} khu vực` : 'tất cả'})
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ padding: '20px 0' }}>
                    <div style={{ marginBottom: '15px', padding: '10px', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #d6e4ff' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#1890ff' }}>
                            🗺️ <strong>Chọn khu vực bạn muốn tìm xe tại TP.HCM</strong>
                        </p>
                    </div>
                    <Checkbox.Group
                        options={hoChiMinhDistricts}
                        value={selectedLocations}
                        onChange={setSelectedLocations}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    />
                </div>
            </Drawer>

            {/* Advanced Filters Drawer (for price range and combined filters) */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FilterOutlined />
                        <span>Bộ lọc nâng cao</span>
                    </div>
                }
                placement="right"
                onClose={() => setShowAdvancedFilters(false)}
                open={showAdvancedFilters}
                width={400}
                extra={
                    <Space>
                        <Button 
                            icon={<ClearOutlined />} 
                            onClick={() => handleResetAdvancedFilters()}
                            type="text"
                        >
                            Xóa bộ lọc
                        </Button>
                    </Space>
                }
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setShowAdvancedFilters(false)}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => handleAdvancedFilterChange('all')}
                                loading={loading}
                            >
                                Áp dụng ({filteredCars.length} xe)
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ padding: '20px 0' }}>
                    {/* Price Range Filter */}
                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>
                            💰 Khoảng giá (24h)
                        </h4>
                        <Slider
                            range
                            min={0}
                            max={5000000}
                            step={100000}
                            value={priceRange}
                            onChange={setPriceRange}
                            tooltip={{
                                formatter: (value) => formatPrice(value)
                            }}
                            style={{ marginBottom: '10px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                        </div>
                    </div>

                    {/* Quick access to other filters */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>
                            🔧 Bộ lọc khác
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Button 
                                block 
                                onClick={() => {
                                    setShowAdvancedFilters(false);
                                    setActiveFilterDrawer('brand');
                                }}
                                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                🏷️ Hãng xe {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                            </Button>
                            <Button 
                                block 
                                onClick={() => {
                                    setShowAdvancedFilters(false);
                                    setActiveFilterDrawer('seats');
                                }}
                                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                🪑 Số chỗ ngồi {selectedSeats.length > 0 && `(${selectedSeats.length})`}
                            </Button>
                            <Button 
                                block 
                                onClick={() => {
                                    setShowAdvancedFilters(false);
                                    setActiveFilterDrawer('fuel');
                                }}
                                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                ⛽ Nhiên liệu {selectedFuelTypes.length > 0 && `(${selectedFuelTypes.length})`}
                            </Button>
                            <Button 
                                block 
                                onClick={() => {
                                    setShowAdvancedFilters(false);
                                    setActiveFilterDrawer('location');
                                }}
                                style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                📍 Khu vực TP.HCM {selectedLocations.length > 0 && `(${selectedLocations.length})`}
                            </Button>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default CarListing;