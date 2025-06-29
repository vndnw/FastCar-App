import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Image,
    Button,
    Space,
    Divider,
    Spin,
    message
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    CarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { carService } from '../../../services/carService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const CarDetail = () => {
    const navigate = useNavigate();
    const { carId } = useParams();
    const location = useLocation();

    // Determine if we're in admin or owner context
    const isOwnerContext = location.pathname.includes('/owner/');
    const basePath = isOwnerContext ? '/owner/cars' : '/admin/cars';

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarDetail();
    }, [carId]);

    const fetchCarDetail = async () => {
        try {
            setLoading(true);
            const result = await carService.getCarById(carId);

            if (result.status === 200 && result.data) {
                setCar(result.data);
            } else {
                message.error(result.data?.message || 'Failed to fetch car details');
                navigate('/admin/cars');
            }
        } catch (error) {
            console.error('Error fetching car details:', error);
            message.error(error.response?.data?.message || 'Failed to fetch car details');
            navigate('/admin/cars');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>Loading car details...</div>
                </div>
            </Card>
        );
    }

    if (!car) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <CarOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                    <Title level={4} style={{ color: '#666' }}>Car not found</Title>
                    <Button type="primary" onClick={() => navigate('/admin/cars')}>
                        Back to Cars
                    </Button>
                </div>
            </Card>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const colors = {
            'AVAILABLE': 'green',
            'UNAVAILABLE': 'red',
            'MAINTENANCE': 'orange',
            'PENDING': 'blue'
        };
        return colors[status] || 'default';
    };

    const getTransmissionColor = (transmission) => {
        return transmission === 'AUTO' ? 'blue' : 'green';
    };

    const getCarTypeColor = (carType) => {
        const colors = {
            'ECONOMY': 'cyan',
            'STANDARD': 'blue',
            'PREMIUM': 'purple',
            'LUXURY': 'gold',
            'SUPER_LUXURY': 'magenta'
        };
        return colors[carType] || 'default';
    };

    return (
        <div>
            {/* Header */}
            <Card style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(basePath)}
                            >
                                Back to Cars
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>
                                Car Details
                            </Title>
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`${basePath}/edit/${car.id}`)}
                        >
                            Edit Car
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Car Information */}
            <Card style={{ marginBottom: 24 }}>
                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: 24,
                    borderRadius: 8,
                    marginBottom: 24
                }}>
                    <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                        {car.name}
                    </Title>
                    <Text style={{ fontSize: 18, color: '#666' }}>
                        {car.carBrand?.name} {car.model} ({car.year})
                    </Text>
                    <div style={{ marginTop: 12 }}>
                        <Tag color={getStatusColor(car.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
                            {car.status}
                        </Tag>
                        <Tag color={getTransmissionColor(car.transmission)} style={{ fontSize: 14, padding: '4px 12px' }}>
                            {car.transmission}
                        </Tag>
                        <Tag color={getCarTypeColor(car.carType)} style={{ fontSize: 14, padding: '4px 12px' }}>
                            {car.carType}
                        </Tag>
                    </div>
                </div>

                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Title level={4}>Vehicle Information</Title>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Owner:</strong> <span style={{ marginLeft: 8 }}>{car.emailOwner}</span>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>License Plate:</strong> <span style={{ marginLeft: 8 }}>{car.licensePlate}</span>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Seats:</strong> <span style={{ marginLeft: 8 }}>{car.seats}</span>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Color:</strong> <span style={{ marginLeft: 8 }}>{car.color}</span>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Fuel Type:</strong> <span style={{ marginLeft: 8 }}>{car.fuelType}</span>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Fuel Consumption:</strong> <span style={{ marginLeft: 8 }}>{car.fuelConsumption}</span>
                            </div>
                            {car.features && car.features.length > 0 && (
                                <div style={{ marginBottom: 8 }}>
                                    <strong>Features:</strong>
                                    <div style={{ marginTop: 4 }}>
                                        {car.features.map(feature => (
                                            <Tag key={feature.id || feature.name} style={{ marginBottom: 4 }}>
                                                {feature.name}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={4}>Pricing Information</Title>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Per Hour:</strong> <span style={{ marginLeft: 8 }}>{formatCurrency(car.pricePerHour)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                {car.location && (
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4}>Location</Title>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Address:</strong> <span style={{ marginLeft: 8 }}>{car.location.address}</span>
                        </div>
                        <div style={{ color: '#666', fontSize: 14 }}>
                            <strong>Coordinates:</strong> {car.location.latitude}, {car.location.longitude}
                        </div>
                    </div>
                )}

                {car.description && (
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4}>Description</Title>
                        <div style={{ color: '#666', lineHeight: 1.6 }}>{car.description}</div>
                    </div>
                )}

                <div style={{ marginBottom: 24 }}>
                    <Title level={4}>Timestamps</Title>
                    <div style={{ fontSize: 14, color: '#999' }}>
                        <div style={{ marginBottom: 4 }}>
                            <strong>Created:</strong> <span style={{ marginLeft: 8 }}>{dayjs(car.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                        <div>
                            <strong>Updated:</strong> <span style={{ marginLeft: 8 }}>{dayjs(car.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                    </div>
                </div>

                {car.images && car.images.length > 0 && (
                    <div>
                        <Title level={4}>Images</Title>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {car.images.map((image, index) => (
                                <div key={image.id || index} style={{ marginBottom: 16 }}>
                                    <Image
                                        width={200}
                                        height={150}
                                        src={image.imageUrl || image}
                                        style={{ borderRadius: 8, objectFit: 'cover' }}
                                        placeholder={
                                            <div style={{
                                                width: 200,
                                                height: 150,
                                                backgroundColor: '#f5f5f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 8
                                            }}>
                                                <CarOutlined style={{ fontSize: 24, color: '#ccc' }} />
                                            </div>
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CarDetail;
