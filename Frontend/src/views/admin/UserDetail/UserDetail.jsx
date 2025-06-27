import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    Button,
    Avatar,
    Typography,
    Spin,
    Tag,
    Descriptions,
    Divider,
    message,
    Space,
    Breadcrumb,
    Statistic,
    Timeline,
    List,
    Empty
} from "antd";
import {
    ArrowLeftOutlined,
    UserOutlined,
    EditOutlined,
    KeyOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    BankOutlined,
    CarOutlined,
    HistoryOutlined
} from "@ant-design/icons";
import { userService } from "../../../services/userService";
import { carService } from "../../../services/carService";
import { bookingService } from "../../../services/bookingService";
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function UserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);
    const [userCars, setUserCars] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [loadingCars, setLoadingCars] = useState(false);

    // Fetch user details
    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const result = await userService.getUserById(userId);

            if (result.status === 200) {
                setUser(result.data);
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch user details';
                message.error(errorMessage);
                navigate('/admin/users');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user details';
            message.error(errorMessage);
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's bookings (mock data for now)
    const fetchUserBookings = async () => {
        try {
            setLoadingBookings(true);
            const result = await bookingService.getUserBookingHistory(userId);

            if (result.status === 200 && result.data) {
                // Handle both array response and paginated response
                const bookingsData = Array.isArray(result.data) ? result.data : result.data.content || [];
                setUserBookings(bookingsData);
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch user bookings';
                message.error(errorMessage);
                setUserBookings([]);
            }
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user bookings';
            message.error(errorMessage);
            setUserBookings([]);
        } finally {
            setLoadingBookings(false);
        }
    };

    // Fetch user's cars (if they are owner)
    const fetchUserCars = async () => {
        try {
            setLoadingCars(true);
            const result = await carService.getCarsByUserId(userId);

            if (result.status === 200 && result.data) {
                // Handle both array response and paginated response
                const cars = Array.isArray(result.data) ? result.data : result.data.content || [];
                setUserCars(cars);
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch user cars';
                message.error(errorMessage);
                setUserCars([]);
            }
        } catch (error) {
            console.error('Error fetching user cars:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user cars';
            message.error(errorMessage);
            setUserCars([]);
        } finally {
            setLoadingCars(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
            fetchUserBookings();
            fetchUserCars();
        }
    }, [userId]);

    const handleGoBack = () => {
        navigate('/admin/users');
    };
    const handleEditUser = () => {
        // Navigate to edit user page
        navigate(`/admin/users/edit/${userId}`);
    };

    // Utility functions for booking data
    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': 'orange',
            'CONFIRMED': 'blue',
            'USE_IN': 'cyan',
            'WAITING_REFUND': 'purple',
            'WAITING_EXTRA_CHARGE': 'magenta',
            'CANCELLED': 'red',
            'COMPLETED': 'green',
        };
        return statusColors[status] || 'default';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'Chờ xác nhận',
            'CONFIRMED': 'Đã xác nhận',
            'USE_IN': 'Đang sử dụng',
            'WAITING_REFUND': 'Chờ hoàn tiền',
            'WAITING_EXTRA_CHARGE': 'Chờ thu phí phụ',
            'CANCELLED': 'Đã hủy',
            'COMPLETED': 'Hoàn thành',
        };
        return statusTexts[status] || status;
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0 VNĐ';
        return `${amount.toLocaleString('vi-VN')} VNĐ`;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return dayjs(date).format('DD/MM/YYYY');
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Empty
                    description="User not found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Button type="primary" onClick={handleGoBack}>
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <Card style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={handleGoBack}
                            >
                                Back to Users
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>
                                User Details
                            </Title>
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEditUser}
                        >
                            Edit User
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>
                {/* User Profile Card */}
                <Col xs={24} lg={8}>
                    <Card>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Avatar
                                size={120}
                                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName || 'U'}+${user.lastName || 'ser'}&background=random&size=120`}
                                icon={<UserOutlined />}
                            />
                            <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.email.split('@')[0]
                                }
                            </Title>
                            <div style={{ marginBottom: '16px' }}>
                                {user.roles && user.roles.length > 0 ? (
                                    user.roles.map((role, idx) => (
                                        <Tag key={idx} color={role === 'admin' ? 'red' : role === 'driver' ? 'blue' : 'green'}>
                                            {role.toUpperCase()}
                                        </Tag>
                                    ))
                                ) : (
                                    <Tag color="default">USER</Tag>
                                )}
                            </div>
                            <Tag color={user.active ? 'green' : 'red'} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                {user.active ? 'ACTIVE' : 'INACTIVE'}
                            </Tag>
                        </div>

                        <Divider />

                        {/* Quick Stats */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title="Total Bookings"
                                    value={userBookings.length}
                                    prefix={<CarOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Owned Cars"
                                    value={userCars.length}
                                    prefix={<CarOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>                {/* Detailed Information */}
                <Col xs={24} lg={16}>
                    {/* Personal Information */}
                    <Card title="Personal Information" style={{ marginBottom: '24px' }}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                {user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                                {user.phone || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="First Name">
                                {user.firstName || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Name">
                                {user.lastName || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><CalendarOutlined /> Date of Birth</>}>
                                {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Age">
                                {user.dateOfBirth ? dayjs().diff(dayjs(user.dateOfBirth), 'year') : 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><ClockCircleOutlined /> Created At</>} span={2}>
                                {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated At" span={2}>
                                {dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            {/* Address Information and Bank Information Row */}
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title={<><EnvironmentOutlined /> Address Information</>} style={{ height: '100%' }}>
                        <Descriptions bordered column={1} size="middle">
                            <Descriptions.Item label="Full Address">
                                {user.address?.address || 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title={<><BankOutlined /> Bank Information</>} style={{ height: '100%' }}>
                        <Descriptions bordered column={1} size="middle">
                            <Descriptions.Item label="Bank Name">
                                {user.bankInformation?.bankName || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Account Number">
                                {user.bankInformation?.accountNumber || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Account Holder">
                                {user.bankInformation?.accountHolderName || 'N/A'}
                            </Descriptions.Item>
>>>>>>> 7eeea298b45a5b15b63a76b7438b98c1bc55e104

                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            {/* Booking History */}
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card
                        title={<><HistoryOutlined /> Booking History</>}
                        extra={<Text type="secondary">{userBookings.length} bookings</Text>}
                    >
                        <Spin spinning={loadingBookings}>
                            {userBookings.length > 0 ? (
                                <List
                                    dataSource={userBookings}
                                    renderItem={(booking) => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    size="small"
                                                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text strong>{booking.car?.name || 'N/A'}</Text>
                                                        <Tag color={getStatusColor(booking.status)}>
                                                            {getStatusText(booking.status)}
                                                        </Tag>
                                                    </div>
                                                }
                                                description={
                                                    <div>
                                                        <div style={{ marginBottom: 4 }}>
                                                            <Text code style={{ fontSize: 11 }}>
                                                                {booking.bookingCode}
                                                            </Text>
                                                        </div>
                                                        <div style={{ marginBottom: 4 }}>
                                                            <CalendarOutlined style={{ marginRight: 4 }} />
                                                            <Text type="secondary">
                                                                {formatDate(booking.pickupTime)} - {formatDate(booking.returnTime)}
                                                            </Text>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Text strong style={{ color: '#52c41a' }}>
                                                                {formatCurrency(booking.rentalPrice)}
                                                            </Text>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                {formatDateTime(booking.createdAt)}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty description="No booking history" />
                            )}
                        </Spin>
                    </Card>
                </Col>

                {/* Owned Cars */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<><CarOutlined /> Owned Cars</>}
                        extra={<Text type="secondary">{userCars.length} cars</Text>}
                    >
                        <Spin spinning={loadingCars}>
                            {userCars.length > 0 ? (
                                <List
                                    dataSource={userCars}
                                    renderItem={(car) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>{car.name}</span>
                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            onClick={() => navigate(`/admin/cars/${car.id}`)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                }
                                                description={
                                                    <div>
                                                        <Text type="secondary">
                                                            {car.carBrand?.name || car.brand} {car.model} • {car.licensePlate}
                                                        </Text>
                                                        <br />
                                                        <Text type="secondary">
                                                            {car.year} • {car.seats} seats • {car.transmission}
                                                        </Text>
                                                        <br />
                                                        <Text>
                                                            Price: {car.pricePerHour ? new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(car.pricePerHour) : 'N/A'}/hour
                                                        </Text>
                                                        <Tag color={getStatusColor(car.status)} style={{ marginLeft: '8px' }}>
                                                            {car.status ? car.status.toUpperCase() : 'UNKNOWN'}
                                                        </Tag>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty description="No owned cars" />
                            )}
                        </Spin>
                    </Card>
                </Col>
            </Row>

            {/* Activity Timeline */}
            <Row style={{ marginTop: '24px' }}>
                <Col xs={24}>
                    <Card title={<><ClockCircleOutlined /> Recent Activity</>}>
                        <Timeline>
                            <Timeline.Item color="green">
                                <Text strong>Account created</Text>
                                <br />
                                <Text type="secondary">{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
                            </Timeline.Item>
                            <Timeline.Item color="blue">
                                <Text strong>Profile updated</Text>
                                <br />
                                <Text type="secondary">{dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</Text>
                            </Timeline.Item>
                            {userBookings.length > 0 && (
                                <Timeline.Item color="orange">
                                    <Text strong>Latest booking</Text>
                                    <br />
                                    <Text type="secondary">
                                        {userBookings[0].carName} on {dayjs(userBookings[0].bookingDate).format('DD/MM/YYYY')}
                                    </Text>
                                </Timeline.Item>
                            )}
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default UserDetail;
