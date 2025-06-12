import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Select, Tag } from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../../components/CarCard';
import { sampleCars, luxuryCars } from '../../data/sampleCars';
import './CarListing.css';

const { Option } = Select;

const CarListing = () => {
    // Đọc URL param để xác định loại xe
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category'); // 'luxury' hoặc null

    // Dữ liệu động dựa vào category từ URL
    const baseData = category === 'luxury' ? luxuryCars : sampleCars;
    const pageTitle = category === 'luxury' ? 'Xe sang - Xe cao cấp' : 'Xe tương tự';

    // State quản lý danh sách xe đã lọc
    const [filteredCars, setFilteredCars] = useState(baseData);

    // Lấy bộ lọc khởi tạo - bắt đầu với "Tất cả"
    const getInitialFilters = () => {
        return ['all']; // Luôn bắt đầu với "Tất cả"
    };

    const [activeFilters, setActiveFilters] = useState(getInitialFilters());

    // Cập nhật dữ liệu khi URL thay đổi
    useEffect(() => {
        setFilteredCars(baseData);
        setActiveFilters(['all']); // Reset về "Tất cả" khi chuyển category
    }, [category]);

    // Tùy chọn bộ lọc - khác nhau cho xe thường và xe sang  
    const getFilterOptions = () => {
        const isLuxury = category === 'luxury';

        if (isLuxury) {
            // Filter cho xe sang - THÊM "Xe xịn"
            return [
                { key: 'all', label: 'Tất cả', icon: null, color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'luxury', label: 'Xe xịn', icon: '⭐', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' },
                { key: 'mercedes', label: 'Mercedes', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
                { key: 'bmw', label: 'BMW', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
                { key: 'audi', label: 'Audi', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'lexus', label: 'Lexus', icon: '🚗', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
            ];
        } else {
            // Filter cho xe thường - THÊM "Xe xịn"
            return [
                { key: 'all', label: 'Tất cả', icon: null, color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },
                { key: 'luxury', label: 'Xe xịn', icon: '⭐', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' },
                { key: 'toyota', label: 'Toyota', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
                { key: 'honda', label: 'Honda', icon: '🚗', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
                { key: 'hyundai', label: 'Hyundai', icon: '🚗', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
                { key: 'mazda', label: 'Mazda', icon: '🚗', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
                { key: 'suzuki', label: 'Suzuki', icon: '🚗', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
                { key: 'kia', label: 'Kia', icon: '🚗', color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },
            ];
        }
    };

    const filterOptions = getFilterOptions();

    const sortOptions = [
        { value: 'popular', label: 'Phổ biến nhất' },
        { value: 'price-asc', label: 'Giá thấp đến cao' },
        { value: 'price-desc', label: 'Giá cao đến thấp' },
        { value: 'newest', label: 'Xe mới nhất' },
    ];

    // Xử lý khi click vào filter tag - HỖ TRỢ MULTIPLE SELECTION CHO CẢ 2 SECTION
    const handleFilterClick = (filterKey) => {
        if (filterKey === 'all') {
            // Reset về hiển thị tất cả xe
            setActiveFilters(['all']);
            setFilteredCars(baseData);
            return;
        }

        // Xử lý toggle selection cho multiple filters
        let newFilters;
        if (activeFilters.includes(filterKey)) {
            // Nếu filter đã được chọn, bỏ chọn nó
            newFilters = activeFilters.filter(f => f !== filterKey && f !== 'all');
        } else {
            // Nếu filter chưa được chọn, thêm vào danh sách (bỏ 'all' nếu có)
            newFilters = [...activeFilters.filter(f => f !== 'all'), filterKey];
        }

        // Nếu không có filter nào được chọn, quay về 'all'
        if (newFilters.length === 0) {
            setActiveFilters(['all']);
            setFilteredCars(baseData);
            return;
        }

        // Cập nhật active filters
        setActiveFilters(newFilters);

        // Lọc xe dựa trên TẤT CẢ filters đã chọn (OR logic - hiển thị xe thuộc BẤT KỲ filter nào)
        const filtered = baseData.filter(car => {
            return newFilters.some(filter => {
                // Kiểm tra từng loại filter
                if (filter === 'luxury') {
                    // Lọc xe có thuộc tính luxury
                    return car.isLuxury === true;
                }
                // Lọc theo hãng xe sang
                else if (filter === 'mercedes') {
                    return car.name.toLowerCase().includes('mercedes');
                }
                else if (filter === 'bmw') {
                    return car.name.toLowerCase().includes('bmw');
                }
                else if (filter === 'audi') {
                    return car.name.toLowerCase().includes('audi');
                }
                else if (filter === 'lexus') {
                    return car.name.toLowerCase().includes('lexus');
                }
                // Lọc theo hãng xe thường
                else if (filter === 'toyota') {
                    return car.name.toLowerCase().includes('toyota');
                }
                else if (filter === 'honda') {
                    return car.name.toLowerCase().includes('honda');
                }
                else if (filter === 'hyundai') {
                    return car.name.toLowerCase().includes('hyundai');
                }
                else if (filter === 'mazda') {
                    return car.name.toLowerCase().includes('mazda');
                }
                else if (filter === 'suzuki') {
                    return car.name.toLowerCase().includes('suzuki');
                }
                else if (filter === 'kia') {
                    return car.name.toLowerCase().includes('kia');
                }
                return false;
            });
        });

        // Cập nhật danh sách xe đã lọc
        setFilteredCars(filtered);
    };

    // Xử lý thay đổi sắp xếp
    const handleSortChange = (value) => {
        let sorted = [...filteredCars];
        switch (value) {
            case 'price-asc':
                // Sắp xếp theo giá từ thấp đến cao
                sorted.sort((a, b) => a.currentPrice - b.currentPrice);
                break;
            case 'price-desc':
                // Sắp xếp theo giá từ cao đến thấp
                sorted.sort((a, b) => b.currentPrice - a.currentPrice);
                break;
            case 'newest':
                // Sắp xếp theo năm sản xuất mới nhất
                sorted.sort((a, b) => b.year - a.year);
                break;
            default:
                // Mặc định không sắp xếp
                break;
        }
        setFilteredCars(sorted);
    };

    return (
        <div className="car-listing-page">
            {/* Search Bar Section - Dark Background */}
            <div className="search-section-dark">
                <div className="search-container">
                    <Row gutter={16} align="middle">
                        <Col flex="200px">
                            <h2 className="search-title">Tìm xe tự lái</h2>
                        </Col>
                        <Col flex="auto">
                            <div className="search-input-white">
                                <EnvironmentOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <span>Chọn địa điểm tìm xe</span>
                            </div>
                        </Col>
                        <Col flex="auto">
                            <div className="search-input-white">
                                <CalendarOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <span>00h00, 23/05/2025 đến 04h00, 25/05/2025</span>
                            </div>
                        </Col>
                        <Col flex="200px">
                            <Button
                                type="primary"
                                size="large"
                                className="search-button"
                            >
                                TÌM XE
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Filter Section - Updated Style với Sticky và Align */}
            <div className="filter-section-new">
                <div className="filter-container">
                    {/* Filter Tags + Sort cùng 1 Row */}
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

                        {/* Spacer để đẩy Sort sang phải */}
                        <Col flex="auto" />

                        {/* Sort Dropdown - cùng hàng với filters */}
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

            {/* Cars Grid Section */}
            <div className="cars-grid-section">
                <div className="cars-container">
                    <h2 className="section-title">{pageTitle}</h2>

                    {/* Hiển thị số lượng xe đã lọc */}
                    <p style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
                        Tìm thấy {filteredCars.length} xe phù hợp
                    </p>

                    <Row gutter={[16, 24]}>
                        {filteredCars.map(car => (
                            <Col key={car.id} xs={24} sm={12} md={8} lg={6}>
                                <CarCard car={car} />
                            </Col>
                        ))}
                    </Row>

                    {/* Show more button if needed */}
                    {filteredCars.length >= 8 && (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <Button size="large" style={{ padding: '0 40px' }}>
                                Xem thêm xe
                            </Button>
                        </div>
                    )}

                    {/* Hiển thị thông báo nếu không có xe nào */}
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