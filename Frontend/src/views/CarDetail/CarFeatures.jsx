// CarFeatures.jsx – Component tiện nghi xe
import React from 'react';
import { Row, Col } from 'antd';
import './CarFeatures.css';

const CarFeatures = ({ car }) => {
    const features = [
        { icon: '📻', label: 'Bản đồ' },
        { icon: '🔵', label: 'Bluetooth' },
        { icon: '📷', label: 'Camera 360' },
        { icon: '📹', label: 'Camera cập lề' },
        { icon: '📹', label: 'Camera hành trình' },
        { icon: '📷', label: 'Camera Lùi' },
        { icon: '🚨', label: 'Cảm biến lốp' },
        { icon: '🚗', label: 'Cảm biến va chạm' },
        { icon: '⚡', label: 'Cảnh báo tốc độ' },
        { icon: '📀', label: 'Màn hình DVD' },
        { icon: '🗺️', label: 'Định vị GPS' },
        { icon: '🔌', label: 'Khe cắm USB' },
        { icon: '☂️', label: 'Lốp dự phòng' },
        { icon: '💳', label: 'ETC' },
        { icon: '🔐', label: 'Túi khí an toàn' }
    ];

    return (
        <div className="car-features-extended">
            <h3>Các tiện nghi khác</h3>
            <Row gutter={[16, 16]}>
                {features.map((feature, index) => (
                    <Col xs={12} sm={8} md={6} key={index}>
                        <div className="feature-item-extended">
                            <span className="feature-emoji">{feature.icon}</span>
                            <span className="feature-text">{feature.label}</span>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CarFeatures;