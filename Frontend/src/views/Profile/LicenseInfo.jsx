import React, { useState, useEffect } from 'react';
import {
    Card, Descriptions, Button, Modal, Form, Input, 
    Upload, message, Empty, Space, Tag, Row, Col, Select
} from 'antd';
import { DatePicker } from 'antd';
import { 
    EditOutlined, PlusOutlined, UploadOutlined, 
    SafetyCertificateOutlined, EyeOutlined 
} from '@ant-design/icons';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const { Option } = Select;

const LicenseInfo = ({ embedded = false }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const { user: currentUser } = useAuth();

    // State for storing license info and uploaded files
    const [licenseInfo, setLicenseInfo] = useState(null);
    const [imageFront, setImageFront] = useState(null);
    const [imageBack, setImageBack] = useState(null);
    const [imageFrontUrl, setImageFrontUrl] = useState(null);
    const [imageBackUrl, setImageBackUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch license info and set preview URLs when component mounts or userId changes
    useEffect(() => {
        const userId = currentUser?.id;
        userService.getLicense(userId)
            .then(res => {
                if (res?.data) {
                    setLicenseInfo(res.data);
                    console.log(res.data);
                    form.setFieldsValue({
                        licenseNumber: res.data.serialNumber,
                        fullName: res.data.name,
                        dateOfBirth: res.data.dateOfBirth ? dayjs(res.data.dateOfBirth) : null,
                        licenseClass: res.data.rankLicense,
                        address: res.data.address,
                        issueDate: res.data.issueDate ? dayjs(res.data.issueDate) : null,
                        issuePlace: res.data.placeOfIssue,
                        expiryDate: res.data.expiryDate ? dayjs(res.data.expiryDate) : null,
                    });
                    setImageFrontUrl(res.data.imageFrontUrl || null);
                    setImageBackUrl(res.data.imageBackUrl || null);
                } else {
                    setLicenseInfo(null);
                    setImageFrontUrl(null);
                    setImageBackUrl(null);
                    form.resetFields();
                }
            })
            .catch(() => {
                setLicenseInfo(null);
                setImageFrontUrl(null);
                setImageBackUrl(null);
                form.resetFields();
            });
        // eslint-disable-next-line
    }, [currentUser?.id]);

    // Cleanup URL.createObjectURL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imageFront) {
                URL.revokeObjectURL(URL.createObjectURL(imageFront));
            }
            if (imageBack) {
                URL.revokeObjectURL(URL.createObjectURL(imageBack));
            }
        };
    }, [imageFront, imageBack]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            if (!imageFront && !imageFrontUrl) {
                message.error('Vui lòng tải lên ảnh mặt trước của bằng lái xe');
                return;
            }
            if (!imageBack && !imageBackUrl) {
                message.error('Vui lòng tải lên ảnh mặt sau của bằng lái xe');
                return;
            }

            const documentRequest = {
                serialNumber: values.licenseNumber,
                fullName: values.fullName,
                dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : '',
                rankLicense: values.licenseClass,
                location: {
                    address:values.address,
                    latitude: "10.8231",
                    longitude: "106.6297",
                },
                issueDate: values.issueDate ? dayjs(values.issueDate).format('YYYY-MM-DD') : '',
                placeOfIssue: values.issuePlace,
                expiryDate: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : '',
                documentType: 'LICENSE'
            };

            const userId = currentUser?.id;

            if (licenseInfo) {
                await userService.updateLicense(userId, documentRequest, imageFront, imageBack);
                message.success('Cập nhật thông tin bằng lái xe thành công!');
            } else {
                await userService.addLicense(userId, documentRequest, imageFront, imageBack);
                message.success('Thêm thông tin bằng lái xe thành công!');
            }

            setLicenseInfo(values);
            setIsModalVisible(false);
            setIsEditing(false);
            setImageFront(null);
            setImageBack(null);
        } catch (error) {
            console.error('Error saving license info:', error);
            message.error('Lưu thông tin bằng lái xe thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (info, type) => {
        if (info.fileList && info.fileList.length > 0) {
            const file = info.fileList[0].originFileObj;
            if (type === 'front') {
                setImageFront(file);
            } else {
                setImageBack(file);
            }
            message.success(`${file.name} đã được chọn.`);
        } else {
            if (type === 'front') {
                setImageFront(null);
            } else {
                setImageBack(null);
            }
        }
    };

    const renderLicenseForm = () => (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        name="licenseNumber" 
                        label="Số bằng lái xe" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập số bằng lái xe' },
                            { pattern: /^\d{12}$/, message: 'Số bằng lái xe phải có 12 chữ số' }
                        ]}
                    >
                        <Input placeholder="Nhập số bằng lái xe" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="fullName" 
                        label="Họ và tên" 
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                </Col>
            </Row>
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        name="dateOfBirth" 
                        label="Ngày sinh" 
                        rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="licenseClass" 
                        label="Hạng bằng lái" 
                        rules={[{ required: true, message: 'Vui lòng chọn hạng bằng lái' }]}
                    >
                        <Select placeholder="Chọn hạng bằng lái">
                            <Option value="A1">A1 - Xe mô tô 2 bánh có dung tích xi-lanh từ 50cc đến dưới 175cc</Option>
                            <Option value="A2">A2 - Xe mô tô 2 bánh có dung tích xi-lanh từ 175cc trở lên</Option>
                            <Option value="A3">A3 - Xe mô tô 3 bánh</Option>
                            <Option value="A4">A4 - Xe máy kéo có trọng tải đến 1.000kg</Option>
                            <Option value="B1">B1 - Ô tô chở người đến 9 chỗ ngồi, ô tô tải có trọng tải dưới 3.500kg</Option>
                            <Option value="B2">B2 - Ô tô chở người đến 9 chỗ ngồi, ô tô tải có trọng tải dưới 3.500kg</Option>
                            <Option value="C">C - Ô tô tải có trọng tải từ 3.500kg trở lên</Option>
                            <Option value="D">D - Ô tô chở người từ 10 đến 30 chỗ ngồi</Option>
                            <Option value="E">E - Ô tô chở người trên 30 chỗ ngồi</Option>
                            <Option value="F">F - Máy kéo, rơ moóc</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        name="address" 
                        label="Địa chỉ" 
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="issueDate" 
                        label="Ngày cấp" 
                        rules={[{ required: true, message: 'Vui lòng nhập ngày cấp' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày cấp" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        name="issuePlace" 
                        label="Nơi cấp" 
                        rules={[{ required: true, message: 'Vui lòng nhập nơi cấp' }]}
                    >
                        <Input placeholder="Nhập nơi cấp" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="expiryDate" 
                        label="Ngày hết hạn" 
                        rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày hết hạn" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Ảnh bằng lái xe mặt trước" required>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Upload
                        name="frontImage"
                        listType="picture-card"
                        showUploadList={false}
                        onChange={(info) => handleImageUpload(info, 'front')}
                        accept="image/*"
                        beforeUpload={() => false}
                        style={{ width: 318 }}
                    >
                        {imageFront ? (
                            <div style={{
                                width: 318,
                                height: 200,
                                borderRadius: 16,
                                border: '1.5px solid #e0e0e0',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img src={URL.createObjectURL(imageFront)} alt="Bằng lái xe mặt trước" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
                            </div>
                        ) : imageFrontUrl ? (
                            <div style={{
                                width: 318,
                                height: 200,
                                borderRadius: 16,
                                border: '1.5px solid #e0e0e0',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img src={imageFrontUrl} alt="Bằng lái xe mặt trước" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
                            </div>
                        ) : (
                            <div style={{
                                width: 318,
                                height: 200,
                                borderRadius: 16,
                                border: '2px dashed #bdbdbd',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <UploadOutlined style={{ fontSize: '38px', color: '#999', marginBottom: '12px' }} />
                                <div style={{ color: '#666', fontWeight: 500 }}>Tải lên ảnh bằng lái xe mặt trước</div>
                            </div>
                        )}
                    </Upload>
                </div>
                {(imageFront || imageFrontUrl) && (
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                        <Button size="small" onClick={() => setImageFront(null)} danger>Xóa ảnh</Button>
                    </div>
                )}
            </Form.Item>

            <Form.Item label="Ảnh bằng lái xe mặt sau" required>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Upload
                        name="backImage"
                        listType="picture-card"
                        showUploadList={false}
                        onChange={(info) => handleImageUpload(info, 'back')}
                        accept="image/*"
                        beforeUpload={() => false}
                        style={{ width: 318 }}
                    >
                        {imageBack ? (
                            <div style={{
                                width: 318,
                                height: 200,
                                borderRadius: 16,
                                border: '1.5px solid #e0e0e0',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img src={URL.createObjectURL(imageBack)} alt="Bằng lái xe mặt sau" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
                            </div>
                        ) : imageBackUrl ? (
                            <div style={{
                                width: 318,
                                height: 200,
                                borderRadius: 16,
                                border: '1.5px solid #e0e0e0',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img src={imageBackUrl} alt="Bằng lái xe mặt sau" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
                            </div>
                        ) : (
                            <div style={{
                                width: 318,
                                height: 200,
                                borderRadius: 16,
                                border: '2px dashed #bdbdbd',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <UploadOutlined style={{ fontSize: '38px', color: '#999', marginBottom: '12px' }} />
                                <div style={{ color: '#666', fontWeight: 500 }}>Tải lên ảnh bằng lái xe mặt sau</div>
                            </div>
                        )}
                    </Upload>
                </div>
                {(imageBack || imageBackUrl) && (
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                        <Button size="small" onClick={() => setImageBack(null)} danger>Xóa ảnh</Button>
                    </div>
                )}
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {licenseInfo ? 'Cập nhật' : 'Lưu thông tin'}
                    </Button>
                    <Button onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );

    const renderLicenseInfo = () => (
        <Descriptions bordered column={1}>
            <Descriptions.Item label="Số bằng lái xe">{licenseInfo?.serialNumber}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{licenseInfo?.name}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{licenseInfo?.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Hạng bằng lái">{licenseInfo?.rankLicense}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{licenseInfo?.address}</Descriptions.Item>
            <Descriptions.Item label="Ngày cấp">{licenseInfo?.issueDate}</Descriptions.Item>
            <Descriptions.Item label="Nơi cấp">{licenseInfo?.placeOfIssue}</Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn">{licenseInfo?.expiryDate}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
                {licenseInfo?.active
                    ? <Tag color="green">Đã xác thực</Tag>
                    : <Tag color="red">Chưa xác thực</Tag>
                }
            </Descriptions.Item>
        </Descriptions>
    );

    if (embedded) {
        return (
            <div>
                {licenseInfo ? (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Số bằng lái xe:</strong> {licenseInfo.serialNumber}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Họ và tên:</strong> {licenseInfo.name}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Hạng bằng lái:</strong> {licenseInfo.rankLicense}
                        </div>
                        <Tag color={licenseInfo.active ? "green" : "red"}>{licenseInfo.active ? "Đã xác thực" : "Chưa xác thực"}</Tag>
                        <Button 
                            type="link" 
                            icon={<EyeOutlined />} 
                            onClick={() => {
                                setIsEditing(false);
                                setIsModalVisible(true);
                            }}
                            style={{ marginLeft: 16 }}
                        >
                            Xem chi tiết
                        </Button>
                    </div>
                ) : (
                    <Empty 
                        description="Chưa có thông tin bằng lái xe"
                        style={{ padding: '20px 0' }}
                    />
                )}
                <Button 
                    type="primary" 
                    icon={licenseInfo ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => {
                        setIsEditing(true);
                        setIsModalVisible(true);
                    }}
                    style={{ marginTop: 16 }}
                >
                    {licenseInfo ? 'Cập nhật' : 'Thêm thông tin bằng lái xe'}
                </Button>

                <Modal
                    title={isEditing ? "Cập nhật thông tin bằng lái xe" : "Chi tiết bằng lái xe"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    {isEditing ? renderLicenseForm() : renderLicenseInfo()}
                </Modal>
            </div>
        );
    }

    return (
        <div className="license-tab">
            <Card 
                title="Bằng lái xe" 
                extra={
                    <Space>
                        {licenseInfo && (
                            <Button 
                                icon={<EyeOutlined />} 
                                onClick={() => {
                                    setIsEditing(false);
                                    setIsModalVisible(true);
                                }}
                            >
                                Xem chi tiết
                            </Button>
                        )}
                        <Button 
                            type="primary" 
                            icon={licenseInfo ? <EditOutlined /> : <PlusOutlined />}
                            onClick={() => {
                                setIsEditing(true);
                                setIsModalVisible(true);
                            }}
                        >
                            {licenseInfo ? 'Cập nhật' : 'Thêm thông tin'}
                        </Button>
                    </Space>
                }
            >
                {licenseInfo ? (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Số bằng lái xe:</strong> {licenseInfo.serialNumber}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Họ và tên:</strong> {licenseInfo.name}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Hạng bằng lái:</strong> {licenseInfo.rankLicense}
                        </div>
                        <Tag color={licenseInfo.active ? "green" : "red"}>{licenseInfo.active ? "Đã xác thực" : "Chưa xác thực"}</Tag>
                    </div>
                ) : (
                    <Empty 
                        description="Chưa có thông tin bằng lái xe"
                        style={{ padding: '50px 0' }}
                    />
                )}
            </Card>

            <Modal
                title={isEditing ? "Cập nhật thông tin bằng lái xe" : "Chi tiết bằng lái xe"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                {isEditing ? renderLicenseForm() : renderLicenseInfo()}
            </Modal>
        </div>
    );
};

export default LicenseInfo; 