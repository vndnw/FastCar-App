import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Tag,
    Space,
    Image,
    Typography,
    message,
    Modal,
    Row,
    Col,
    Statistic
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { carService } from '../../services/carService';

const { Title, Text } = Typography;
const { confirm } = Modal;

function OwnerCars() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        if (user?.id) {
            fetchCars();
        }
    }, [user?.id]);

    const fetchCars = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const result = await carService.getCarsByUserId(user.id);

            if (result.status === 200 && result.data) {
                const carsData = Array.isArray(result.data) ? result.data : result.data.content || [];
                setCars(carsData);
                setPagination(prev => ({
                    ...prev,
                    total: carsData.length,
                }));
            } else {
                message.error('Failed to fetch cars');
                setCars([]);
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            message.error('Failed to fetch cars');
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = (carId, carName) => {
        confirm({
            title: 'Delete Car',
            content: `Are you sure you want to delete "${carName}"? This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const result = await carService.deleteCar(carId);
                    if (result.status === 200) {
                        message.success(`Car "${carName}" deleted successfully!`);
                        fetchCars();
                    } else {
                        message.error(result.data?.message || 'Failed to delete car');
                    }
                } catch (error) {
                    console.error('Error deleting car:', error);
                    message.error('Failed to delete car');
                }
            },
        });
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'AVAILABLE': 'green',
            'RENTED': 'blue',
            'MAINTENANCE': 'orange',
            'PENDING': 'gold',
            'REJECTED': 'red',
        };
        return statusColors[status] || 'default';
    };

    const getTransmissionColor = (transmission) => {
        return transmission === 'AUTO' ? 'blue' : 'green';
    };

    const getCarTypeColor = (carType) => {
        const colors = {
            'STANDARD': 'default',
            'LUXURY': 'purple',
            'SUPER_LUXURY': 'gold',
        };
        return colors[carType] || 'default';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const columns = [
        {
            title: 'Car Information',
            key: 'carInfo',
            width: '30%',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden' }}>
                        {record.images && record.images.length > 0 ? (
                            <Image
                                width={80}
                                height={60}
                                src={record.images[0].imageUrl || record.images[0]}
                                style={{ objectFit: 'cover' }}
                                fallback="data:image/png;base64,..."
                            />
                        ) : (
                            <div style={{
                                width: 80,
                                height: 60,
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                                color: '#bfbfbf'
                            }}>
                                🚗
                            </div>
                        )}
                    </div>
                    <div>
                        <Text strong style={{ display: 'block', fontSize: 14 }}>
                            {record.name}
                        </Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                            {record.carBrand?.name} {record.model} ({record.year})
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {record.licensePlate}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Specifications',
            key: 'specs',
            width: '25%',
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 8 }}>
                        <Tag color={getTransmissionColor(record.transmission)}>
                            {record.transmission}
                        </Tag>
                        <Tag color={getCarTypeColor(record.carType)}>
                            {record.carType}
                        </Tag>
                    </div>
                    <Text style={{ fontSize: 12, color: '#666', display: 'block' }}>
                        {record.seats} seats • {record.fuelType}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#999' }}>
                        {record.fuelConsumption}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: '15%',
            render: (_, record) => (
                <Tag color={getStatusColor(record.status)} style={{ fontSize: 12 }}>
                    {record.status}
                </Tag>
            ),
        },
        {
            title: 'Price/Hour',
            key: 'price',
            width: '15%',
            render: (_, record) => (
                <Text strong style={{ fontSize: 13 }}>
                    {formatCurrency(record.pricePerHour)}
                </Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => navigate(`/owner/cars/${record.id}`)}
                    >
                        View
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => navigate(`/owner/cars/edit/${record.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeleteCar(record.id, record.name)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        fetchCars(pagination.current, pagination.pageSize);
    };

    // Calculate statistics
    const totalCars = cars.length;
    const availableCars = cars.filter(car => car.status === 'AVAILABLE').length;
    const rentedCars = cars.filter(car => car.status === 'RENTED').length;
    const pendingCars = cars.filter(car => car.status === 'PENDING').length;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            My Cars
                        </Title>
                        <Text type="secondary">
                            Manage your car inventory and listings
                        </Text>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/owner/cars/add')}
                            size="large"
                        >
                            Add New Car
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Statistics Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Cars"
                            value={totalCars}
                            prefix={<CarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Available"
                            value={availableCars}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Rented"
                            value={rentedCars}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={pendingCars}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Cars Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={cars}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} cars`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
}

export default OwnerCars;
