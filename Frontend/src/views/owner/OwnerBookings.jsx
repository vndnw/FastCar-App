import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Tag,
    Typography,
    message,
    Avatar,
    Button,
    Space,
    Image,
    Row,
    Col,
    Statistic,
    Modal,
    Form,
    Input,
    Rate,
    Select
} from 'antd';
import {
    EyeOutlined,
    CalendarOutlined,
    LoginOutlined,
    LogoutOutlined,
    ToolOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

function OwnerBookings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Modal states for check-in/check-out
    const [checkInModalVisible, setCheckInModalVisible] = useState(false);
    const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [checkInForm] = Form.useForm();
    const [checkOutForm] = Form.useForm();

    useEffect(() => {
        if (user?.id) {
            fetchBookings();
        }
    }, [user?.id]);

    const fetchBookings = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            console.log('Fetching bookings for user:', user.id, 'page:', page, 'pageSize:', pageSize);

            // Use getOwnerBookings to fetch bookings for all cars owned by the user
            const result = await bookingService.getOwnerBookings(user.id, page - 1, pageSize);
            console.log('API response:', result);

            if (result.status === 200 && result.data) {
                const bookingsData = result.data.content || [];
                console.log('Fetched bookings data:', bookingsData);
                setBookings(bookingsData);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: result.data.totalElements || 0,
                }));

                if (bookingsData.length === 0) {
                    console.log('No bookings found for this user');
                }
            } else {
                console.error('API response error:', result);
                message.error('Failed to fetch bookings');
                setBookings([]);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            message.error('Failed to fetch bookings: ' + error.message);
            setBookings([]);
        } finally {
            setLoading(false);
        }
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const columns = [
        {
            title: 'Booking Info',
            key: 'bookingInfo',
            width: '20%',
            render: (_, record) => (
                <div>
                    <Text strong>#{record.id}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.bookingCode}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {dayjs(record.createdAt).format('DD/MM/YYYY')}
                    </Text>
                    <br />
                    <Tag color={getStatusColor(record.status)} size="small">
                        {record.status}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Customer',
            key: 'customer',
            width: '20%',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>
                        {record.user?.firstName?.[0] || record.user?.email?.[0] || 'U'}
                    </Avatar>
                    <div>
                        <Text strong style={{ fontSize: 13, display: 'block' }}>
                            {record.user?.firstName && record.user?.lastName
                                ? `${record.user.firstName} ${record.user.lastName}`
                                : record.user?.email?.split('@')[0] || 'Unknown User'
                            }
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {record.user?.email}
                        </Text>
                        {record.user?.phone && (
                            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                {record.user.phone}
                            </Text>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Car',
            key: 'car',
            width: '25%',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 6, overflow: 'hidden' }}>
                        {record.car?.images && record.car.images.length > 0 ? (
                            <Image
                                width={50}
                                height={50}
                                src={record.car.images[0].imageUrl || record.car.images[0]}
                                style={{ objectFit: 'cover' }}
                                fallback="data:image/png;base64,..."
                            />
                        ) : (
                            <div style={{
                                width: 50,
                                height: 50,
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 20,
                                color: '#bfbfbf'
                            }}>
                                🚗
                            </div>
                        )}
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 13, display: 'block' }}>
                            {record.car?.name || 'Unknown Car'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                            {record.car?.carBrand?.name} {record.car?.model} ({record.car?.year})
                        </Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>
                            {record.car?.licensePlate}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Rental Period',
            key: 'period',
            width: '20%',
            render: (_, record) => (
                <div>
                    <Text style={{ fontSize: 12, display: 'block' }}>
                        <strong>Pickup:</strong> {dayjs(record.pickupTime).format('DD/MM/YYYY HH:mm')}
                    </Text>
                    <Text style={{ fontSize: 12, display: 'block' }}>
                        <strong>Return:</strong> {dayjs(record.returnTime).format('DD/MM/YYYY HH:mm')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        Duration: {Math.ceil((new Date(record.returnTime) - new Date(record.pickupTime)) / (1000 * 60 * 60 * 24))} days
                    </Text>
                </div>
            ),
        },
        {
            title: 'Amount',
            key: 'amount',
            width: '15%',
            render: (_, record) => (
                <div>
                    <Text strong style={{ fontSize: 12, display: 'block' }}>
                        {formatCurrency(record.rentalPrice || 0)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                        Rental Price
                    </Text>
                    {record.depositAmount > 0 && (
                        <Text style={{ color: '#722ed1', fontSize: 10, display: 'block' }}>
                            Deposit: {formatCurrency(record.depositAmount)}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => navigate(`/owner/bookings/${record.id}`)}
                        style={{ width: '100%' }}
                    >
                        View Details
                    </Button>
                    {record.status === 'CONFIRMED' && (
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            size="small"
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', width: '100%' }}
                            onClick={() => handleCheckIn(record)}
                        >
                            Check In
                        </Button>
                    )}
                    {record.status === 'USE_IN' && (
                        <Button
                            type="primary"
                            icon={<LogoutOutlined />}
                            size="small"
                            style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16', width: '100%' }}
                            onClick={() => handleCheckOut(record)}
                        >
                            Check Out
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const handleCheckIn = (booking) => {
        setSelectedBooking(booking);
        setCheckInModalVisible(true);
        checkInForm.resetFields();
    };

    const handleCheckOut = (booking) => {
        setSelectedBooking(booking);
        setCheckOutModalVisible(true);
        checkOutForm.resetFields();
    };

    const handleCheckInSubmit = async (values) => {
        try {
            const conditionData = {
                checkType: "BEFORE_RENTAL",
                odometer: values.mileage || 0,
                fuelLevel: values.fuelLevel ? values.fuelLevel.toString() : "0",
                interiorStatus: values.notes || "",
                damageNote: values.notes || "",
                imageFrontUrl: "",
                imageRearUrl: "",
                imageLeftUrl: "",
                imageRightUrl: "",
                imageOdoUrl: "",
                imageFuelUrl: "",
                imageOtherUrl: ""
            };

            const result = await bookingService.checkInBooking(selectedBooking.id, conditionData);

            if (result.status === 200) {
                message.success('Check-in completed successfully!');
                setCheckInModalVisible(false);
                fetchBookings();
            } else {
                message.error(result.data?.message || 'Failed to complete check-in');
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            message.error(error.response?.data?.message || 'Failed to complete check-in');
        }
    };

    const handleCheckOutSubmit = async (values) => {
        try {
            const checkoutData = {
                checkType: "AFTER_RENTAL",
                odometer: values.mileage || 0,
                fuelLevel: values.fuelLevel ? values.fuelLevel.toString() : "0",
                interiorStatus: values.notes || "",
                damageNote: values.damageDescription || values.notes || "",
                imageFrontUrl: "",
                imageRearUrl: "",
                imageLeftUrl: "",
                imageRightUrl: "",
                imageOdoUrl: "",
                imageFuelUrl: "",
                imageOtherUrl: "",
                extraCharges: values.extraCharges || 0
            };

            const result = await bookingService.checkOutBooking(selectedBooking.id, checkoutData);

            if (result.status === 200) {
                message.success('Check-out completed successfully!');
                setCheckOutModalVisible(false);
                fetchBookings();
            } else {
                message.error(result.data?.message || 'Failed to complete check-out');
            }
        } catch (error) {
            console.error('Error during check-out:', error);
            message.error(error.response?.data?.message || 'Failed to complete check-out');
        }
    };

    const handleTableChange = (pagination) => {
        fetchBookings(pagination.current, pagination.pageSize);
    };

    // Calculate statistics
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(booking => booking.status === 'CONFIRMED').length;
    const activeBookings = bookings.filter(booking => booking.status === 'USE_IN').length;
    const completedBookings = bookings.filter(booking => booking.status === 'COMPLETED').length;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    Rental Management
                </Title>
                <Text type="secondary">
                    Manage vehicle check-ins and check-outs for your bookings
                </Text>
            </div>

            {/* Statistics Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Bookings"
                            value={totalBookings}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Ready for Check-in"
                            value={confirmedBookings}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Currently Rented"
                            value={activeBookings}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Completed"
                            value={completedBookings}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Bookings Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Check-in Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LoginOutlined style={{ color: '#52c41a' }} />
                        <span>Vehicle Check-in</span>
                    </div>
                }
                open={checkInModalVisible}
                onCancel={() => setCheckInModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedBooking && (
                    <div>
                        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
                            <Text strong>Booking: {selectedBooking.bookingCode}</Text>
                            <br />
                            <Text>Car: {selectedBooking.car?.name}</Text>
                            <br />
                            <Text>Customer: {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</Text>
                        </div>

                        <Form
                            form={checkInForm}
                            layout="vertical"
                            onFinish={handleCheckInSubmit}
                        >
                            <Form.Item
                                name="fuelLevel"
                                label="Fuel Level (%)"
                                rules={[{ required: true, message: 'Please enter fuel level' }]}
                            >
                                <Input type="number" min={0} max={100} placeholder="Enter fuel percentage" />
                            </Form.Item>

                            <Form.Item
                                name="mileage"
                                label="Current Odometer (km)"
                                rules={[{ required: true, message: 'Please enter current odometer reading' }]}
                            >
                                <Input type="number" min={0} placeholder="Enter current odometer reading" />
                            </Form.Item>

                            <Form.Item
                                name="notes"
                                label="Interior Status & Damage Notes"
                                rules={[{ required: true, message: 'Please enter vehicle condition notes' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Describe interior condition, any existing damage, and additional observations..." />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => setCheckInModalVisible(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                                        Complete Check-in
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>

            {/* Check-out Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LogoutOutlined style={{ color: '#fa8c16' }} />
                        <span>Vehicle Check-out</span>
                    </div>
                }
                open={checkOutModalVisible}
                onCancel={() => setCheckOutModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedBooking && (
                    <div>
                        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
                            <Text strong>Booking: {selectedBooking.bookingCode}</Text>
                            <br />
                            <Text>Car: {selectedBooking.car?.name}</Text>
                            <br />
                            <Text>Customer: {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</Text>
                        </div>

                        <Form
                            form={checkOutForm}
                            layout="vertical"
                            onFinish={handleCheckOutSubmit}
                        >
                            <Form.Item
                                name="fuelLevel"
                                label="Return Fuel Level (%)"
                                rules={[{ required: true, message: 'Please enter fuel level' }]}
                            >
                                <Input type="number" min={0} max={100} placeholder="Enter fuel percentage" />
                            </Form.Item>

                            <Form.Item
                                name="mileage"
                                label="Return Odometer (km)"
                                rules={[{ required: true, message: 'Please enter return odometer reading' }]}
                            >
                                <Input type="number" min={0} placeholder="Enter return odometer reading" />
                            </Form.Item>

                            <Form.Item
                                name="extraCharges"
                                label="Extra Charges (VND)"
                            >
                                <Input type="number" min={0} placeholder="Enter any extra charges" />
                            </Form.Item>

                            <Form.Item
                                name="damageDescription"
                                label="Damage Description"
                            >
                                <Input.TextArea rows={2} placeholder="Describe any damages found..." />
                            </Form.Item>

                            <Form.Item
                                name="notes"
                                label="Interior Status & Additional Notes"
                                rules={[{ required: true, message: 'Please enter vehicle condition notes' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Describe interior condition and any additional observations..." />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => setCheckOutModalVisible(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                                        Complete Check-out
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default OwnerBookings;
