// import React, { useState, useEffect } from 'react';
// import { Row, Col, Button, Select, Tag } from 'antd';
// import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
// import { useSearchParams } from 'react-router-dom';
// import CarCard from '../../components/CarCard';
// import { sampleCars, luxuryCars } from '../../data/sampleCars';
// import './CarListing.css';

// const { Option } = Select;

// const CarListing = () => {
//     const [searchParams] = useSearchParams();
//     const category = searchParams.get('category');

//     // Dữ liệu và tiêu đề động theo category
//     const baseData = category === 'luxury' ? luxuryCars : sampleCars;
//     const pageTitle = category === 'luxury' ? 'Xe sang - Xe cao cấp' : 'Xe tương tự';

//     const [filteredCars, setFilteredCars] = useState(baseData);
//     const [activeFilters, setActiveFilters] = useState(['all']);

//     // Reset data khi thay đổi category
//     useEffect(() => {
//         setFilteredCars(baseData);
//         setActiveFilters(['all']);
//     }, [category]);

//     // Cấu hình filter options
//     const getFilterOptions = () => {
//         const commonFilters = [
//             { key: 'all', label: 'Tất cả', icon: null, color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },

//         ];

//         const luxuryBrands = [
//             { key: 'mercedes', label: 'Mercedes', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
//             { key: 'bmw', label: 'BMW', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
//             { key: 'audi', label: 'Audi', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
//             { key: 'lexus', label: 'Lexus', icon: '🚗', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
//         ];

//         const regularBrands = [
//             { key: 'toyota', label: 'Toyota', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
//             { key: 'honda', label: 'Honda', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
//             { key: 'hyundai', label: 'Hyundai', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
//             { key: 'mazda', label: 'Mazda', icon: '🚗', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
//             { key: 'suzuki', label: 'Suzuki', icon: '🚗', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
//             { key: 'kia', label: 'Kia', icon: '🚗', color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },
//         ];

//         return [...commonFilters, ...(category === 'luxury' ? luxuryBrands : regularBrands)];
//     };

//     const sortOptions = [
//         { value: 'popular', label: 'Phổ biến nhất' },
//         { value: 'price-asc', label: 'Giá thấp đến cao' },
//         { value: 'price-desc', label: 'Giá cao đến thấp' },
//         { value: 'newest', label: 'Xe mới nhất' },
//     ];

//     // Xử lý click filter
//     const handleFilterClick = (filterKey) => {
//         if (filterKey === 'all') {
//             setActiveFilters(['all']);
//             setFilteredCars(baseData);
//             return;
//         }

//         let newFilters;
//         if (activeFilters.includes(filterKey)) {
//             newFilters = activeFilters.filter(f => f !== filterKey && f !== 'all');
//         } else {
//             newFilters = [...activeFilters.filter(f => f !== 'all'), filterKey];
//         }

//         if (newFilters.length === 0) {
//             setActiveFilters(['all']);
//             setFilteredCars(baseData);
//             return;
//         }

//         setActiveFilters(newFilters);

//         // Logic lọc xe
//         const filtered = baseData.filter(car => {
//             return newFilters.some(filter => {
//                 if (filter === 'luxury') return car.isLuxury === true;

//                 const brandFilters = ['mercedes', 'bmw', 'audi', 'lexus', 'toyota', 'honda', 'hyundai', 'mazda', 'suzuki', 'kia'];
//                 if (brandFilters.includes(filter)) {
//                     return car.name.toLowerCase().includes(filter);
//                 }

//                 return false;
//             });
//         });

//         setFilteredCars(filtered);
//     };

//     // Xử lý sắp xếp
//     const handleSortChange = (value) => {
//         let sorted = [...filteredCars];

//         switch (value) {
//             case 'price-asc':
//                 sorted.sort((a, b) => a.currentPrice - b.currentPrice);
//                 break;
//             case 'price-desc':
//                 sorted.sort((a, b) => b.currentPrice - a.currentPrice);
//                 break;
//             case 'newest':
//                 sorted.sort((a, b) => b.year - a.year);
//                 break;
//             default:
//                 break;
//         }

