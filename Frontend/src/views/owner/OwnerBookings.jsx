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
    Select,
    Upload
} from 'antd';
import {
    EyeOutlined,
    CalendarOutlined,
    LoginOutlined,
    LogoutOutlined,
    ToolOutlined,
    CheckCircleOutlined,
    UploadOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import { imageService } from '../../services/imageService';
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
    const [uploadedImages, setUploadedImages] = useState([]);
    const [extraCharges, setExtraCharges] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetchBookings();
        }
    }, [user?.id]);

    const fetchBookings = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);

            // Use getOwnerBookings to fetch bookings for all cars owned by the user
            const result = await bookingService.getOwnerBookings(user.id, page - 1, pageSize);

            if (result.status === 200 && result.data) {
                const bookingsData = result.data.content || [];
                setBookings(bookingsData);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: result.data.totalElements || 0,
                }));
            } else {
                message.error('Failed to fetch bookings');
                setBookings([]);
            }
        } catch (error) {
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
        setUploadedImages([]);
    };

    const handleCheckOut = (booking) => {
        setSelectedBooking(booking);
        setCheckOutModalVisible(true);
        checkOutForm.resetFields();
        setExtraCharges([]);
    };
    const handleCheckInSubmit = async (values) => {
        try {
            const conditionData = {
                checkType: "BEFORE_RENTAL",
                odometer: values.mileage || 0,
                fuelLevel: values.fuelLevel ? values.fuelLevel.toString() : "0",
                interiorStatus: values.notes || "",
                damageNote: values.notes || ""
            };

            // Lấy danh sách file ảnh
            const imageFiles = uploadedImages.map(item => item.originFileObj).filter(Boolean);

            // Gửi FormData qua service
            const result = await bookingService.checkInBooking(selectedBooking.id, conditionData, imageFiles);

            if (result.status === 201) {
                message.success('Check-in completed successfully!');
                setCheckInModalVisible(false);
                setUploadedImages([]);
                fetchBookings();
            } else {
                message.error(result.data?.message || 'Failed to complete check-in');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to complete check-in');
        }
    };


    const handleCheckOutSubmit = async (values) => {
        try {
            // Prepare checkout request data
            const checkoutRequest = {
                note: values.notes || 'Checkout after rental',
                carConditionCheck: {
                    checkType: 'AFTER_RENTAL',
                    odometer: parseInt(values.mileage) || 0,
                    fuelLevel: values.fuelLevel ? values.fuelLevel.toString() : '0',
                    interiorStatus: values.interiorStatus || 'Normal',
                    damageNote: values.damageDescription || values.notes || ''
                },
                extraCharges: extraCharges.map(charge => ({
                    reason: charge.reason,
                    amount: parseFloat(charge.amount) || 0,
                    image: charge.image || ''
                }))
            };

            const result = await bookingService.checkOutBooking(selectedBooking.id, checkoutRequest);

            if (result.status === 200) {
                message.success('Check-out completed successfully!');
                setCheckOutModalVisible(false);
                setExtraCharges([]);
                fetchBookings();
            } else {
                message.error(result.data?.message || 'Failed to complete check-out');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to complete check-out');
        }
    };

    const handleTableChange = (pagination) => {
        fetchBookings(pagination.current, pagination.pageSize);
    };

    // Image upload handlers
    const handleImageChange = ({ fileList }) => {
        setUploadedImages(fileList);
    };

    const addExtraCharge = () => {
        setExtraCharges([...extraCharges, { reason: '', amount: 0, image: '' }]);
    };

    const removeExtraCharge = (index) => {
        const newCharges = extraCharges.filter((_, i) => i !== index);
        setExtraCharges(newCharges);
    };

    const updateExtraCharge = (index, field, value) => {
        const newCharges = [...extraCharges];
        newCharges[index] = { ...newCharges[index], [field]: value };
        setExtraCharges(newCharges);
    };

    const uploadExtraChargeImage = async (file, index) => {
        try {
            const uploadResult = await imageService.uploadImage(file);

            if (uploadResult.status === 200 && uploadResult.data) {
                const imageUrl = uploadResult.data.imageUrl || uploadResult.data.url || uploadResult.data;
                updateExtraCharge(index, 'image', imageUrl);
                message.success('Image uploaded successfully!');
                return imageUrl;
            } else {
                message.error('Failed to upload image');
            }
        } catch (error) {
            message.error('Failed to upload image: ' + error.message);
        }
        return null;
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
            return false;
        }
        return false; // Prevent automatic upload
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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
                onCancel={() => {
                    setCheckInModalVisible(false);
                    setUploadedImages([]);
                }}
                footer={null}
                width={600}
            >
                {selectedBooking && (
                    <div>
                        {/* Booking Information Card */}
                        <Card
                            size="small"
                            style={{
                                marginBottom: 20,
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #e3f2fd'
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text strong style={{ color: '#1976d2' }}>Booking Code:</Text>
                                    <br />
                                    <Text>{selectedBooking.bookingCode}</Text>
                                </Col>
                                <Col span={8}>
                                    <Text strong style={{ color: '#1976d2' }}>Vehicle:</Text>
                                    <br />
                                    <Text>{selectedBooking.car?.name}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {selectedBooking.car?.licensePlate}
                                    </Text>
                                </Col>
                                <Col span={8}>
                                    <Text strong style={{ color: '#1976d2' }}>Customer:</Text>
                                    <br />
                                    <Text>{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {selectedBooking.user?.phone}
                                    </Text>
                                </Col>
                            </Row>
                        </Card>

                        <Form
                            form={checkInForm}
                            layout="vertical"
                            onFinish={handleCheckInSubmit}
                        >
                            {/* Vehicle Condition Section */}
                            <Card
                                title={
                                    <span style={{ color: '#1976d2' }}>
                                        <ToolOutlined style={{ marginRight: 8 }} />
                                        Vehicle Condition Check
                                    </span>
                                }
                                size="small"
                                style={{ marginBottom: 16 }}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="fuelLevel"
                                            label="Fuel Level (%)"
                                            rules={[
                                                { required: true, message: 'Please enter fuel level' },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value) return Promise.resolve();
                                                        const num = Number(value);
                                                        if (isNaN(num)) {
                                                            return Promise.reject(new Error('Please enter a valid number'));
                                                        }
                                                        if (num < 0 || num > 100) {
                                                            return Promise.reject(new Error('Fuel level must be between 0-100%'));
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                placeholder="Enter fuel percentage"
                                                suffix="%"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="mileage"
                                            label="Current Odometer (km)"
                                            rules={[
                                                { required: true, message: 'Please enter current odometer reading' },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value) return Promise.resolve();
                                                        const num = Number(value);
                                                        if (isNaN(num)) {
                                                            return Promise.reject(new Error('Please enter a valid number'));
                                                        }
                                                        if (num < 0) {
                                                            return Promise.reject(new Error('Odometer must be a positive number'));
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Enter current odometer reading"
                                                suffix="km"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="notes"
                                    label="Interior Status & Damage Notes"
                                    rules={[{ required: true, message: 'Please enter vehicle condition notes' }]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Describe interior condition, any existing damage, and additional observations..."
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>
                            </Card>

                            {/* Photo Documentation Section */}
                            <Card
                                title={
                                    <span style={{ color: '#1976d2' }}>
                                        <UploadOutlined style={{ marginRight: 8 }} />
                                        Photo Documentation
                                    </span>
                                }
                                size="small"
                                style={{ marginBottom: 20 }}
                            >
                                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                                    Upload photos of the vehicle before rental (exterior, interior, dashboard, any existing damage)
                                </Text>

                                <Upload
                                    multiple
                                    listType="picture-card"
                                    fileList={uploadedImages}
                                    onChange={handleImageChange}
                                    beforeUpload={beforeUpload}
                                    accept="image/*"
                                >
                                    {uploadedImages.length >= 8 ? null : uploadButton}
                                </Upload>

                                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                                    Maximum 8 photos, each under 5MB (JPG, PNG formats only)
                                </Text>
                            </Card>

                            {/* Action Buttons */}
                            <div style={{
                                textAlign: 'right',
                                padding: '16px 0',
                                borderTop: '1px solid #f0f0f0',
                                marginTop: 16
                            }}>
                                <Space size="middle">
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            setCheckInModalVisible(false);
                                            setUploadedImages([]);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        icon={<CheckCircleOutlined />}
                                        style={{
                                            backgroundColor: '#52c41a',
                                            borderColor: '#52c41a',
                                            minWidth: 140
                                        }}
                                    >
                                        Complete Check-in
                                    </Button>
                                </Space>
                            </div>
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
                onCancel={() => {
                    setCheckOutModalVisible(false);
                    setExtraCharges([]);
                }}
                footer={null}
                width={700}
            >
                {selectedBooking && (
                    <div>
                        {/* Booking Information Card */}
                        <Card
                            size="small"
                            style={{
                                marginBottom: 20,
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #fff3cd'
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text strong style={{ color: '#856404' }}>Booking Code:</Text>
                                    <br />
                                    <Text>{selectedBooking.bookingCode}</Text>
                                </Col>
                                <Col span={8}>
                                    <Text strong style={{ color: '#856404' }}>Vehicle:</Text>
                                    <br />
                                    <Text>{selectedBooking.car?.name}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {selectedBooking.car?.licensePlate}
                                    </Text>
                                </Col>
                                <Col span={8}>
                                    <Text strong style={{ color: '#856404' }}>Customer:</Text>
                                    <br />
                                    <Text>{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {selectedBooking.user?.phone}
                                    </Text>
                                </Col>
                            </Row>
                        </Card>

                        <Form
                            form={checkOutForm}
                            layout="vertical"
                            onFinish={handleCheckOutSubmit}
                        >
                            {/* Vehicle Condition Section */}
                            <Card
                                title={
                                    <span style={{ color: '#856404' }}>
                                        <ToolOutlined style={{ marginRight: 8 }} />
                                        Vehicle Return Condition
                                    </span>
                                }
                                size="small"
                                style={{ marginBottom: 16 }}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="fuelLevel"
                                            label="Return Fuel Level (%)"
                                            rules={[
                                                { required: true, message: 'Please enter fuel level' },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value) return Promise.resolve();
                                                        const num = Number(value);
                                                        if (isNaN(num)) {
                                                            return Promise.reject(new Error('Please enter a valid number'));
                                                        }
                                                        if (num < 0 || num > 100) {
                                                            return Promise.reject(new Error('Fuel level must be between 0-100%'));
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                placeholder="Enter fuel percentage"
                                                suffix="%"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="mileage"
                                            label="Return Odometer (km)"
                                            rules={[
                                                { required: true, message: 'Please enter return odometer reading' },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value) return Promise.resolve();
                                                        const num = Number(value);
                                                        if (isNaN(num)) {
                                                            return Promise.reject(new Error('Please enter a valid number'));
                                                        }
                                                        if (num < 0) {
                                                            return Promise.reject(new Error('Odometer must be a positive number'));
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Enter return odometer reading"
                                                suffix="km"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="interiorStatus"
                                            label="Interior Status"
                                            rules={[{ required: true, message: 'Please select interior status' }]}
                                        >
                                            <Select placeholder="Select interior condition">
                                                <Option value="Clean">Clean</Option>
                                                <Option value="Normal">Normal</Option>
                                                <Option value="Dirty">Dirty</Option>
                                                <Option value="Damaged">Damaged</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="damageDescription"
                                    label="Damage Description"
                                >
                                    <Input.TextArea
                                        rows={2}
                                        placeholder="Describe any damages found..."
                                        showCount
                                        maxLength={300}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="notes"
                                    label="Additional Notes"
                                    rules={[{ required: true, message: 'Please enter checkout notes' }]}
                                >
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Describe overall condition and any additional observations..."
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>
                            </Card>

                            {/* Extra Charges Section */}
                            <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#856404' }}>
                                            Extra Charges
                                        </span>
                                        <Button
                                            type="dashed"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={addExtraCharge}
                                        >
                                            Add Charge
                                        </Button>
                                    </div>
                                }
                                size="small"
                                style={{ marginBottom: 20 }}
                            >
                                {extraCharges.length === 0 ? (
                                    <Text type="secondary">No extra charges</Text>
                                ) : (
                                    extraCharges.map((charge, index) => (
                                        <Card
                                            key={index}
                                            size="small"
                                            style={{ marginBottom: 8 }}
                                            title={`Charge ${index + 1}`}
                                            extra={
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    onClick={() => removeExtraCharge(index)}
                                                >
                                                    Remove
                                                </Button>
                                            }
                                        >
                                            <Row gutter={8}>
                                                <Col span={8}>
                                                    <Input
                                                        placeholder="Reason for charge"
                                                        value={charge.reason}
                                                        onChange={(e) => updateExtraCharge(index, 'reason', e.target.value)}
                                                    />
                                                </Col>
                                                <Col span={8}>
                                                    <Input
                                                        type="number"
                                                        placeholder="Amount (VND)"
                                                        value={charge.amount}
                                                        onChange={(e) => updateExtraCharge(index, 'amount', e.target.value)}
                                                        suffix="VND"
                                                    />
                                                </Col>
                                                <Col span={8}>
                                                    <Upload
                                                        accept="image/*"
                                                        showUploadList={false}
                                                        beforeUpload={(file) => {
                                                            uploadExtraChargeImage(file, index);
                                                            return false; // Prevent automatic upload
                                                        }}
                                                    >
                                                        <Button
                                                            icon={<UploadOutlined />}
                                                            size="small"
                                                            style={{ width: '100%' }}
                                                        >
                                                            {charge.image ? 'Change Image' : 'Upload Image'}
                                                        </Button>
                                                    </Upload>
                                                    {charge.image && (
                                                        <div style={{ marginTop: 4 }}>
                                                            <Text
                                                                type="success"
                                                                style={{ fontSize: 11 }}
                                                            >
                                                                ✓ Image uploaded
                                                            </Text>
                                                            <br />
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                style={{ padding: 0, height: 'auto', fontSize: 10 }}
                                                                onClick={() => window.open(charge.image, '_blank')}
                                                            >
                                                                View Image
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))
                                )}
                            </Card>

                            {/* Action Buttons */}
                            <div style={{
                                textAlign: 'right',
                                padding: '16px 0',
                                borderTop: '1px solid #f0f0f0',
                                marginTop: 16
                            }}>
                                <Space size="middle">
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            setCheckOutModalVisible(false);
                                            setExtraCharges([]);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        icon={<CheckCircleOutlined />}
                                        style={{
                                            backgroundColor: '#fa8c16',
                                            borderColor: '#fa8c16',
                                            minWidth: 140
                                        }}
                                    >
                                        Complete Check-out
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default OwnerBookings;
