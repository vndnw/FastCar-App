import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Descriptions,
    Tag,
    Button,
    Space,
    Typography,
    Image,
    Row,
    Col,
    Timeline,
    message,
    Modal,
    Form,
    Rate,
    Input,
    Divider
} from 'antd';
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    CarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    LoginOutlined,
    LogoutOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { bookingService } from '../../services/bookingService';

const { Title, Text } = Typography;

function OwnerBookingDetail() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInModalVisible, setCheckInModalVisible] = useState(false);
    const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);
    const [checkInForm] = Form.useForm();
    const [checkOutForm] = Form.useForm();

    useEffect(() => {
        fetchBookingDetail();
    }, [bookingId]);

    const fetchBookingDetail = async () => {
        try {
            setLoading(true);
            const result = await bookingService.getBookingById(bookingId);

            if (result.status === 200 && result.data) {
                setBooking(result.data);
            } else {
                message.error('Failed to fetch booking details');
                navigate('/owner/bookings');
            }
        } catch (error) {
            console.error('Error fetching booking detail:', error);
            message.error('Failed to fetch booking details');
            navigate('/owner/bookings');
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

    const handleCheckIn = () => {
        setCheckInModalVisible(true);
        checkInForm.resetFields();
    };

    const handleCheckOut = () => {
        setCheckOutModalVisible(true);
        checkOutForm.resetFields();
    };

    const handleCheckInSubmit = async (values) => {
        try {
            const conditionData = {
                exteriorCondition: values.exteriorCondition,
                interiorCondition: values.interiorCondition,
                engineCondition: values.engineCondition,
                notes: values.notes || '',
                fuelLevel: values.fuelLevel,
                mileage: values.mileage
            };

            const result = await bookingService.checkInBooking(booking.id, conditionData);

            if (result.status === 200) {
                message.success('Check-in completed successfully!');
                setCheckInModalVisible(false);
                fetchBookingDetail();
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
                exteriorCondition: values.exteriorCondition,
                interiorCondition: values.interiorCondition,
                engineCondition: values.engineCondition,
                notes: values.notes || '',
                fuelLevel: values.fuelLevel,
                mileage: values.mileage,
                extraCharges: values.extraCharges || 0,
                damageDescription: values.damageDescription || ''
            };

            const result = await bookingService.checkOutBooking(booking.id, checkoutData);

            if (result.status === 200) {
                message.success('Check-out completed successfully!');
                setCheckOutModalVisible(false);
                fetchBookingDetail();
            } else {
                message.error(result.data?.message || 'Failed to complete check-out');
            }
        } catch (error) {
            console.error('Error during check-out:', error);
            message.error(error.response?.data?.message || 'Failed to complete check-out');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text>Loading booking details...</Text>
            </div>
        );
    }

    if (!booking) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text>Booking not found</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/owner/bookings')}
                    >
                        Back to Bookings
                    </Button>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            Booking #{booking.id}
                        </Title>
                        <Text type="secondary">{booking.bookingCode}</Text>
                    </div>
                </div>
                <Tag color={getStatusColor(booking.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {booking.status}
                </Tag>
            </div>

            <Row gutter={24}>
                {/* Left Column - Booking Information */}
                <Col xs={24} lg={16}>
                    {/* Customer Information */}
                    <Card title="Customer Information" style={{ marginBottom: 24 }}>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Name">
                                {booking.user?.firstName} {booking.user?.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {booking.user?.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone">
                                {booking.user?.phone || 'Not provided'}
                            </Descriptions.Item>
                            <Descriptions.Item label="ID Number">
                                {booking.user?.idNumber || 'Not provided'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Vehicle Information */}
                    <Card title="Vehicle Information" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                {booking.car?.images && booking.car.images.length > 0 && (
                                    <Image
                                        width="100%"
                                        height={200}
                                        src={booking.car.images[0].imageUrl || booking.car.images[0]}
                                        style={{ objectFit: 'cover', borderRadius: 8 }}
                                        fallback="data:image/png;base64,..."
                                    />
                                )}
                            </Col>
                            <Col xs={24} sm={16}>
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Vehicle">
                                        <Text strong>{booking.car?.name}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Brand & Model">
                                        {booking.car?.carBrand?.name} {booking.car?.model} ({booking.car?.year})
                                    </Descriptions.Item>
                                    <Descriptions.Item label="License Plate">
                                        <Tag color="blue">{booking.car?.licensePlate}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Type">
                                        {booking.car?.carType} • {booking.car?.seats} seats • {booking.car?.transmission}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Card>

                    {/* Rental Details */}
                    <Card title="Rental Details" style={{ marginBottom: 24 }}>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Pickup Time">
                                <CalendarOutlined style={{ marginRight: 8 }} />
                                {dayjs(booking.pickupTime).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Return Time">
                                <CalendarOutlined style={{ marginRight: 8 }} />
                                {dayjs(booking.returnTime).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration">
                                {Math.ceil((new Date(booking.returnTime) - new Date(booking.pickupTime)) / (1000 * 60 * 60 * 24))} days
                            </Descriptions.Item>
                            <Descriptions.Item label="Pickup Location">
                                <EnvironmentOutlined style={{ marginRight: 8 }} />
                                {booking.pickupLocation?.address || 'Not specified'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Rental Price">
                                <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                                    {formatCurrency(booking.rentalPrice || 0)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Deposit">
                                {formatCurrency(booking.depositAmount || 0)}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Right Column - Actions & Timeline */}
                <Col xs={24} lg={8}>
                    {/* Actions */}
                    <Card title="Actions" style={{ marginBottom: 24 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {booking.status === 'CONFIRMED' && (
                                <Button
                                    type="primary"
                                    icon={<LoginOutlined />}
                                    size="large"
                                    style={{ width: '100%', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                    onClick={handleCheckIn}
                                >
                                    Check In Vehicle
                                </Button>
                            )}
                            {booking.status === 'USE_IN' && (
                                <Button
                                    type="primary"
                                    icon={<LogoutOutlined />}
                                    size="large"
                                    style={{ width: '100%', backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                                    onClick={handleCheckOut}
                                >
                                    Check Out Vehicle
                                </Button>
                            )}
                        </Space>
                    </Card>

                    {/* Booking Timeline */}
                    <Card title="Booking Timeline">
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    children: (
                                        <div>
                                            <Text strong>Booking Created</Text>
                                            <br />
                                            <Text type="secondary">
                                                {dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        </div>
                                    ),
                                },
                                booking.status !== 'PENDING' && {
                                    color: booking.status === 'CANCELLED' ? 'red' : 'blue',
                                    children: (
                                        <div>
                                            <Text strong>
                                                {booking.status === 'CANCELLED' ? 'Booking Cancelled' : 'Booking Confirmed'}
                                            </Text>
                                            <br />
                                            <Text type="secondary">
                                                {dayjs(booking.updatedAt).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        </div>
                                    ),
                                },
                                booking.status === 'USE_IN' && {
                                    color: 'cyan',
                                    children: (
                                        <div>
                                            <Text strong>Vehicle Checked In</Text>
                                            <br />
                                            <Text type="secondary">Rental period started</Text>
                                        </div>
                                    ),
                                },
                                booking.status === 'COMPLETED' && {
                                    color: 'green',
                                    children: (
                                        <div>
                                            <Text strong>Vehicle Checked Out</Text>
                                            <br />
                                            <Text type="secondary">Rental completed</Text>
                                        </div>
                                    ),
                                },
                            ].filter(Boolean)}
                        />
                    </Card>
                </Col>
            </Row>

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
                <Form
                    form={checkInForm}
                    layout="vertical"
                    onFinish={handleCheckInSubmit}
                >
                    <Form.Item
                        name="exteriorCondition"
                        label="Exterior Condition"
                        rules={[{ required: true, message: 'Please rate exterior condition' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="interiorCondition"
                        label="Interior Condition"
                        rules={[{ required: true, message: 'Please rate interior condition' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="engineCondition"
                        label="Engine Condition"
                        rules={[{ required: true, message: 'Please rate engine condition' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="fuelLevel"
                        label="Fuel Level (%)"
                        rules={[{ required: true, message: 'Please enter fuel level' }]}
                    >
                        <Input type="number" min={0} max={100} placeholder="Enter fuel percentage" />
                    </Form.Item>

                    <Form.Item
                        name="mileage"
                        label="Current Mileage (km)"
                        rules={[{ required: true, message: 'Please enter current mileage' }]}
                    >
                        <Input type="number" min={0} placeholder="Enter current mileage" />
                    </Form.Item>

                    <Form.Item
                        name="notes"
                        label="Additional Notes"
                    >
                        <Input.TextArea rows={3} placeholder="Any additional observations or notes..." />
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
                <Form
                    form={checkOutForm}
                    layout="vertical"
                    onFinish={handleCheckOutSubmit}
                >
                    <Form.Item
                        name="exteriorCondition"
                        label="Exterior Condition"
                        rules={[{ required: true, message: 'Please rate exterior condition' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="interiorCondition"
                        label="Interior Condition"
                        rules={[{ required: true, message: 'Please rate interior condition' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="engineCondition"
                        label="Engine Condition"
                        rules={[{ required: true, message: 'Please rate engine condition' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="fuelLevel"
                        label="Return Fuel Level (%)"
                        rules={[{ required: true, message: 'Please enter fuel level' }]}
                    >
                        <Input type="number" min={0} max={100} placeholder="Enter fuel percentage" />
                    </Form.Item>

                    <Form.Item
                        name="mileage"
                        label="Return Mileage (km)"
                        rules={[{ required: true, message: 'Please enter return mileage' }]}
                    >
                        <Input type="number" min={0} placeholder="Enter return mileage" />
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
                        label="Additional Notes"
                    >
                        <Input.TextArea rows={3} placeholder="Any additional observations or notes..." />
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
            </Modal>
        </div>
    );
}

export default OwnerBookingDetail;