//         setFilteredCars(sorted);
//     };

//     const filterOptions = getFilterOptions();

//     return (
//         <div className="car-listing-page">
//             {/* Search Section */}
//             <div className="search-section-dark">
//                 <div className="search-container">
//                     <Row gutter={16} align="middle">
//                         <Col flex="200px">
//                             <h2 className="search-title">Tìm xe tự lái</h2>
//                         </Col>
//                         <Col flex="auto">
//                             <div className="search-input-white">
//                                 <EnvironmentOutlined style={{ color: '#52c41a', marginRight: 8 }} />
//                                 <span>Chọn địa điểm tìm xe</span>
//                             </div>
//                         </Col>
//                         <Col flex="auto">
//                             <div className="search-input-white">
//                                 <CalendarOutlined style={{ color: '#52c41a', marginRight: 8 }} />
//                                 <span>00h00, 23/05/2025 đến 04h00, 25/05/2025</span>
//                             </div>
//                         </Col>
//                         <Col flex="200px">
//                             <Button type="primary" size="large" className="search-button">
//                                 TÌM XE
//                             </Button>
//                         </Col>
//                     </Row>
//                 </div>
//             </div>

//             {/* Filter Section */}
//             <div className="filter-section-new">
//                 <div className="filter-container">
//                     <Row gutter={[12, 12]} align="middle" style={{ marginBottom: 0 }}>
//                         {/* Filter Tags */}
//                         {filterOptions.map(filter => (
//                             <Col key={filter.key}>
//                                 <div
//                                     className={`filter-tag-outlined ${activeFilters.includes(filter.key) ? 'active' : ''}`}
//                                     onClick={() => handleFilterClick(filter.key)}
//                                     style={{
//                                         borderColor: activeFilters.includes(filter.key) ? filter.borderColor : '#d9d9d9',
//                                         color: activeFilters.includes(filter.key) ? filter.color : '#666',
//                                         backgroundColor: activeFilters.includes(filter.key) ? filter.bgColor : '#fafafa'
//                                     }}
//                                 >
//                                     {filter.icon && <span className="filter-icon">{filter.icon}</span>}
//                                     {filter.label}
//                                 </div>
//                             </Col>
//                         ))}

//                         <Col flex="auto" />

//                         {/* Sort Dropdown */}
//                         <Col>
//                             <Select
//                                 defaultValue="popular"
//                                 style={{ width: 200 }}
//                                 onChange={handleSortChange}
//                                 placeholder="Sắp xếp"
//                                 className="sort-select"
//                             >
//                                 {sortOptions.map(option => (
//                                     <Option key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Col>
//                     </Row>
//                 </div>
//             </div>

//             {/* Cars Grid */}
//             <div className="cars-grid-section">
//                 <div className="cars-container">
//                     <h2 className="section-title">{pageTitle}</h2>

//                     <p style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
//                         Tìm thấy {filteredCars.length} xe phù hợp
//                     </p>

//                     <Row gutter={[16, 24]}>
//                         {filteredCars.map(car => (
//                             <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
//                                 <CarCard car={car} />
//                             </Col>
//                         ))}
//                     </Row>

//                     {/* Show more button */}
//                     {filteredCars.length >= 8 && (
//                         <div style={{ textAlign: 'center', marginTop: 40 }}>
//                             <Button size="large" style={{ padding: '0 40px' }}>
//                                 Xem thêm xe
//                             </Button>
//                         </div>
//                     )}

//                     {/* Empty state */}
//                     {filteredCars.length === 0 && (
//                         <div style={{ textAlign: 'center', marginTop: 40 }}>
//                             <p style={{ fontSize: 16, color: '#999' }}>
//                                 Không tìm thấy xe phù hợp với bộ lọc đã chọn
//                             </p>
//                             <Button
//                                 type="link"
//                                 onClick={() => handleFilterClick('all')}
//                                 style={{ fontSize: 14 }}
//                             >
//                                 Xem tất cả xe
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CarListing;

import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Select, Tag } from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../../components/CarCard';
import { sampleCars, luxuryCars } from '../../data/sampleCars';
import './CarListing.css';

const { Option } = Select;

