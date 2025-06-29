import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Row, Col, message, Card, Avatar,
    DatePicker, Upload, Descriptions, Spin, Alert, Divider, Space, Menu, Empty, Tabs, Modal
} from 'antd';
import { 
    UserOutlined, UploadOutlined, EditOutlined, PlusOutlined, 
    HistoryOutlined, BankOutlined, CarOutlined, IdcardOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './UserProfile.css';
import { useAuth } from '../../contexts/AuthContext';
import { useCar } from '../../contexts/CarContext';
import BankInfoModal from './BankInfoModal';
import BookingHistory from './BookingHistory';
import IdCardInfo from './IdCardInfo';
import LicenseInfo from './LicenseInfo';
import MyCars from './MyCars';

const UserProfile = () => {
    const [isBankModalVisible, setIsBankModalVisible] = useState(false);
    const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { user, updateUserProfile, loading: authLoading, updateUserAvatar } = useAuth();
    const { fetchUserCars } = useCar();

    const [activeTab, setActiveTab] = useState('info');

    const handleMenuClick = ({ key }) => {
        setActiveTab(key);
        // Load cars data when switching to mycars tab
        if (key === 'mycars' && user?.id) {
            fetchUserCars(user.id);
        }
    };

    const menuItems = [
        {
            key: 'info',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân'
        },
        {
            key: 'booking',
            icon: <HistoryOutlined />,
            label: 'Lịch sử booking'
        },
        {
            key: 'mycars',
            icon: <CarOutlined />,
            label: 'Xe của tôi'
        }
    ];

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                address: user.address?.address,
                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
            });
        }
        console.log("User data loaded:", user);
    }, [user, form]);

    // Load cars data when component mounts and user is available
    useEffect(() => {
        if (user?.id && activeTab === 'mycars') {
            fetchUserCars(user.id);
        }
    }, [user?.id, activeTab, fetchUserCars]);

    const handleFormFinish = async (values) => {
        try {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
                address: {
                    address: values.address?.address || ''
                }
            };

            await updateUserProfile(payload);
            message.success("Cập nhật thông tin thành công!");
            setIsEditProfileModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.");
        }
    };

    // Custom upload function
    const customUpload = async ({ file, onSuccess, onError }) => {
        try {
            // Validate file type
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, etc.)');
            }

            // Validate file size (max 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                throw new Error('File ảnh phải nhỏ hơn 5MB');
            }

            await updateUserAvatar(file);
            message.success(`${file.name} đã được tải lên thành công.`);
            onSuccess('ok');
        } catch (error) {
            message.error('Tải lên ảnh đại diện thất bại: ' + (error.message || 'Lỗi không xác định'));
            onError(error);
        }
    };

    if (authLoading) {
        return <div className="profile-page-container loading"><Spin size="large" /></div>;
    }

    if (!user) {
        return <div className="profile-page-container"><Alert message="Lỗi" description="Không thể tải dữ liệu người dùng." type="error" showIcon /></div>;
    }

    // Kiểm tra xem user đã có thông tin ngân hàng hay chưa
    const hasBankInfo = user.bankInformation && user.bankInformation.bankName;

    const renderDisplayMode = () => (
        <Card title="Thông tin cá nhân" extra={
            <Button icon={<EditOutlined />} onClick={() => setIsEditProfileModalVisible(true)}>
                Chỉnh sửa
            </Button>
        }>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center' }}>
                        <Avatar size={120} src={user.profilePicture} icon={<UserOutlined />} />
                        <div style={{ marginTop: 16 }}>
                            <Upload 
                                name="file" 
                                showUploadList={false} 
                                customRequest={customUpload}
                                accept="image/*"
                                beforeUpload={(file) => {
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        message.error('Chỉ chấp nhận file ảnh!');
                                        return false;
                                    }
                                    const isLt5M = file.size / 1024 / 1024 < 5;
                                    if (!isLt5M) {
                                        message.error('File ảnh phải nhỏ hơn 5MB!');
                                        return false;
                                    }
                                    return true;
                                }}
                            >
                                <Button icon={<UploadOutlined />} size="small">
                                    Thay đổi ảnh
                                </Button>
                            </Upload>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={16}>
                    <Tabs defaultActiveKey="basic" size="small">
                        <Tabs.TabPane tab="Thông tin cơ bản" key="basic">
                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label="Họ và tên">{`${user.lastName || ''} ${user.firstName || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="Email">{user.email || 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{user.phone || 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh">{user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">{user.address?.address || 'Chưa cập nhật'}</Descriptions.Item>
                            </Descriptions>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Thông tin ngân hàng" key="bank">
                            <div style={{ marginBottom: 16 }}>
                                {hasBankInfo ? (
                                    <Descriptions bordered column={1} size="small">
                                        <Descriptions.Item label="Tên ngân hàng">{user.bankInformation?.bankName}</Descriptions.Item>
                                        <Descriptions.Item label="Số tài khoản">{user.bankInformation?.accountNumber}</Descriptions.Item>
                                        <Descriptions.Item label="Tên chủ tài khoản">{user.bankInformation?.accountHolderName}</Descriptions.Item>
                                    </Descriptions>
                                ) : (
                                    <Empty 
                                        description="Chưa có thông tin ngân hàng"
                                        style={{ padding: '20px 0' }}
                                    />
                                )}
                                <Button 
                                    type="primary" 
                                    icon={hasBankInfo ? <EditOutlined /> : <PlusOutlined />}
                                    onClick={() => setIsBankModalVisible(true)}
                                    style={{ marginTop: 16 }}
                                >
                                    {hasBankInfo ? 'Cập nhật' : 'Thêm thông tin ngân hàng'}
                                </Button>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Thông tin CCCD" key="idcard">
                            <IdCardInfo user={user} embedded={true} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Bằng lái xe" key="license">
                            <LicenseInfo user={user} embedded={true} />
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Card>
    );

    const renderBookingHistoryTab = () => (
        <div className="booking-history-tab">
            <Card title="Lịch sử đặt xe" extra={
                <Button type="primary" icon={<HistoryOutlined />}>
                    Xem tất cả
                </Button>
            }>
                <BookingHistory
                    userId={user?.id}
                    visible={true}
                    onClose={() => {}}
                    embedded={true}
                />
            </Card>
        </div>
    );

    const renderMyCarsTab = () => (
        <div className="my-cars-tab">
            <MyCars embedded={true} />
        </div>
    );

    return (
        <div className="profile-page-container">
            <Row gutter={[32, 32]}>
                <Col xs={24} md={6}>
                    <Menu 
                        mode="vertical"
                        selectedKeys={[activeTab]}
                        onClick={handleMenuClick}
                        className="profile-menu"
                    >
                        {menuItems.map(item => (
                            <Menu.Item key={item.key}>
                                <span>
                                    {item.icon}
                                    {item.label}
                                </span>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Col>
                <Col xs={24} md={18}>
                    <div className="profile-content">
                        {activeTab === 'info' && renderDisplayMode()}
                        {activeTab === 'booking' && renderBookingHistoryTab()}
                        {activeTab === 'mycars' && renderMyCarsTab()}
                    </div>
                </Col>
            </Row>

            <BankInfoModal
                visible={isBankModalVisible}
                onClose={() => setIsBankModalVisible(false)}
                isUpdate={hasBankInfo}
            />

            {/* Modal chỉnh sửa thông tin cá nhân */}
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isEditProfileModalVisible}
                onCancel={() => setIsEditProfileModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFormFinish}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item 
                                name="firstName" 
                                label="Tên" 
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Nhập tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="lastName" 
                                label="Họ" 
                                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                            >
                                <Input placeholder="Nhập họ" />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item 
                                name="email" 
                                label="Email" 
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="phone" 
                                label="Số điện thoại" 
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item 
                                name="dateOfBirth" 
                                label="Ngày sinh"
                            >
                                <DatePicker 
                                    placeholder="Chọn ngày sinh" 
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name={['address', 'address']} 
                                label="Địa chỉ"
                            >
                                <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsEditProfileModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile; 