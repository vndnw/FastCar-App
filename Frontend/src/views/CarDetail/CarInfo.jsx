// CarInfo.jsx – Component thông tin xe
import React from 'react';
import { Row, Col } from 'antd';
import { UserOutlined, SettingOutlined, CarOutlined } from '@ant-design/icons';
import './CarInfo.css';

const CarInfo = ({ car }) => {
    return (
        <div className="car-info">
            <div className="car-header">
                <h1 className="car-title">{car.name} {car.year}</h1>
            </div>

            <p className="car-location"> 
                {car.location.district} - {car.location.city}</p>

            <div className="car-pricing">
                <div className="price-row">
                    <div className="current-price">
                        <span className="price-value">
                            {car.pricePer4Hour.toLocaleString('vi-VN')}vnd
                        </span>
                        <span className="price-unit">/4 giờ</span>
                    </div>
                    <div className="current-price">
                        <span className="price-value">
                            {car.pricePer8Hour.toLocaleString('vi-VN')}vnd
                        </span>
                        <span className="price-unit">/8 giờ</span>
                    </div>
                </div>
                <div className="price-row">
                    <div className="current-price">
                        <span className="price-value">
                            {car.pricePer12Hour.toLocaleString('vi-VN')}vnd
                        </span>
                        <span className="price-unit">/12 giờ</span>
                    </div>
                    <div className="current-price">
                        <span className="price-value">
                            {car.pricePer24Hour.toLocaleString('vi-VN')}vnd
                        </span>
                        <span className="price-unit">/24 giờ</span>
                    </div>
                </div>
            </div>

            <div className="car-features">
                <h3>Đặc điểm</h3>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div className="feature-item">
                            <UserOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Số ghế</div>
                                <div className="feature-value">{car.seats} chỗ</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="feature-item">
                            <SettingOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Truyền động</div>
                                <div className="feature-value">{car.transmission}</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="feature-item">
                            <CarOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Nhiên liệu</div>
                                <div className="feature-value">{car.fuelType}</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="feature-item">
                            <CarOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Tiêu hao</div>
                                <div className="feature-value">{car.fuelConsumption}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CarInfo;