const CarListing = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    // Lấy thông tin tìm kiếm từ URL params
    const location = searchParams.get('location');
    const pickupDate = searchParams.get('pickupDate');
    const pickupTime = searchParams.get('pickupTime');
    const returnDate = searchParams.get('returnDate');
    const returnTime = searchParams.get('returnTime');

    // Kiểm tra xem có phải từ search không (có location hoặc pickupDate)
    const isFromSearch = location || pickupDate;

    // Kết hợp cả xe thường và xe sang khi không có category hoặc từ search
    const getAllCars = () => {
        if (category === 'luxury') {
            return luxuryCars;
        } else if (category === 'normal') {
            return sampleCars;
        } else {
            // Khi không có category hoặc từ search, hiển thị cả hai loại
            return [...sampleCars, ...luxuryCars];
        }
    };

    const baseData = getAllCars();

    // Cập nhật tiêu đề động
    const getPageTitle = () => {
        if (category === 'luxury') {
            return 'Xe sang - Xe cao cấp';
        } else if (category === 'normal') {
            return 'Xe thường';
        } else {
            return 'Tất cả xe cho thuê';
        }
    };

    const pageTitle = getPageTitle();

    const sortOptions = [
        { value: 'popular', label: 'Phổ biến' },
        { value: 'price-asc', label: 'Giá tăng dần' },
        { value: 'price-desc', label: 'Giá giảm dần' },
        { value: 'newest', label: 'Xe mới nhất' },
    ];


    const [filteredCars, setFilteredCars] = useState(baseData);
    const [activeFilters, setActiveFilters] = useState(['all']);

    // Reset data khi thay đổi category hoặc search params
    useEffect(() => {
        const newBaseData = getAllCars();
        setFilteredCars(newBaseData);
        setActiveFilters(['all']);
    }, [category, location, pickupDate, pickupTime, returnDate, returnTime]);

    const getFilterOptions = () => {
        // Nếu từ thanh tìm kiếm
        if (isFromSearch) {
            return [
                { key: 'all', label: 'Tất cả', icon: null, color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'normal', label: 'Xe thường', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
                { key: 'luxury', label: 'Xe sang', icon: '⭐', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' }
            ];
        }

        // Nếu từ trang chủ → Xe thường
        if (category === 'normal') {
            return [
                { key: 'all', label: 'Tất cả', icon: null, color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'toyota', label: 'Toyota', icon: '🚗', color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'hyundai', label: 'Hyundai', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'honda', label: 'Honda', icon: '🚗', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
                { key: 'suzuki', label: 'Suzuki', icon: '🚗', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
                { key: 'kia', label: 'Kia', icon: '🚗', color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
            ];
        }

        // Nếu từ trang chủ → Xe sang
        if (category === 'luxury') {
            return [
                { key: 'all', label: 'Tất cả', icon: null, color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'mercedes', label: 'Mercedes', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
                { key: 'bmw', label: 'BMW', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
                { key: 'audi', label: 'Audi', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'lexus', label: 'Lexus', icon: '🚗', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
            ];
        }

        // Trường hợp mặc định (không xác định) → chỉ hiển thị "Tất cả"
        return [
            { key: 'all', label: 'Tất cả', icon: null, color: '#51c09f', bgColor: '#f6ffed', borderColor: '#52c41a' }
        ];
    };


    // Xử lý click filter - cập nhật logic
    const handleFilterClick = (filterKey) => {
        if (filterKey === 'all') {
            setActiveFilters(['all']);
            setFilteredCars(baseData);
            return;
        }

        let newFilters;
        if (activeFilters.includes(filterKey)) {
            newFilters = activeFilters.filter(f => f !== filterKey && f !== 'all');
        } else {
            newFilters = [...activeFilters.filter(f => f !== 'all'), filterKey];
        }

        if (newFilters.length === 0) {
            setActiveFilters(['all']);
            setFilteredCars(baseData);
            return;
        }

        setActiveFilters(newFilters);

        // Logic lọc xe được cập nhật
        const filtered = baseData.filter(car => {
            return newFilters.some(filter => {
                // Filter theo loại xe
                if (filter === 'luxury') {
                    return car.carType === 'LUXURY';
                }
                if (filter === 'normal') {
                    return car.carType === 'NORMAL';
                }

                // Filter theo thương hiệu
                const brandFilters = ['mercedes', 'bmw', 'audi', 'lexus', 'toyota', 'honda', 'hyundai', 'mazda', 'suzuki', 'kia'];
                if (brandFilters.includes(filter)) {
                    return car.name.toLowerCase().includes(filter) ||
                        car.carBrand.name.toLowerCase().includes(filter);
                }

                return false;
            });
        });

        setFilteredCars(filtered);
    };

    // Xử lý sắp xếp
    const handleSortChange = (value) => {
        let sorted = [...filteredCars];

        switch (value) {
            case 'price-asc':
                sorted.sort((a, b) => a.pricePer24Hour - b.pricePer24Hour);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.pricePer24Hour - a.pricePer24Hour);
                break;
            case 'newest':
                sorted.sort((a, b) => b.year - a.year);
                break;
            default:
                break;
        }

        setFilteredCars(sorted);
    };

    // Hàm format thông tin tìm kiếm để hiển thị
    const formatSearchInfo = () => {
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
            dateTimeDisplay = '00h00, 23/05/2025 đến 04h00, 25/05/2025';
        }

        return { locationDisplay, dateTimeDisplay };
    };

    const filterOptions = getFilterOptions();
    const { locationDisplay, dateTimeDisplay } = formatSearchInfo();

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
                            <Button type="primary" size="large" className="search-button">
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
                        {filterOptions.map(filter => (
                            <Col key={filter.key}>
                                <div
                                    className={`filter-tag-outlined ${activeFilters.includes(filter.key) ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(filter.key)}
                                    style={{
                                        borderColor: activeFilters.includes(filter.key) ? filter.borderColor : '#d9d9d9',
                                        color: activeFilters.includes(filter.key) ? filter.color : '#666',
                                        backgroundColor: activeFilters.includes(filter.key) ? filter.bgColor : '#fafafa'
                                    }}
                                >
                                    {filter.icon && <span className="filter-icon">{filter.icon}</span>}
                                    {filter.label}
                                </div>
                            </Col>
                        ))}

                        <Col flex="auto" />

                        {/* Sort Dropdown */}
                        <Col>
                            <Select
                                defaultValue="popular"
                                style={{ width: 200 }}
                                onChange={handleSortChange}
                                placeholder="Sắp xếp"
                                className="sort-select"
                            >
                                {sortOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="cars-grid-section">
                <div className="cars-container">
                    <h2 className="section-title">{pageTitle}</h2>

                    {/* Hiển thị thông tin tìm kiếm nếu có */}
                    {isFromSearch && (
                        <div style={{ textAlign: 'center', marginBottom: 20, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                            <p style={{ margin: 0, color: '#1890ff', fontSize: '14px' }}>
                                Kết quả tìm kiếm cho: <strong>{locationDisplay}</strong>
                                {pickupDate && (
                                    <span> - Thời gian: <strong>{dateTimeDisplay}</strong></span>
                                )}
                            </p>
                        </div>
                    )}

                    <p style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
                        Tìm thấy {filteredCars.length} xe phù hợp
                        {!category && ` (${sampleCars.length} xe thường, ${luxuryCars.length} xe sang)`}
                    </p>

                    <Row gutter={[16, 24]}>
                        {filteredCars.map(car => (
                            <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
                                <CarCard car={car} />
                            </Col>
                        ))}
                    </Row>

                    {/* Show more button */}
                    {filteredCars.length >= 8 && (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <Button size="large" style={{ padding: '0 40px' }}>
                                Xem thêm xe
                            </Button>
                        </div>
                    )}

                    {/* Empty state */}
                    {filteredCars.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <p style={{ fontSize: 16, color: '#999' }}>
                                Không tìm thấy xe phù hợp với bộ lọc đã chọn
                            </p>
                            <Button
                                type="link"
                                onClick={() => handleFilterClick('all')}
                                style={{ fontSize: 14 }}
                            >
                                Xem tất cả xe
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarListing;