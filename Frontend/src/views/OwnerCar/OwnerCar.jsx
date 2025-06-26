import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Row, Col, message, Card, List, Spin, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCar } from '../../contexts/CarContext';
import { useAuth } from '../../contexts/AuthContext';
import featureService from '../../services/featureService';
import './OwnerCar.css';

const { Option } = Select;

// --- Constants ---
const TRANSMISSION_OPTIONS = [
    { value: 'AUTO', label: 'Tự động' },
    { value: 'MANUAL', label: 'Số sàn' },
];
const CAR_TYPE_OPTIONS = [
    { value: 'STANDARD', label: 'Standard' },
    { value: 'LUXURY', label: 'Luxury' },
    { value: 'SUPER_LUXURY', label: 'Super Luxury' },
];
const FUEL_TYPE_OPTIONS = [
    { value: 'GASOLINE', label: 'Xăng' },
    { value: 'OIL', label: 'Dầu (Diesel)' },
    { value: 'ELECTRIC', label: 'Điện' },
    { value: 'HYBRID', label: 'Hybrid' },
];
const MOCK_CAR_BRANDS = [
    { id: 1, name: 'Toyota' }, { id: 2, name: 'Honda' }, { id: 3, name: 'Ford' },
    { id: 4, name: 'VinFast' }, { id: 5, name: 'Kia' }, { id: 6, name: 'Hyundai' },
];

const OwnerCar = () => {
    const [form] = Form.useForm();
    const { createCar, loading, fetchUserCars, cars } = useCar();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [features, setFeatures] = useState([]);
    const [loadingCars, setLoadingCars] = useState(false);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const res = await featureService.getFeatures(0, 100, 'createdAt,desc');
                setFeatures(res.data.content || []);
            } catch (error) {
                message.error('Không thể tải danh sách tính năng!');
            }
        };
        fetchFeatures();
    }, []);

    useEffect(() => {
        if (user?.id) {
            const fetchCars = async () => {
                setLoadingCars(true);
                await fetchUserCars(user.id);
                setLoadingCars(false);
            };
            fetchCars();
        }
    }, [user?.id]);

    const onFinish = async (values) => {
        if (!user?.id) {
            message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return;
        }

        const { address, ...rest } = values;
        const payload = {
            ...rest,
            location: {
                address,
                latitude: "0.1",
                longitude: "0.1",
            }
        };

        const result = await createCar(payload);

        if (result.success) {
            message.success('Đăng ký xe thành công!');
            form.resetFields();
            await fetchUserCars(user.id);
        } else {
            message.error(result.error || 'Đăng ký xe thất bại.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.warning('Vui lòng điền đầy đủ các thông tin bắt buộc!');
    };

    return (
        <div className="owner-car-page">
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                <Card title="Đăng ký thông tin xe" className="owner-car-card">
                    <p className="form-description">Điền các thông tin cần thiết bên dưới để đăng ký xe của bạn.</p>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        initialValues={{
                            year: new Date().getFullYear(),
                            transmission: 'AUTO',
                            type: 'STANDARD',
                            fuelType: 'GASOLINE',
                        }}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Tên hiển thị xe" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên xe!' }]}>
                                    <Input placeholder="VD: Fadil 2021 màu đỏ" />
                                </Form.Item>
                                <Form.Item label="Năm sản xuất" name="year" rules={[{ required: true, message: 'Vui lòng nhập năm sản xuất!' }]}>
                                    <InputNumber className="full-width" min={1990} max={new Date().getFullYear() + 1} />
                                </Form.Item>
                                <Form.Item label="Màu sắc" name="color">
                                    <Input placeholder="VD: Trắng" />
                                </Form.Item>
                                <Form.Item label="Mức tiêu thụ (L/100km)" name="fuelConsumption">
                                    <InputNumber className="full-width" step={0.1} placeholder="VD: 7.5" />
                                </Form.Item>
                                <Form.Item label="Hộp số" name="transmission" rules={[{ required: true, message: 'Vui lòng chọn hộp số!' }]}>
                                    <Select placeholder="Chọn hộp số">
                                        {TRANSMISSION_OPTIONS.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Loại xe" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại xe!' }]}>
                                    <Select placeholder="Chọn loại xe">
                                        {CAR_TYPE_OPTIONS.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Dòng xe (Model)" name="model" rules={[{ required: true, message: 'Vui lòng nhập dòng xe!' }]}>
                                    <Input placeholder="VD: Fadil, Vios,..." />
                                </Form.Item>
                                <Form.Item label="Số ghế" name="seats" rules={[{ required: true, message: 'Vui lòng nhập số ghế!' }]}>
                                    <InputNumber className="full-width" min={2} max={16} placeholder="VD: 5" />
                                </Form.Item>
                                <Form.Item label="Biển số xe" name="licensePlate" rules={[{ required: true, message: 'Vui lòng nhập biển số!' }]}>
                                    <Input placeholder="VD: 51K-123.45" />
                                </Form.Item>
                                <Form.Item label="Hãng xe" name="carBrandId" rules={[{ required: true, message: 'Vui lòng chọn hãng xe!' }]}>
                                    <Select placeholder="Chọn hãng xe">
                                        {MOCK_CAR_BRANDS.map(brand => <Option key={brand.id} value={brand.id}>{brand.name}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Loại nhiên liệu" name="fuelType" rules={[{ required: true, message: 'Vui lòng chọn nhiên liệu!' }]}>
                                    <Select placeholder="Chọn loại nhiên liệu">
                                        {FUEL_TYPE_OPTIONS.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Tính năng nổi bật" name="carFeatures">
                                    <Select mode="multiple" placeholder="Chọn nhiều tính năng">
                                        {features.map(feature => <Option key={feature.id} value={feature.id}>{feature.name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item label="Địa chỉ xe" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                                    <Input placeholder="VD: 79 Tô Ký, Phường Hiệp Thành, Quận 12, TP.HCM" />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                        Đăng ký xe
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Card title="Danh sách xe của bạn" className="owner-car-card">
                    {(loading || loadingCars) ? (
                        <div className="spinner-container">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3 }}
                            dataSource={cars}
                            locale={{ emptyText: 'Bạn chưa có xe nào.' }}
                            renderItem={car => (
                                <List.Item>
                                    <Card
                                        hoverable
                                        className="car-list-item-card"
                                        title={car.name}
                                        extra={car.year}
                                        cover={
                                            <img
                                                alt={car.name}
                                                src={
                                                    car.images && car.images.length > 0
                                                        ? (car.images[0].imageUrl || car.images[0])
                                                        : 'https://via.placeholder.com/300x200?text=No+Image'
                                                }
                                                className="car-list-item-image"
                                            />
                                        }
                                    >
                                        <p><b>Biển số:</b> {car.licensePlate}</p>
                                        <p><b>Số ghế:</b> {car.seats}</p>
                                        <p><b>Địa chỉ:</b> {car.location?.address}</p>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default OwnerCar;