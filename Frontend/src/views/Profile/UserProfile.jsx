import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Card,
    Avatar,
    DatePicker,
    Upload,
    Descriptions
} from 'antd';
import { UserOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './UserProfile.css';

// Dữ liệu giả lập ban đầu
const MOCK_USER_DATA = {
    lastName: "Văn",
    firstName: "Nguyễn",
    phone: "0987654321",
    address: {
        address: "123 Đường ABC, Phường Cống Vị, Quận Ba Đình, Hà Nội"
    },
    profilePicture: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", // URL ảnh mẫu
    dateOfBirth: "1995-08-15"
};

const UserProfile = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    // Giả lập việc lấy dữ liệu người dùng khi component được tải
    useEffect(() => {
        setUserData(MOCK_USER_DATA);
    }, []);

    // Cập nhật giá trị cho form khi người dùng nhấn nút chỉnh sửa
    useEffect(() => {
        if (isEditing) {
            form.setFieldsValue({
                ...userData,
                address: userData.address?.address, // Xử lý object lồng nhau
                dateOfBirth: userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
            });
        }
    }, [isEditing, userData, form]);


    const handleFormFinish = (values) => {
        setLoading(true);

        // Giả lập việc gọi API và cập nhật
        setTimeout(() => {
            const updatedData = {
                ...userData,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
                address: {
                    address: values.address
                }
            };

            // Xử lý mật khẩu: chỉ cập nhật nếu người dùng nhập mật khẩu mới
            if (values.password) {
                // Trong thực tế, bạn sẽ mã hóa mật khẩu trước khi gửi đi
                console.log("Mật khẩu mới đã được nhập (chưa mã hóa):", values.password);
            }

            setUserData(updatedData);
            message.success("Cập nhật thông tin thành công!");
            setIsEditing(false);
            setLoading(false);
        }, 1000);
    };

    // Xử lý khi người dùng tải ảnh lên
    const handleImageUpload = (info) => {
        if (info.file.status === 'done') {
            // Chuyển ảnh thành dạng base64 để hiển thị ngay lập tức
            const reader = new FileReader();
            reader.readAsDataURL(info.file.originFileObj);
            reader.onload = () => {
                setUserData(prev => ({ ...prev, profilePicture: reader.result }));
                message.success(`${info.file.name} tải lên thành công.`);
            };
        }
    };


    const renderDisplayMode = () => (
        <Descriptions bordered column={1} title="Thông tin cá nhân" extra={<Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>}>
            <Descriptions.Item label="Họ và tên">{`${userData.lastName || ''} ${userData.firstName || ''}`}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{userData.phone}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{userData.dateOfBirth ? dayjs(userData.dateOfBirth).format('DD/MM/YYYY') : 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{userData.address?.address || 'Chưa cập nhật'}</Descriptions.Item>
        </Descriptions>
    );

    const renderEditMode = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFormFinish}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item name="lastName" label="Họ" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="firstName" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input />
            </Form.Item>

            <Form.Item name="dateOfBirth" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item name="address" label="Địa chỉ">
                <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu mới"
                help="Để trống nếu không muốn thay đổi mật khẩu."
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <div className="profile-form-buttons">
                    <Button type="default" onClick={() => setIsEditing(false)} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu thay đổi
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );

    return (
        <div className="profile-page-container">
            <Card>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8} className="profile-avatar-section">
                        <Avatar
                            size={150}
                            src={userData.profilePicture}
                            icon={<UserOutlined />}
                        />
                        <Upload
                            name="avatar"
                            showUploadList={false}
                            customRequest={({ file, onSuccess }) => {
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                            onChange={handleImageUpload}
                        >
                            <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                                Thay đổi ảnh đại diện
                            </Button>
                        </Upload>
                    </Col>
                    <Col xs={24} md={16} className="profile-info-section">
                        {isEditing ? renderEditMode() : renderDisplayMode()}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UserProfile;