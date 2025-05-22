import React, { useState } from 'react';
import { Row, Col, Button, Select, Tag } from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import CarCard from '../../components/CarCard';
import { sampleCars } from '../../data/sampleCars';
import './CarListing.css';

const { Option } = Select;

const CarListing = () => {
    const [filteredCars, setFilteredCars] = useState(sampleCars);
    const [activeFilters, setActiveFilters] = useState(['all']);

    // Filter options with icons, colors and backgrounds
    const filterOptions = [
        { key: 'all', label: 'Tất cả', icon: null, color: '#52c41a', bgColor: '#f6ffed', borderColor: '#52c41a' },
        { key: 'luxury', label: 'Xe xịn', icon: '⭐', color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#fa8c16' },
        { key: '5-seats', label: '5 chỗ', icon: '👥', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
        { key: '7-seats', label: '7 chỗ', icon: '👥', color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#722ed1' },
        { key: 'honda', label: 'Hãng xe', icon: '🚗', color: '#eb2f96', bgColor: '#fff0f6', borderColor: '#eb2f96' },
        { key: 'toyota', label: 'Loại xe', icon: '🏷️', color: '#fa541c', bgColor: '#fff2e8', borderColor: '#fa541c' },
        { key: 'fuel', label: 'Nhiên liệu', icon: '⛽', color: '#13c2c2', bgColor: '#e6fffb', borderColor: '#13c2c2' },
        { key: 'location', label: 'Khu vực xe', icon: '📍', color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#1890ff' },
    ];

    const sortOptions = [
        { value: 'popular', label: 'Phổ biến nhất' },
        { value: 'price-asc', label: 'Giá thấp đến cao' },
        { value: 'price-desc', label: 'Giá cao đến thấp' },
        { value: 'newest', label: 'Xe mới nhất' },
    ];

    const handleFilterClick = (filterKey) => {
        if (filterKey === 'all') {
            setActiveFilters(['all']);
            setFilteredCars(sampleCars);
        } else {
            const newFilters = activeFilters.includes(filterKey)
                ? activeFilters.filter(f => f !== filterKey && f !== 'all')
                : [...activeFilters.filter(f => f !== 'all'), filterKey];

            setActiveFilters(newFilters.length ? newFilters : ['all']);
            // Simplified filtering logic for demo
            setFilteredCars(sampleCars);
        }
    };

    const handleSortChange = (value) => {
        let sorted = [...filteredCars];
        switch (value) {
            case 'price-asc':
                sorted.sort((a, b) => a.currentPrice - b.currentPrice);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.currentPrice - a.currentPrice);
                break;
            case 'newest':
                sorted.sort((a, b) => b.year - a.year);
                break;
            default:
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

            {/* Filter Section - Updated Style */}
            <div className="filter-section-new">
                <div className="filter-container">
                    {/* Filter Tags Row */}
                    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
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
                    </Row>

                    {/* Sort Row */}
                    <Row justify="end">
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
                    <h2 className="section-title">Xe tương tự</h2>

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
                </div>
            </div>
        </div>
    );
};

export default CarListing;