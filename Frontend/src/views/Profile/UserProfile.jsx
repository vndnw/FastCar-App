import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Row, Col, message, Card, Avatar,
    DatePicker, Upload, Descriptions, Spin, Alert, Divider
} from 'antd';
import { UserOutlined, UploadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './UserProfile.css';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import BankInfoModal from './BankInfoModal'; // Import modal mới

const UserProfile = () => {
    const [form] = Form.useForm();
    const { user, updateUserProfile, refreshUserData, loading: authLoading } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isBankModalVisible, setIsBankModalVisible] = useState(false);

    useEffect(() => {
        if (isEditing && user) {
            form.setFieldsValue({
                ...user,
                address: user.address?.address,
                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
            });
        }
        console.log("User data loaded:", user);
    }, [isEditing, user, form]);

    const handleFormFinish = async (values) => {
        setSubmitLoading(true);
        try {
            const payload = {
                lastName: values.lastName,
                firstName: values.firstName,
                address: { address: values.address },
                profilePicture: user.profilePicture,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
            };
            await updateUserProfile(payload);
            message.success("Cập nhật thông tin thành công!");
            setIsEditing(false);
        } catch (err) {
            message.error(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Logic xử lý upload ảnh giữ nguyên
    const handleImageUpload = async (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} đã được tải lên.`);
            await refreshUserData();
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} tải lên thất bại.`);
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
        <>
            <Descriptions bordered column={1} title="Thông tin cá nhân" extra={<Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>}>
                <Descriptions.Item label="Họ và tên">{`${user.lastName || ''} ${user.firstName || ''}`}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{user.phone || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{user.address?.address || 'Chưa cập nhật'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions bordered column={1} title="Thông tin ngân hàng" extra={
                hasBankInfo ? (
                    <Button icon={<EditOutlined />} onClick={() => setIsBankModalVisible(true)}>Cập nhật</Button>
                ) : (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsBankModalVisible(true)}>Thêm thông tin</Button>
                )
            }>
                <Descriptions.Item label="Tên ngân hàng">{user.bankInformation?.bankName || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Số tài khoản">{user.bankInformation?.accountNumber || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Tên chủ tài khoản">{user.bankInformation?.accountHolderName || 'Chưa cập nhật'}</Descriptions.Item>
            </Descriptions>
        </>
    );

    const renderEditMode = () => (
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
            <Row gutter={24}><Col span={12}><Form.Item name="lastName" label="Họ"><Input /></Form.Item></Col><Col span={12}><Form.Item name="firstName" label="Tên"><Input /></Form.Item></Col></Row>
            <Form.Item name="email" label="Email"><Input disabled /></Form.Item>
            <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
            <Form.Item name="dateOfBirth" label="Ngày sinh"><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item>
            <Form.Item name="address" label="Địa chỉ"><Input.TextArea rows={2} /></Form.Item>
            <Form.Item>
                <div className="profile-form-buttons">
                    <Button type="default" onClick={() => setIsEditing(false)} style={{ marginRight: 8 }}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={submitLoading}>Lưu thay đổi</Button>
                </div>
            </Form.Item>
        </Form>
    );

    return (
        <div className="profile-page-container">
            <Card>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8} className="profile-avatar-section">
                        <Avatar size={150} src={user.profilePicture} icon={<UserOutlined />} />
                        <Upload name="file" action={`http://localhost:8080/api/v1/user/${user.id}/avatar`} headers={{ Authorization: `Bearer ${localStorage.getItem('authToken')}` }} showUploadList={false} onChange={handleImageUpload}>
                            <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>Thay đổi ảnh đại diện</Button>
                        </Upload>
                    </Col>
                    <Col xs={24} md={16} className="profile-info-section">
                        {isEditing ? renderEditMode() : renderDisplayMode()}
                    </Col>
                </Row>
            </Card>

            <BankInfoModal
                visible={isBankModalVisible}
                onClose={() => setIsBankModalVisible(false)}
                isUpdate={hasBankInfo}
            />
        </div>
    );
};

export default UserProfile;