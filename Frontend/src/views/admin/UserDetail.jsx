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
import { userService } from "../../services/userService";
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
                message.error('Failed to fetch user details');
                navigate('/admin/users');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            message.error(error.message || 'Failed to fetch user details');
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's bookings (mock data for now)
    const fetchUserBookings = async () => {
        try {
            setLoadingBookings(true);
            // Mock data - replace with actual API call
            const mockBookings = [
                {
                    id: 1,
                    carName: 'Toyota Camry 2022',
                    bookingDate: '2024-01-15',
                    startDate: '2024-01-20',
                    endDate: '2024-01-25',
                    status: 'completed',
                    totalAmount: 500000
                },
                {
                    id: 2,
                    carName: 'Honda Civic 2023',
                    bookingDate: '2024-02-10',
                    startDate: '2024-02-15',
                    endDate: '2024-02-18',
                    status: 'cancelled',
                    totalAmount: 300000
                }
            ];
            setUserBookings(mockBookings);
        } catch (error) {
            console.error('Error fetching user bookings:', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    // Fetch user's cars (if they are owner)
    const fetchUserCars = async () => {
        try {
            setLoadingCars(true);
            // Mock data - replace with actual API call
            const mockCars = [
                {
                    id: 1,
                    name: 'BMW X5 2023',
                    brand: 'BMW',
                    licensePlate: '30A-12345',
                    status: 'available',
                    totalBookings: 15
                }
            ];
            setUserCars(mockCars);
        } catch (error) {
            console.error('Error fetching user cars:', error);
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

    const getStatusColor = (status) => {
        const colors = {
            'completed': 'green',
            'pending': 'orange',
            'cancelled': 'red',
            'active': 'blue'
        };
        return colors[status] || 'default';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
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

    return (<div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
            <Breadcrumb style={{ marginBottom: '16px' }}>
                <Breadcrumb.Item>
                    <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={handleGoBack}>
                        Users Management
                    </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{user?.firstName} {user?.lastName}</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                        <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                        User Profile Details
                    </Title>
                    <Text type="secondary">Complete information about the user</Text>
                </div>
                <Space>
                    <Button onClick={handleGoBack} size="large">
                        Back
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleEditUser}
                    >
                        Edit User
                    </Button>
                </Space>
            </div>
        </div>

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
                                    <List.Item>
                                        <List.Item.Meta
                                            title={booking.carName}
                                            description={
                                                <div>
                                                    <Text type="secondary">
                                                        {dayjs(booking.startDate).format('DD/MM/YYYY')} - {dayjs(booking.endDate).format('DD/MM/YYYY')}
                                                    </Text>
                                                    <br />
                                                    <Text strong>{formatCurrency(booking.totalAmount)}</Text>
                                                    <Tag color={getStatusColor(booking.status)} style={{ marginLeft: '8px' }}>
                                                        {booking.status.toUpperCase()}
                                                    </Tag>
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
                                            title={car.name}
                                            description={
                                                <div>
                                                    <Text type="secondary">
                                                        {car.brand} • {car.licensePlate}
                                                    </Text>
                                                    <br />
                                                    <Text>Total bookings: {car.totalBookings}</Text>
                                                    <Tag color={getStatusColor(car.status)} style={{ marginLeft: '8px' }}>
                                                        {car.status.toUpperCase()}
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
