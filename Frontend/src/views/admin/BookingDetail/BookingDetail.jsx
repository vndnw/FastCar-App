import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Descriptions,
    Button,
    Tag,
    message,
    Spin,
    Image,
    Typography,
    Timeline,
    Divider,
    Space,
    Popconfirm
} from 'antd';
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    UserOutlined,
    CarOutlined,
    CalendarOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import { bookingService } from '../../../services/bookingService';
import dayjs from 'dayjs';
import Meta from '../../../components/Meta';

const { Title, Text } = Typography;

const BookingDetail = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

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
                const errorMessage = result.data?.message || 'Failed to fetch booking details';
                message.error(errorMessage);
                navigate('/admin/bookings');
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch booking details';
            message.error(errorMessage);
            navigate('/admin/bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        try {
            setActionLoading(true);
            const result = await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');

            if (result.status === 200) {
                message.success('Booking confirmed successfully');
                fetchBookingDetail(); // Refresh data
            } else {
                const errorMessage = result.data?.message || 'Failed to confirm booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm booking';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        try {
            setActionLoading(true);
            const result = await bookingService.cancelBooking(bookingId, 'Cancelled by admin');

            if (result.status === 200) {
                message.success('Booking cancelled successfully');
                fetchBookingDetail(); // Refresh data
            } else {
                const errorMessage = result.data?.message || 'Failed to cancel booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel booking';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteBooking = async () => {
        try {
            setActionLoading(true);
            const result = await bookingService.updateBookingStatus(bookingId, 'COMPLETED');

            if (result.status === 200) {
                message.success('Booking completed successfully');
                fetchBookingDetail(); // Refresh data
            } else {
                const errorMessage = result.data?.message || 'Failed to complete booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error completing booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to complete booking';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartUsing = async () => {
        try {
            setActionLoading(true);
            const result = await bookingService.updateBookingStatus(bookingId, 'USE_IN');

            if (result.status === 200) {
                message.success('Booking started successfully');
                fetchBookingDetail(); // Refresh data
            } else {
                const errorMessage = result.data?.message || 'Failed to start booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error starting booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to start booking';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleProcessRefund = async () => {
        try {
            setActionLoading(true);
            const result = await bookingService.processRefund(bookingId);

            if (result.status === 200) {
                message.success('Refund processed successfully');
                fetchBookingDetail(); // Refresh data
            } else {
                const errorMessage = result.data?.message || 'Failed to process refund';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to process refund';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleProcessExtraCharge = async () => {
        try {
            setActionLoading(true);
            const result = await bookingService.applyExtraCharge(bookingId);

            if (result.status === 200) {
                message.success('Extra charge processed successfully');
                fetchBookingDetail(); // Refresh data
            } else {
                const errorMessage = result.data?.message || 'Failed to process extra charge';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error processing extra charge:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to process extra charge';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
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

    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'Pending',
            'CONFIRMED': 'Confirmed',
            'USE_IN': 'In Use',
            'WAITING_REFUND': 'Waiting Refund',
            'WAITING_EXTRA_CHARGE': 'Waiting Extra Charge',
            'CANCELLED': 'Cancelled',
            'COMPLETED': 'Completed',
        };
        return statusTexts[status] || status;
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0 VNĐ';
        return `${amount.toLocaleString('vi-VN')} VNĐ`;
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return dayjs(date).format('DD/MM/YYYY');
    };

    const getTimelineItems = () => {
        if (!booking) return [];

        const items = [
            {
                color: 'green',
                children: (
                    <div>
                        <Text strong>Booking Created</Text>
                        <br />
                        <Text type="secondary">{formatDateTime(booking.createdAt)}</Text>
                    </div>
                ),
            },
        ];

        if (booking.status === 'CONFIRMED' || booking.status === 'USE_IN' || booking.status === 'WAITING_REFUND' || booking.status === 'WAITING_EXTRA_CHARGE' || booking.status === 'COMPLETED') {
            items.push({
                color: 'blue',
                children: (
                    <div>
                        <Text strong>Confirmed</Text>
                        <br />
                        <Text type="secondary">{formatDateTime(booking.updatedAt)}</Text>
                    </div>
                ),
            });
        }

        if (booking.status === 'USE_IN' || booking.status === 'WAITING_REFUND' || booking.status === 'WAITING_EXTRA_CHARGE' || booking.status === 'COMPLETED') {
            items.push({
                color: 'cyan',
                children: (
                    <div>
                        <Text strong>In Use</Text>
                        <br />
                        <Text type="secondary">{formatDate(booking.pickupTime)}</Text>
                    </div>
                ),
            });
        }

        if (booking.status === 'WAITING_REFUND') {
            items.push({
                color: 'purple',
                children: (
                    <div>
                        <Text strong>Waiting Refund</Text>
                        <br />
                        <Text type="secondary">{formatDateTime(booking.updatedAt)}</Text>
                    </div>
                ),
            });
        }

        if (booking.status === 'WAITING_EXTRA_CHARGE') {
            items.push({
                color: 'magenta',
                children: (
                    <div>
                        <Text strong>Waiting Extra Charge</Text>
                        <br />
                        <Text type="secondary">{formatDateTime(booking.updatedAt)}</Text>
                    </div>
                ),
            });
        }

        if (booking.status === 'COMPLETED') {
            items.push({
                color: 'green',
                children: (
                    <div>
                        <Text strong>Completed</Text>
                        <br />
                        <Text type="secondary">{formatDate(booking.returnTime)}</Text>
                    </div>
                ),
            });
        }

        if (booking.status === 'CANCELLED') {
            items.push({
                color: 'red',
                children: (
                    <div>
                        <Text strong>Cancelled</Text>
                        <br />
                        <Text type="secondary">{formatDateTime(booking.updatedAt)}</Text>
                    </div>
                ),
            });
        }

        return items;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text>Booking not found</Text>
                <br />
                <Button type="primary" onClick={() => navigate('/admin/bookings')} style={{ marginTop: 16 }}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <>
            <Meta
                title={`Booking Details #${booking?.id || 'Booking'} - Admin Dashboard`}
                description={`Detailed view of booking information, customer details, and reservation status for booking #${booking?.id || 'this booking'}`}
            />
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/admin/bookings')}
                        style={{ marginBottom: 16 }}
                    >
                        Back
                    </Button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                Booking Details #{booking.id}
                            </Title>
                            <Tag color={getStatusColor(booking.status)} style={{ marginTop: 8, fontSize: 14 }}>
                                {getStatusText(booking.status)}
                            </Tag>
                        </div>

                        <Space>
                            {booking.status === 'PENDING' && (
                                <>
                                    <Popconfirm
                                        title="Confirm this booking?"
                                        onConfirm={handleConfirmBooking}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            loading={actionLoading}
                                        >
                                            Confirm
                                        </Button>
                                    </Popconfirm>

                                    <Popconfirm
                                        title="Cancel this booking?"
                                        onConfirm={handleCancelBooking}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            danger
                                            icon={<CloseOutlined />}
                                            loading={actionLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </Popconfirm>
                                </>
                            )}

                            {booking.status === 'CONFIRMED' && (
                                <Popconfirm
                                    title="Start using this car?"
                                    onConfirm={handleStartUsing}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        loading={actionLoading}
                                    >
                                        Start Using
                                    </Button>
                                </Popconfirm>
                            )}

                            {booking.status === 'USE_IN' && (
                                <Popconfirm
                                    title="Complete this booking?"
                                    onConfirm={handleCompleteBooking}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        loading={actionLoading}
                                    >
                                        Complete
                                    </Button>
                                </Popconfirm>
                            )}

                            {booking.status === 'WAITING_REFUND' && (
                                <Popconfirm
                                    title="Process refund for this booking?"
                                    onConfirm={handleProcessRefund}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="primary"
                                        icon={<DollarOutlined />}
                                        loading={actionLoading}
                                    >
                                        Process Refund
                                    </Button>
                                </Popconfirm>
                            )}

                            {booking.status === 'WAITING_EXTRA_CHARGE' && (
                                <Popconfirm
                                    title="Process extra charge for this booking?"
                                    onConfirm={handleProcessExtraCharge}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="primary"
                                        icon={<DollarOutlined />}
                                        loading={actionLoading}
                                    >
                                        Process Extra Charge
                                    </Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </div>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Customer Information */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <UserOutlined />
                                    <span>Customer Information</span>
                                </div>
                            }
                        >
                            <Descriptions column={1} size="middle">
                                <Descriptions.Item label="Full Name">
                                    <Text strong>
                                        {booking.user?.firstName} {booking.user?.lastName}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <MailOutlined />
                                        <Text>{booking.user?.email}</Text>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone Number">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <PhoneOutlined />
                                        <Text>{booking.user?.phone || 'N/A'}</Text>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Date of Birth">
                                    <Text>{booking.user?.dateOfBirth ? dayjs(booking.user.dateOfBirth).format('DD/MM/YYYY') : 'N/A'}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    {/* Car Information */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CarOutlined />
                                    <span>Car Information</span>
                                </div>
                            }
                        >
                            {booking.car?.images && booking.car.images.length > 0 && (
                                <div style={{ marginBottom: 16, textAlign: 'center' }}>
                                    <Image
                                        width="100%"
                                        height={200}
                                        src={booking.car.images[0].imageUrl}
                                        style={{ borderRadius: 8, objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <Descriptions column={1} size="middle">
                                <Descriptions.Item label="Car Name">
                                    <Text strong>{booking.car?.name}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Car Brand">
                                    <Text>{booking.car?.carBrand?.name}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="License Plate">
                                    <Text>{booking.car?.licensePlate || 'N/A'}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Rental Price">
                                    <Text strong style={{ color: '#52c41a' }}>
                                        {formatCurrency(booking.car?.pricePerHour)}/hour
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    {/* Booking Details */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CalendarOutlined />
                                    <span>Booking Details</span>
                                </div>
                            }
                        >
                            <Descriptions column={1} size="middle">
                                <Descriptions.Item label="Pickup Time">
                                    <Text strong>{formatDate(booking.pickupTime)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Return Time">
                                    <Text strong>{formatDate(booking.returnTime)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Pickup Location">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <EnvironmentOutlined />
                                        <Text>{booking.location?.address || 'N/A'}</Text>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Booking Code">
                                    <Text code style={{ color: '#1890ff' }}>
                                        {booking.bookingCode}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Rental Fee">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <DollarOutlined style={{ color: '#52c41a' }} />
                                        <Text strong style={{ color: '#52c41a', fontSize: 18 }}>
                                            {formatCurrency(booking.rentalPrice)}
                                        </Text>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Reservation Fee">
                                    <Text>{formatCurrency(booking.reservationFee)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Deposit Amount">
                                    <Text>{formatCurrency(booking.depositAmount)}</Text>
                                </Descriptions.Item>
                                {booking.discountCode && (
                                    <Descriptions.Item label="Discount Code">
                                        <Text code style={{ color: '#52c41a' }}>
                                            {booking.discountCode}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {booking.totalDiscount > 0 && (
                                    <Descriptions.Item label="Total Discount">
                                        <Text style={{ color: '#52c41a' }}>
                                            -{formatCurrency(booking.totalDiscount)}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {booking.totalExtraCharges > 0 && (
                                    <Descriptions.Item label="Extra Charges">
                                        <Text style={{ color: '#f5222d' }}>
                                            +{formatCurrency(booking.totalExtraCharges)}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                {booking.totalRefunded > 0 && (
                                    <Descriptions.Item label="Total Refunded">
                                        <Text style={{ color: '#1890ff' }}>
                                            {formatCurrency(booking.totalRefunded)}
                                        </Text>
                                    </Descriptions.Item>
                                )}
                                <Descriptions.Item label="Created Date">
                                    <Text>{formatDateTime(booking.createdAt)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Last Updated">
                                    <Text>{formatDateTime(booking.updatedAt)}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    {/* Timeline */}
                    <Col xs={24} lg={12}>
                        <Card title="Status History">
                            <Timeline items={getTimelineItems()} />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BookingDetail;
