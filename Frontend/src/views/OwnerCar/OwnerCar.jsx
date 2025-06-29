import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Row, Col, message, Card, Space, Spin, Upload, Image, Modal, Divider, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, CarOutlined, CameraOutlined, DollarOutlined } from '@ant-design/icons';
import { useCar } from '../../contexts/CarContext';
import { useAuth } from '../../contexts/AuthContext';
import featureService from '../../services/featureService';
import carBrandService from '../../services/carBrandService';
import './OwnerCar.css';

const { Option } = Select;
const { Title, Text } = Typography;

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

const OwnerCar = () => {
    const [form] = Form.useForm();
    const { createCar } = useCar();
    const { user } = useAuth();

    const [features, setFeatures] = useState([]);
    const [carBrands, setCarBrands] = useState([]);
    const [isInitializing, setIsInitializing] = useState(true);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setBrandsLoading(true);
                // Fetch both features and car brands in parallel
                const [featuresRes, brandsRes] = await Promise.all([
                    featureService.getFeatures(0, 100, 'createdAt,desc'),
                    carBrandService.getCarBrands(0, 100, 'id,desc')
                ]);

                setFeatures(featuresRes.data.content || []);
                setCarBrands(brandsRes.data.content || []);
            } catch (error) {
                console.error('Error initializing data:', error);
                message.error('Không thể tải dữ liệu cần thiết. Vui lòng thử lại sau.');
            } finally {
                setIsInitializing(false);
                setBrandsLoading(false);
            }
        };

        initializeData();
    }, []);

    // Image upload handlers
    const handleImageChange = ({ fileList: newFileList }) => {
        setImageList(newFileList);
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewVisible(false);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const uploadButton = (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CameraOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
            <div style={{ color: '#666' }}>Thêm hình ảnh</div>
        </div>
    );

    const onFinish = async (values) => {
        if (!user?.id) {
            message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return;
        }

        if (imageList.length === 0) {
            message.warning('Vui lòng thêm ít nhất một hình ảnh xe!');
            return;
        }

        setIsCreating(true);

        try {
            const { address, ...rest } = values;
            
            // Prepare car data according to API structure
            const carData = {
                name: rest.name,
                model: rest.model,
                year: rest.year,
                seats: rest.seats,
                transmission: rest.transmission,
                type: rest.type,
                carBrandId: rest.carBrandId,
                fuelType: rest.fuelType,
                color: rest.color,
                licensePlate: rest.licensePlate,
                fuelConsumption: rest.fuelConsumption,
                pricePerHour: rest.pricePerDay,
                carFeatures: rest.carFeatures || [],
                location: {
                    address,
                    latitude: "10.8231", // Default Ho Chi Minh City
                    longitude: "106.6297",
                }
            };

            // Extract actual files from imageList
            const files = imageList
                .filter(file => file.originFileObj) // Only include actual files
                .map(file => file.originFileObj);

            const result = await createCar(carData, files);

            if (result.success) {
                message.success('Đăng ký xe thành công!');
                form.resetFields();
                setImageList([]);
            } else {
                message.error(result.error || 'Đăng ký xe thất bại.');
            }
        } catch (error) {
            console.error('Error creating car:', error);
            message.error('Đã xảy ra lỗi khi tạo xe. Vui lòng thử lại.');
        } finally {
            setIsCreating(false);
        }
    };

    const onFinishFailed = () => {
        message.warning('Vui lòng điền đầy đủ các thông tin bắt buộc!');
    };

    if (isInitializing) {
        return (
            <div className="owner-car-page" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh'
            }}>
                <Card style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                </Card>
            </div>
        );
    }

    return (
        <div className="owner-car-page" style={{
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Card 
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Title level={3} style={{ margin: 0, color: '#1a1a1a' }}>
                                Đăng ký thông tin xe
                            </Title>
                        </div>
                    } 
                    className="owner-car-card"
                    style={{
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: 'none',
                        overflow: 'hidden'
                    }}
                    headStyle={{
                        color: 'white',
                        borderBottom: 'none',
                        padding: '24px'
                    }}
                >
                    <div style={{ padding: '0 8px' }}>
                        <Text style={{ 
                            fontSize: '16px', 
                            color: '#666', 
                            display: 'block', 
                            marginBottom: '24px',
                            lineHeight: '1.6'
                        }}>
                            Điền các thông tin cần thiết bên dưới để đăng ký xe của bạn. 
                            Thông tin này sẽ giúp khách hàng hiểu rõ hơn về xe của bạn.
                        </Text>
                        
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
                            size="large"
                        >
                            <Row gutter={[24, 16]}>
                                <Col xs={24} lg={12}>
                                    <Card 
                                        title="Thông tin cơ bản" 
                                        size="small"
                                        style={{ 
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <Form.Item label="Tên hiển thị xe" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên xe!' }]}>
                                            <Input placeholder="VD: Fadil 2021 màu đỏ" />
                                        </Form.Item>
                                        <Form.Item label="Năm sản xuất" name="year" rules={[{ required: true, message: 'Vui lòng nhập năm sản xuất!' }]}>
                                            <InputNumber 
                                                className="full-width" 
                                                min={1990} 
                                                max={new Date().getFullYear() + 1}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Màu sắc" name="color">
                                            <Input placeholder="VD: Trắng" />
                                        </Form.Item>
                                        <Form.Item label="Mức tiêu thụ (?L/100km)(?km/1 lần sạc)" name="fuelConsumption">
                                            <InputNumber 
                                                className="full-width" 
                                                step={0.1} 
                                                placeholder="VD: 7.5"
                                                style={{ width: '100%' }}
                                            />
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
                                    </Card>
                                </Col>

                                <Col xs={24} lg={12}>
                                    <Card 
                                        title="Thông tin chi tiết" 
                                        size="small"
                                        style={{ 
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <Form.Item label="Dòng xe (Model)" name="model" rules={[{ required: true, message: 'Vui lòng nhập dòng xe!' }]}>
                                            <Input placeholder="VD: Fadil, Vios,..." />
                                        </Form.Item>
                                        <Form.Item label="Số ghế" name="seats" rules={[{ required: true, message: 'Vui lòng nhập số ghế!' }]}>
                                            <InputNumber 
                                                className="full-width" 
                                                min={2} 
                                                max={16} 
                                                placeholder="VD: 5"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Biển số xe" name="licensePlate" rules={[{ required: true, message: 'Vui lòng nhập biển số!' }]}>
                                            <Input placeholder="VD: 51K-123.45" />
                                        </Form.Item>
                                        <Form.Item 
                                            label={
                                                <span>
                                                    <DollarOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                                    Giá cho thuê (VNĐ/ngày)
                                                </span>
                                            } 
                                            name="pricePerDay" 
                                            rules={[{ required: true, message: 'Vui lòng nhập giá cho thuê!' }]}
                                        >
                                            <InputNumber 
                                                className="full-width" 
                                                min={100000} 
                                                max={10000000} 
                                                step={50000}
                                                placeholder="VD: 500000"
                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Hãng xe" name="carBrandId" rules={[{ required: true, message: 'Vui lòng chọn hãng xe!' }]}>
                                            <Select 
                                                placeholder="Chọn hãng xe" 
                                                loading={brandsLoading}
                                                showSearch 
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                notFoundContent={brandsLoading ? <Spin size="small" /> : "Không tìm thấy hãng xe"}
                                                listHeight={200}
                                                virtual={false}
                                            >
                                                {carBrands.map(brand => (
                                                    <Option key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Loại nhiên liệu" name="fuelType" rules={[{ required: true, message: 'Vui lòng chọn nhiên liệu!' }]}>
                                            <Select placeholder="Chọn loại nhiên liệu">
                                                {FUEL_TYPE_OPTIONS.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Tính năng nổi bật" name="carFeatures">
                                            <Select 
                                                mode="multiple" 
                                                placeholder="Chọn nhiều tính năng" 
                                                showSearch 
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                listHeight={200}
                                                virtual={false}
                                            >
                                                {features.map(feature => (
                                                    <Option key={feature.id} value={feature.id}>
                                                        {feature.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col xs={24}>
                                    <Card 
                                        title="Địa chỉ xe" 
                                        size="small"
                                        style={{ 
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <Form.Item name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                                            <Input placeholder="VD: 79 Tô Ký, Phường Hiệp Thành, Quận 12, TP.HCM" />
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col xs={24}>
                                    <Card 
                                        title={
                                            <span>
                                                <CameraOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                                Hình ảnh xe
                                            </span>
                                        }
                                        size="small"
                                        style={{ 
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <Form.Item 
                                            name="images" 
                                            rules={[{ required: true, message: 'Vui lòng thêm ít nhất một hình ảnh xe!' }]}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                fileList={imageList}
                                                onChange={handleImageChange}
                                                onPreview={handlePreview}
                                                beforeUpload={() => false}
                                                accept="image/*"
                                                maxCount={10}
                                                style={{ width: '100%' }}
                                            >
                                                {imageList.length >= 10 ? null : uploadButton}
                                            </Upload>
                                        </Form.Item>
                                        <Text style={{ color: '#666', fontSize: '12px' }}>
                                            Tối đa 10 hình ảnh. Hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 5MB mỗi hình.
                                        </Text>
                                    </Card>
                                </Col>

                                <Col xs={24}>
                                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            size="large" 
                                            loading={isCreating}
                                            style={{
                                                height: '48px',
                                                padding: '0 48px',
                                                borderRadius: '24px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                border: 'none',
                                                boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
                                            }}
                                        >
                                            {isCreating ? 'Đang tạo xe...' : 'Đăng ký xe'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
            </div>

            <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                width="80%"
                style={{ top: 20 }}
            >
                <img alt="preview" style={{ width: '100%', borderRadius: '8px' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default OwnerCar;