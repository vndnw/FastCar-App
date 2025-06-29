import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Button, 
    Space, 
    Tag, 
    Image, 
    Modal, 
    message, 
    Spin, 
    Typography, 
    Divider,
    Empty,
    Popconfirm,
    Tooltip
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    EyeOutlined, 
    CarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    DollarOutlined,
    CalendarOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useCar } from '../../contexts/CarContext';
import { useAuth } from '../../contexts/AuthContext';
import carService from '../../services/carService';
import { useNavigate } from 'react-router-dom';
import './MyCars.css';

const { Title, Text } = Typography;

const MyCars = ({ embedded = false }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cars, loading, error, fetchUserCars } = useCar();
    
    const [statusLoading, setStatusLoading] = useState({});

    useEffect(() => {
        if (user?.id && !embedded) {
            fetchUserCars(user.id);
        }
    }, [user?.id, fetchUserCars, embedded]);

    // Debug: Log cars data chỉ khi component mount
    useEffect(() => {
        if (cars && cars.length > 0) {
            console.log('=== CARS DATA DEBUG ===');
            console.log('Total cars:', cars.length);
            cars.forEach((car, index) => {
                console.log(`Car ${index + 1}:`, {
                    id: car.id,
                    name: car.name,
                    status: car.status,
                    fullCarObject: car
                });
            });
            console.log('=== END CARS DATA DEBUG ===');
        } else {
            console.log('No cars data available');
        }
        // eslint-disable-next-line
    }, []); // chỉ chạy 1 lần khi mount

    // Handle delete car
    const handleDeleteCar = async (carId) => {
        try {
            const response = await carService.deleteCar(carId);
            if (response.status === 200 || response.status === 204) {
                message.success('Xóa xe thành công!');
                // Refresh the car list
                await fetchUserCars(user.id);
            } else {
                message.error('Xóa xe thất bại!');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            message.error('Đã xảy ra lỗi khi xóa xe!');
        }
    };

    // Handle update car status
    const handleUpdateStatus = async (carId, newStatus) => {
        setStatusLoading(prev => ({ ...prev, [carId]: true }));
        try {
            const response = await carService.updateCarStatus(carId, newStatus);
            if (response.status === 200) {
                message.success(`Cập nhật trạng thái xe thành công!`);
                // Refresh the car list
                await fetchUserCars(user.id);
            } else {
                message.error('Cập nhật trạng thái xe thất bại!');
            }
        } catch (error) {
            console.error('Error updating car status:', error);
            message.error('Đã xảy ra lỗi khi cập nhật trạng thái xe!');
        } finally {
            setStatusLoading(prev => ({ ...prev, [carId]: false }));
        }
    };

    // Get status tag color
    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'green';
            case 'UNAVAILABLE':
                return 'red';
            case 'MAINTENANCE':
                return 'orange';
            case 'PENDING':
                return 'blue';
            default:
                return 'default';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Có sẵn';
            case 'UNAVAILABLE':
                return 'Không có sẵn';
            case 'MAINTENANCE':
                return 'Bảo trì';
            case 'PENDING':
                return 'Chờ duyệt';
            default:
                return status || 'Không xác định';
        }
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // If embedded mode, render simplified version
    if (embedded) {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" tip="Đang tải danh sách xe..." />
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: '#ff4d4f' }}>Lỗi tải dữ liệu</Title>
                    <Text style={{ color: '#666' }}>{error}</Text>
                    <br />
                    <Button 
                        type="primary" 
                        onClick={() => fetchUserCars(user.id)}
                        style={{ marginTop: '16px' }}
                    >
                        Thử lại
                    </Button>
                </div>
            );
        }

        return (
            <div className="my-cars-embedded">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <Title level={4} style={{ margin: 0 }}>
                        <CarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Xe của tôi
                    </Title>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/owner-car')}
                        style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                            border: 'none',
                            boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
                        }}
                    >
                        Thêm xe mới
                    </Button>
                </div>

                {cars.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Bạn chưa có xe nào"
                        style={{ padding: '40px 0' }}
                    >
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/owner-car')}
                            style={{
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                                border: 'none'
                            }}
                        >
                            Thêm xe đầu tiên
                        </Button>
                    </Empty>
                ) : (
                    <Row gutter={[16, 16]}>
                        {cars.map((car) => (
                            <Col xs={24} sm={12} lg={8} key={car.id}>
                                <Card
                                    hoverable
                                    className="car-card-embedded"
                                    style={{
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        border: '1px solid #f0f0f0',
                                        overflow: 'hidden'
                                    }}
                                    cover={
                                        <div style={{ position: 'relative' }}>
                                            <Image
                                                alt={car.name}
                                                src={car.images && car.images.length > 0 ? car.images[0].imageUrl : '/placeholder-car.jpg'}
                                                style={{ 
                                                    height: '160px', 
                                                    objectFit: 'cover',
                                                    width: '600px'
                                                }}
                                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                            />
                                            <Tag 
                                                color={getStatusColor(car.status || 'UNKNOWN')} 
                                                style={{ 
                                                    position: 'absolute',
                                                    top: '8px', 
                                                    right: '8px',
                                                    margin: 0, 
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    padding: '2px 6px',
                                                    zIndex: 1
                                                }}
                                            >
                                                {getStatusText(car.status || 'UNKNOWN')}
                                            </Tag>
                                        </div>
                                    }
                                    actions={[
                                        <Tooltip title="Xem chi tiết">
                                            <EyeOutlined 
                                                key="view" 
                                                onClick={() => navigate(`/car-detail/${car.id}`)}
                                                style={{ color: '#1890ff' }}
                                            />
                                        </Tooltip>,
                                        <Tooltip title="Chỉnh sửa">
                                            <EditOutlined 
                                                key="edit" 
                                                onClick={() => navigate(`/edit-car/${car.id}`)}
                                                style={{ color: '#52c41a' }}
                                            />
                                        </Tooltip>,
                                        <Popconfirm
                                            title="Xóa xe"
                                            description="Bạn có chắc chắn muốn xóa xe này không?"
                                            onConfirm={() => handleDeleteCar(car.id)}
                                            okText="Có"
                                            cancelText="Không"
                                            placement="top"
                                        >
                                            <Tooltip title="Xóa xe">
                                                <DeleteOutlined 
                                                    key="delete" 
                                                    style={{ color: '#ff4d4f' }}
                                                />
                                            </Tooltip>
                                        </Popconfirm>
                                    ]}
                                >
                                    <div style={{ padding: '8px 0' }}>
                                        <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                            {car.name}
                                        </Title>
                                        
                                        <div style={{ marginBottom: '8px' }}>
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {car.carBrand?.name} • {car.model} • {car.year}
                                            </Text>
                                        </div>

                                        <div style={{ marginBottom: '8px' }}>
                                            <Space size="small">
                                                <Tag color="blue" style={{ fontSize: '10px' }}>
                                                    {car.seats} ghế
                                                </Tag>
                                                <Tag color="purple" style={{ fontSize: '10px' }}>
                                                    {car.transmission === 'AUTO' ? 'Tự động' : 'Số sàn'}
                                                </Tag>
                                            </Space>
                                        </div>

                                        <Divider style={{ margin: '8px 0' }} />

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
                                                    {formatPrice(car.pricePerHour)}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: '10px', display: 'block' }}>
                                                    /ngày
                                                </Text>
                                            </div>
                                            
                                            <Space direction="vertical" size="small">
                                                {car.status === 'AVAILABLE' ? (
                                                    <Button
                                                        size="small"
                                                        type="default"
                                                        loading={statusLoading[car.id]}
                                                        onClick={() => handleUpdateStatus(car.id, 'UNAVAILABLE')}
                                                        icon={<CloseCircleOutlined />}
                                                        style={{ fontSize: '11px' }}
                                                    >
                                                        Tạm ngưng
                                                    </Button>
                                                ) : car.status === 'UNAVAILABLE' ? (
                                                    <Button
                                                        size="small"
                                                        type="primary"
                                                        loading={statusLoading[car.id]}
                                                        onClick={() => handleUpdateStatus(car.id, 'AVAILABLE')}
                                                        icon={<CheckCircleOutlined />}
                                                        style={{ fontSize: '11px' }}
                                                    >
                                                        Kích hoạt
                                                    </Button>
                                                ) : (
                                                    <Tag color={getStatusColor(car.status)} style={{ fontSize: '11px', margin: 0 }}>
                                                        {getStatusText(car.status)}
                                                    </Tag>
                                                )}
                                            </Space>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        );
    }

    // Full page mode (original implementation)
    if (loading) {
        return (
            <div className="my-cars-page" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Card style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Spin size="large" tip="Đang tải danh sách xe..." />
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-cars-page" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Card style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                        <Title level={4} style={{ color: '#ff4d4f' }}>Lỗi tải dữ liệu</Title>
                        <Text style={{ color: '#666' }}>{error}</Text>
                        <br />
                        <Button 
                            type="primary" 
                            onClick={() => fetchUserCars(user.id)}
                            style={{ marginTop: '16px' }}
                        >
                            Thử lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="my-cars-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Card 
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                <Title level={3} style={{ margin: 0, color: '#1a1a1a' }}>
                                    Xe của tôi
                                </Title>
                            </div>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/owner-car')}
                                style={{
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
                                }}
                            >
                                Thêm xe mới
                            </Button>
                        </div>
                    } 
                    className="my-cars-card"
                    style={{
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: 'none',
                        overflow: 'hidden'
                    }}
                    headStyle={{
                        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                        color: 'white',
                        borderBottom: 'none',
                        padding: '24px'
                    }}
                >
                    {cars.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Bạn chưa có xe nào"
                            style={{ padding: '60px 0' }}
                        >
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/owner-car')}
                                style={{
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                                    border: 'none'
                                }}
                            >
                                Thêm xe đầu tiên
                            </Button>
                        </Empty>
                    ) : (
                        <Row gutter={[24, 24]}>
                            {cars.map((car) => (
                                <Col xs={24} sm={12} lg={8} key={car.id}>
                                    <Card
                                        hoverable
                                        className="car-card"
                                        style={{
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            border: '1px solid #f0f0f0',
                                            overflow: 'hidden'
                                        }}
                                        cover={
                                            <div style={{ position: 'relative' }}>
                                                <Image
                                                    alt={car.name}
                                                    src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder-car.jpg'}
                                                    style={{ 
                                                        height: '200px', 
                                                        objectFit: 'cover',
                                                        width: '100%'
                                                    }}
                                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                                />
                                                <Tag 
                                                    color={getStatusColor(car.status || 'UNKNOWN')} 
                                                    style={{ 
                                                        position: 'absolute',
                                                        top: '8px', 
                                                        right: '8px',
                                                        margin: 0, 
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        zIndex: 1
                                                    }}
                                                >
                                                    {getStatusText(car.status || 'UNKNOWN')}
                                                </Tag>
                                            </div>
                                        }
                                        actions={[
                                            <Tooltip title="Xem chi tiết">
                                                <EyeOutlined 
                                                    key="view" 
                                                    onClick={() => navigate(`/car-detail/${car.id}`)}
                                                    style={{ color: '#1890ff' }}
                                                />
                                            </Tooltip>,
                                            <Tooltip title="Chỉnh sửa">
                                                <EditOutlined 
                                                    key="edit" 
                                                    onClick={() => navigate(`/edit-car/${car.id}`)}
                                                    style={{ color: '#52c41a' }}
                                                />
                                            </Tooltip>,
                                            <Popconfirm
                                                title="Xóa xe"
                                                description="Bạn có chắc chắn muốn xóa xe này không?"
                                                onConfirm={() => handleDeleteCar(car.id)}
                                                okText="Có"
                                                cancelText="Không"
                                                placement="top"
                                            >
                                                <Tooltip title="Xóa xe">
                                                    <DeleteOutlined 
                                                        key="delete" 
                                                        style={{ color: '#ff4d4f' }}
                                                    />
                                                </Tooltip>
                                            </Popconfirm>
                                        ]}
                                    >
                                        <div style={{ padding: '8px 0' }}>
                                            <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                                                {car.name}
                                            </Title>
                                            
                                            <div style={{ marginBottom: '8px' }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {car.carBrand?.name} • {car.model} • {car.year}
                                                </Text>
                                            </div>

                                            <div style={{ marginBottom: '8px' }}>
                                                <Space size="small">
                                                    <Tag color="blue" style={{ fontSize: '11px' }}>
                                                        {car.seats} ghế
                                                    </Tag>
                                                    <Tag color="purple" style={{ fontSize: '11px' }}>
                                                        {car.transmission === 'AUTO' ? 'Tự động' : 'Số sàn'}
                                                    </Tag>
                                                    <Tag color="orange" style={{ fontSize: '11px' }}>
                                                        {car.fuelType === 'GASOLINE' ? 'Xăng' : 
                                                         car.fuelType === 'OIL' ? 'Dầu' :
                                                         car.fuelType === 'ELECTRIC' ? 'Điện' : 'Hybrid'}
                                                    </Tag>
                                                </Space>
                                            </div>

                                            <Divider style={{ margin: '12px 0' }} />

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                                                        {formatPrice(car.pricePerHour)}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                                                        /ngày
                                                    </Text>
                                                </div>
                                                
                                                <Space direction="vertical" size="small">
                                                    {car.status === 'AVAILABLE' ? (
                                                        <Button
                                                            size="small"
                                                            type="default"
                                                            loading={statusLoading[car.id]}
                                                            onClick={() => handleUpdateStatus(car.id, 'UNAVAILABLE')}
                                                            icon={<CloseCircleOutlined />}
                                                            style={{ fontSize: '11px' }}
                                                        >
                                                            Tạm ngưng
                                                        </Button>
                                                    ) : car.status === 'UNAVAILABLE' ? (
                                                        <Button
                                                            size="small"
                                                            type="primary"
                                                            loading={statusLoading[car.id]}
                                                            onClick={() => handleUpdateStatus(car.id, 'AVAILABLE')}
                                                            icon={<CheckCircleOutlined />}
                                                            style={{ fontSize: '11px' }}
                                                        >
                                                            Kích hoạt
                                                        </Button>
                                                    ) : (
                                                        <Tag color={getStatusColor(car.status)} style={{ fontSize: '11px', margin: 0 }}>
                                                            {getStatusText(car.status)}
                                                        </Tag>
                                                    )}
                                                </Space>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MyCars; 