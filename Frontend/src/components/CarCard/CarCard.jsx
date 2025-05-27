import React from 'react';
import { Card, Badge, Typography, Row, Col, Space } from 'antd';
import { UserOutlined, SettingOutlined, CarOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom'; // === THÊM IMPORT ===

const { Text, Title } = Typography;

const CarCard = ({ car }) => {

    const navigate = useNavigate(); // === THÊM HOOK NAVIGATE ===

    // === THÊM FUNCTION XỬ LÝ CLICK CARD ===
    const handleCardClick = () => {
        navigate(`/car-detail/${car.id}`);
    };

    return (
        <Card
            hoverable
            onClick={handleCardClick} // === THÊM CLICK HANDLER ===
            style={{
                width: 280,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '0 8px' // Thêm margin cho carousel
            }}
            cover={
                <div style={{ position: 'relative' }}>
                    <img
                        alt={car.name}
                        src={car.image}
                        style={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover'
                        }}
                    />

                    {/* Badge 24/7 */}
                    {car.available247 && (
                        <div style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: '#52c41a',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 'bold'
                        }}>
                            24/7
                        </div>
                    )}

                    {/* Badge giảm giá */}
                    {car.discount && (
                        <div style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 'bold'
                        }}>
                            Giảm giá {car.discount}%
                        </div>
                    )}
                </div>
            }
        >
            <div style={{ padding: '8px 0' }}>
                {/* Tên xe */}
                <Title level={5} style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: '500' }}>
                    {car.name} {car.year}
                </Title>

                {/* Địa điểm */}
                <Text style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>
                    {car.location}
                </Text>

                {/* Giá */}
                <div style={{ marginBottom: 12 }}>
                    <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                        {car.currentPrice}K
                    </Text>
                    <Text style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>
                        giờ
                    </Text>
                    {car.originalPrice && (
                        <Text
                            delete
                            type="secondary"
                            style={{ fontSize: 12, marginLeft: 8 }}
                        >
                            {car.originalPrice}K
                        </Text>
                    )}
                </div>

                {/* Thông tin xe */}
                <Row gutter={16} style={{ fontSize: 12 }}>
                    <Col span={8}>
                        <Space size={4}>
                            <UserOutlined style={{ color: '#1890ff' }} />
                            <Text style={{ fontSize: 12, fontWeight: '500' }}>{car.seats} chỗ</Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size={4}>
                            <SettingOutlined style={{ color: '#1890ff' }} />
                            <Text style={{ fontSize: 12, fontWeight: '500' }}>{car.transmission}</Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size={4}>
                            <CarOutlined style={{ color: '#1890ff' }} />
                            <Text style={{ fontSize: 12, fontWeight: '500' }}>{car.fuel}</Text>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default CarCard;