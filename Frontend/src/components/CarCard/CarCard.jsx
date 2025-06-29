import React from 'react';
import { Card, Badge, Typography, Row, Col, Space } from 'antd';
import { UserOutlined, SettingOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const CarCard = ({ car, isInCarousel = false }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/car-detail/${car.id}`);
    };

    // Styling khác nhau cho carousel và grid
    const cardStyle = isInCarousel ? {
        width: '100%', // Sử dụng 100% width trong carousel
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '0', // Không margin, chỉ dựa vào padding của wrapper
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        border: '1px solid #f0f0f0'
    } : {
        width: 280,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '0 auto 16px auto', // Center card và margin bottom cho grid
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
    };

    return (
        <Card hoverable
            onClick={handleCardClick}
            style={cardStyle}
            styles={{ body: { padding: '16px' } }}
            cover={
                <div style={{ position: 'relative' }}>
                    <img
                        alt={car.name}
                        src={car.images && car.images[0] && car.images[0].imageUrl ? car.images[0].imageUrl : 'https://cdn.tgdd.vn/Files/2022/01/06/1409479/Gallery/vinfast-vf7-8-164143096342319009.jpg'}
                        style={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover'
                        }}
                        onError={e => { e.target.onerror = null; e.target.src = 'https://cdn.tgdd.vn/Files/2022/01/06/1409479/Gallery/vinfast-vf7-8-164143096342319009.jpg'; }}
                    />

                    {/* Badge 24/7 */}
                    {car.available247 && (
                        <div style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: '#2ac1bc',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            24/7
                        </div>
                    )}

                    {/* Badge giảm giá */}
                    {car.discount && (
                        <div style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            Giảm giá {car.discount}%
                        </div>
                    )}
                </div>
            }
        >
            <div style={{ padding: '4px 0' }}>
                {/* Tên xe */}
                <Title level={5} style={{
                    margin: '0 0 8px 0',
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: '1.4'
                }}>
                    {car.name} {car.year}
                </Title>

                {/* Địa điểm */}
                <Text style={{
                    fontSize: 14,
                    display: 'block',
                    marginBottom: 12,
                    color: '#666'
                }}>
                    {car.location.district}
                </Text>

                {/* Giá */}
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 16, color: '#51c09f', fontWeight: '600' }}>
                        {car.pricePer4Hour / 1000}K
                    </Text>
                    <Text style={{ fontSize: 14, color: '#999', marginLeft: 4 }}>
                        / 4 giờ
                    </Text>
                    <br />
                    <Text strong style={{ fontSize: 16, color: '#51c09f', fontWeight: '600' }}>
                        {car.pricePer24Hour / 1000}K
                    </Text>
                    <Text style={{ fontSize: 14, color: '#999', marginLeft: 4 }}>
                        / 24 giờ
                    </Text>
                </div>

                {/* Thông tin xe */}
                <Row gutter={[4, 4]} style={{ fontSize: 12 }}>
                    <Col span={8}>
                        <Space size={2} style={{ display: 'flex', alignItems: 'center' }}>
                            <UserOutlined style={{ color: '#51c09f', fontSize: 12 }} />
                            <Text style={{ fontSize: 11, fontWeight: '500', color: '#333' }}>
                                {car.seats} chỗ
                            </Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size={2} style={{ display: 'flex', alignItems: 'center' }}>
                            <SettingOutlined style={{ color: '#51c09f', fontSize: 12 }} />
                            <Text style={{ fontSize: 11, fontWeight: '500', color: '#333' }}>
                                {car.transmission}
                            </Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space size={2} style={{ display: 'flex', alignItems: 'center' }}>
                            <CarOutlined style={{ color: '#51c09f', fontSize: 12 }} />
                            <Text style={{ fontSize: 11, fontWeight: '500', color: '#333' }}>
                                {car.fuelType}
                            </Text>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default CarCard;