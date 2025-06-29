import React, { useState, useEffect } from 'react';
import {
    Card, Descriptions, Button, Modal, Form, Input, 
    Upload, message, Empty, Space, Tag, Row, Col, Select
} from 'antd';
import { DatePicker } from 'antd';
import { 
    EditOutlined, PlusOutlined, UploadOutlined, 
    IdcardOutlined, EyeOutlined 
} from '@ant-design/icons';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';
import { Turtle } from 'lucide-react';

const IdCardInfo = ({ user, embedded = false }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const { user: currentUser } = useAuth();

    // State for storing CCCD info and uploaded files
    const [idCardInfo, setIdCardInfo] = useState(null);
    const [imageFront, setImageFront] = useState(null);
    const [imageBack, setImageBack] = useState(null);
    const [imageFrontUrl, setImageFrontUrl] = useState(null);
    const [imageBackUrl, setImageBackUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch CCCD info and set preview URLs when component mounts or userId changes
    useEffect(() => {
        const userId = user?.id || currentUser?.id;
        userService.getCCCD(userId)
            .then(res => {
                if (res?.data) {
                    setIdCardInfo(res.data);
                    console.log(res.data);
                    form.setFieldsValue({
                        idNumber: res.data.serialNumber,
                        fullName: res.data.name,
                        dateOfBirth: res.data.dateOfBirth ? dayjs(res.data.dateOfBirth) : null,
                        gender: res.data.gender,
                        address: res.data.address,
                        issueDate: res.data.issueDate ? dayjs(res.data.issueDate) : null,
                        issuePlace: res.data.placeOfIssue,
                        expiryDate: res.data.expiryDate ? dayjs(res.data.expiryDate) : null,
                    });
                    setImageFrontUrl(res.data.imageFrontUrl || null);
                    setImageBackUrl(res.data.imageBackUrl || null);
                } else {
                    setIdCardInfo(null);
                    setImageFrontUrl(null);
                    setImageBackUrl(null);
                    form.resetFields();
                }
            })
            .catch(() => {
                setIdCardInfo(null);
                setImageFrontUrl(null);
                setImageBackUrl(null);
                form.resetFields();
            });
        // eslint-disable-next-line
    }, [user?.id, currentUser?.id]);

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
                message.error('Vui lòng tải lên ảnh mặt trước của CCCD');
                return;
            }
            if (!imageBack && !imageBackUrl) {
                message.error('Vui lòng tải lên ảnh mặt sau của CCCD');
                return;
            }

            const documentRequest = {
                serialNumber: values.idNumber,
                fullName: values.fullName,
                dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : '',
                gender: values.gender,
                location: {
                    address:values.address,
                    latitude: "10.8231",
                    longitude: "106.6297",
                },
                issueDate: values.issueDate ? dayjs(values.issueDate).format('YYYY-MM-DD') : '',
                placeOfIssue: values.issuePlace,
                expiryDate: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : '',
                documentType: 'CCCD'
            };

            const userId = user?.id || currentUser?.id;
            
            if (idCardInfo) {
                await userService.updateCCCD(userId, documentRequest, imageFront, imageBack);
                message.success('Cập nhật thông tin CCCD thành công!');
            } else {
                await userService.addCCCD(userId, documentRequest, imageFront, imageBack);
                message.success('Thêm thông tin CCCD thành công!');
            }

            setIdCardInfo(values);
            setIsModalVisible(false);
            setIsEditing(false);
            setImageFront(null);
            setImageBack(null);
        } catch (error) {
            console.error('Error saving CCCD info:', error);
            message.error('Lưu thông tin CCCD thất bại!');
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

    const renderIdCardForm = () => (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item 
                        name="idNumber" 
                        label="Số CCCD" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập số CCCD' },
                            { pattern: /^\d{12}$/, message: 'Số CCCD phải có 12 chữ số' }
                        ]}
                    >
                        <Input placeholder="Nhập số CCCD" />
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
                        name="gender" 
                        label="Giới tính" 
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nu">Nữ</Select.Option>
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

            <Form.Item label="Ảnh CCCD mặt trước" required>
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
                                <img src={URL.createObjectURL(imageFront)} alt="CCCD mặt trước" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
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
                                <img src={imageFrontUrl} alt="CCCD mặt trước" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
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
                                <div style={{ color: '#666', fontWeight: 500 }}>Tải lên ảnh CCCD mặt trước</div>
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

            <Form.Item label="Ảnh CCCD mặt sau" required>
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
                                <img src={URL.createObjectURL(imageBack)} alt="CCCD mặt sau" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
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
                                <img src={imageBackUrl} alt="CCCD mặt sau" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }} />
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
                                <div style={{ color: '#666', fontWeight: 500 }}>Tải lên ảnh CCCD mặt sau</div>
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
                        {idCardInfo ? 'Cập nhật' : 'Lưu thông tin'}
                    </Button>
                    <Button onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );

    const renderIdCardInfo = () => (
        <Descriptions bordered column={1}>
            <Descriptions.Item label="Số CCCD">{idCardInfo?.serialNumber}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{idCardInfo?.name}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{idCardInfo?.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{idCardInfo?.gender}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{idCardInfo?.address}</Descriptions.Item>
            <Descriptions.Item label="Ngày cấp">{idCardInfo?.issueDate}</Descriptions.Item>
            <Descriptions.Item label="Nơi cấp">{idCardInfo?.placeOfIssue}</Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn">{idCardInfo?.expiryDate}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
                {idCardInfo?.active
                    ? <Tag color="green">Đã xác thực</Tag>
                    : <Tag color="red">Chưa xác thực</Tag>
                }
            </Descriptions.Item>
        </Descriptions>
    );

    if (embedded) {
        return (
            <div>
                {idCardInfo ? (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Số CCCD:</strong> {idCardInfo?.serialNumber || "Chưa có thông tin"}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Họ và tên:</strong> {idCardInfo?.name || "Chưa có thông tin"}
                        </div>
                        {idCardInfo?.active ? <Tag color="green">Đã xác thực</Tag> : <Tag color="red">Chưa xác thực</Tag> }
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
                        description="Chưa có thông tin CCCD"
                        style={{ padding: '20px 0' }}
                    />
                )}
                <Button 
                    type="primary" 
                    icon={idCardInfo ? <EditOutlined /> : <PlusOutlined />}
                    onClick={() => {
                        setIsEditing(true);
                        setIsModalVisible(true);
                    }}
                    style={{ marginTop: 16 }}
                >
                    {idCardInfo ? 'Cập nhật' : 'Thêm thông tin CCCD'}
                </Button>

                <Modal
                    title={isEditing ? "Cập nhật thông tin CCCD" : "Chi tiết CCCD"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    {isEditing ? renderIdCardForm() : renderIdCardInfo()}
                </Modal>
            </div>
        );
    }

    return (
        <div className="idcard-tab">
            <Card 
                title="Thông tin CCCD" 
                extra={
                    <Space>
                        {idCardInfo && (
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
                            icon={idCardInfo ? <EditOutlined /> : <PlusOutlined />}
                            onClick={() => {
                                setIsEditing(true);
                                setIsModalVisible(true);
                            }}
                        >
                            {idCardInfo ? 'Cập nhật' : 'Thêm thông tin CCCD'}
                        </Button>
                    </Space>
                }
            >
                {idCardInfo ? (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Số CCCD:</strong> {idCardInfo.serialNumber}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong>Họ và tên:</strong> {idCardInfo.name}
                        </div>
                        {idCardInfo?.active
                            ? <Tag color="green">Đã xác thực</Tag>
                            : <Tag color="red">Chưa xác thực</Tag>
                        }
                    </div>
                ) : (
                    <Empty 
                        description="Chưa có thông tin CCCD"
                        style={{ padding: '50px 0' }}
                    />
                )}
            </Card>

            <Modal
                title={isEditing ? "Cập nhật thông tin CCCD" : "Chi tiết CCCD"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                {isEditing ? renderIdCardForm() : renderIdCardInfo()}
            </Modal>
        </div>
    );
};

export default IdCardInfo; 