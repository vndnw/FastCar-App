import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Table,
    Tag,
    Avatar,
    Button,
    Spin,
    message
} from 'antd';
import {
    CarOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { carService } from '../../services/carService';
import { bookingService } from '../../services/bookingService';

const { Title, Text } = Typography;

function OwnerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalCars: 0,
        activeCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [myCars, setMyCars] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch cars
            const carsResult = await carService.getCarsByUserId(user.id);
            let cars = [];
            if (carsResult.status === 200 && carsResult.data) {
                cars = Array.isArray(carsResult.data) ? carsResult.data : carsResult.data.content || [];
                setMyCars(cars);
            }

            // Fetch bookings using getOwnerBookings for cars owned by the user
            const bookingsResult = await bookingService.getOwnerBookings(user.id, 0, 50); // Get more bookings for statistics
            let bookings = [];
            if (bookingsResult.status === 200 && bookingsResult.data) {
                bookings = bookingsResult.data.content || [];
                setRecentBookings(bookings.slice(0, 5)); // Get latest 5 bookings for display
            }

            // Calculate statistics
            const activeCars = cars.filter(car => car.status === 'AVAILABLE').length;
            const pendingBookings = bookings.filter(booking => booking.status === 'PENDING').length;
            const totalRevenue = bookings
                .filter(booking => booking.status === 'COMPLETED')
                .reduce((sum, booking) => sum + (booking.rentalPrice || 0), 0);

            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyRevenue = bookings
                .filter(booking => {
                    const bookingDate = new Date(booking.createdAt);
                    return booking.status === 'COMPLETED' &&
                        bookingDate.getMonth() === currentMonth &&
                        bookingDate.getFullYear() === currentYear;
                })
                .reduce((sum, booking) => sum + (booking.rentalPrice || 0), 0);

            setDashboardData({
                totalCars: cars.length,
                activeCars: activeCars,
                totalBookings: bookings.length,
                pendingBookings: pendingBookings,
                totalRevenue: totalRevenue,
                monthlyRevenue: monthlyRevenue
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            message.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statisticsData = [
        {
            title: 'Total Cars',
            value: dashboardData.totalCars,
            prefix: <CarOutlined />,
            suffix: '',
            backgroundColor: '#1890ff',
            trend: '+5%',
            trendUp: true,
        },
        {
            title: 'Active Cars',
            value: dashboardData.activeCars,
            prefix: <CarOutlined />,
            suffix: '',
            backgroundColor: '#52c41a',
            trend: '+3%',
            trendUp: true,
        },
        {
            title: 'Total Bookings',
            value: dashboardData.totalBookings,
            prefix: <CalendarOutlined />,
            suffix: '',
            backgroundColor: '#fa8c16',
            trend: '+12%',
            trendUp: true,
        },
        {
            title: 'Monthly Revenue',
            value: dashboardData.monthlyRevenue,
            prefix: <DollarOutlined />,
            suffix: 'VNĐ',
            backgroundColor: '#722ed1',
            trend: '+8%',
            trendUp: true,
        },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

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

    const bookingColumns = [
        {
            title: 'Booking',
            key: 'booking',
            render: (_, record) => (
                <div>
                    <Text strong>#{record.id}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.bookingCode}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size={32} style={{ backgroundColor: '#1890ff' }}>
                        {record.user?.firstName?.[0] || record.user?.email?.[0] || 'U'}
                    </Avatar>
                    <div>
                        <Text style={{ fontWeight: 500, fontSize: 13 }}>
                            {record.user?.firstName && record.user?.lastName
                                ? `${record.user.firstName} ${record.user.lastName}`
                                : record.user?.email?.split('@')[0] || 'Unknown User'
                            }
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {record.user?.email}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Car',
            key: 'car',
            render: (_, record) => (
                <div>
                    <Text strong>{record.car?.name || 'Unknown Car'}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.car?.carBrand?.name} {record.car?.model}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Tag color={getStatusColor(record.status)}>
                    {record.status}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (_, record) => (
                <Text strong>
                    {formatCurrency(record.rentalPrice || 0)}
                </Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => navigate(`/owner/bookings/${record.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                    Owner Dashboard
                </Title>
                <Text style={{ color: '#6b7280', fontSize: 16 }}>
                    Welcome back! Here's an overview of your car rental business.
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {statisticsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            hoverable
                            style={{
                                background: stat.backgroundColor,
                                border: 'none',
                                borderRadius: 16,
                                overflow: 'hidden',
                                height: 160,
                            }}
                            bodyStyle={{ padding: 24 }}
                        >
                            <div style={{ position: 'relative', height: '100%' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    opacity: 0.2,
                                    fontSize: 48
                                }}>
                                    {stat.prefix}
                                </div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>
                                        {stat.title}
                                    </Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Statistic
                                            value={stat.value}
                                            suffix={stat.suffix}
                                            valueStyle={{
                                                color: 'white',
                                                fontSize: 28,
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4
                                    }}>
                                        {stat.trendUp ? (
                                            <ArrowUpOutlined style={{ color: '#10b981', fontSize: 12 }} />
                                        ) : (
                                            <ArrowDownOutlined style={{ color: '#ef4444', fontSize: 12 }} />
                                        )}
                                        <Text style={{ color: 'white', fontSize: 12, opacity: 0.9 }}>
                                            {stat.trend} vs last month
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Recent Bookings */}
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CalendarOutlined style={{ color: '#1890ff' }} />
                                <span>Recent Bookings</span>
                            </div>
                        }
                        extra={
                            <Button type="primary" onClick={() => navigate('/owner/bookings')}>
                                View All Bookings
                            </Button>
                        }
                        style={{ borderRadius: 12 }}
                    >
                        <Table
                            dataSource={recentBookings}
                            columns={bookingColumns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OwnerDashboard;
