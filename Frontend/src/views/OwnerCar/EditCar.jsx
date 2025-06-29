import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Row, Col, message, Card, Space, Spin, Upload, Image, Modal, Divider, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, CarOutlined, CameraOutlined, DollarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCar } from '../../contexts/CarContext';
import { useAuth } from '../../contexts/AuthContext';
import featureService from '../../services/featureService';
import carBrandService from '../../services/carBrandService';
import { useNavigate, useParams } from 'react-router-dom';
import './EditCar.css';

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

const EditCar = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { carId } = useParams();
    const { user } = useAuth();
    const { getCarById, updateCar } = useCar();

    const [features, setFeatures] = useState([]);
    const [carBrands, setCarBrands] = useState([]);
    const [isInitializing, setIsInitializing] = useState(true);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [carData, setCarData] = useState(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setBrandsLoading(true);
                
                // Fetch car details, features, and car brands in parallel
                const [carRes, featuresRes, brandsRes] = await Promise.all([
                    getCarById(carId),
                    featureService.getFeatures(0, 100, 'createdAt,desc'),
                    carBrandService.getCarBrands(0, 100, 'id,desc')
                ]);

                if (carRes.success) {
                    setCarData(carRes.data);
                    
                    // Convert existing images to file list format
                    if (carRes.data.images && carRes.data.images.length > 0) {
                        const existingImages = carRes.data.images.map((imageUrl, index) => ({
                            uid: `existing-${index}`,
                            name: `image-${index}.jpg`,
                            status: 'done',
                            url: imageUrl,
                            originFileObj: null // This is an existing image, not a new file
                        }));
                        setImageList(existingImages);
                    }
                } else {
                    message.error('Không thể tải thông tin xe!');
                    navigate('/my-cars');
                    return;
                }

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

        if (carId) {
            initializeData();
        }
    }, [carId, getCarById, navigate]);

    // Set form values when car data is loaded
    useEffect(() => {
        if (carData) {
            form.setFieldsValue({
                name: carData.name,
                model: carData.model,
                year: carData.year,
                seats: carData.seats,
                transmission: carData.transmission,
                type: carData.type,
                carBrandId: carData.carBrandId,
                fuelType: carData.fuelType,
                color: carData.color,
                licensePlate: carData.licensePlate,
                fuelConsumption: carData.fuelConsumption,
                pricePerDay: carData.pricePerHour,
                carFeatures: carData.carFeatures?.map(f => f.id) || [],
                address: carData.location?.address || ''
            });
        }
    }, [carData, form]);

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

        setIsUpdating(true);

        try {
            const { address, ...rest } = values;
            
            // Prepare car data according to API structure
            const updatedCarData = {
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
                    latitude: carData.location?.latitude || "10.8231",
                    longitude: carData.location?.longitude || "106.6297",
                }
            };

            const result = await updateCar(carId, updatedCarData);

            if (result.success) {
                message.success('Cập nhật xe thành công!');
                navigate('/my-cars');
            } else {
                message.error(result.error || 'Cập nhật xe thất bại.');
            }
        } catch (error) {
            console.error('Error updating car:', error);
            message.error('Đã xảy ra lỗi khi cập nhật xe. Vui lòng thử lại.');
        } finally {
            setIsUpdating(false);
        }
    };

    const onFinishFailed = () => {
        message.warning('Vui lòng điền đầy đủ các thông tin bắt buộc!');
    };

    if (isInitializing) {
        return (
            <div className="edit-car-page" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Card style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Spin size="large" tip="Đang tải thông tin xe..." />
                </Card>
            </div>
        );
    }

    return (
        <div className="edit-car-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Card 
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ArrowLeftOutlined 
                                style={{ fontSize: '20px', cursor: 'pointer' }} 
                                onClick={() => navigate('/my-cars')}
                            />
                            <CarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Title level={3} style={{ margin: 0, color: '#1a1a1a' }}>
                                Chỉnh sửa thông tin xe
                            </Title>
                        </div>
                    } 
                    className="edit-car-card"
                    style={{
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: 'none',
                        overflow: 'hidden'
                    }}
                    headStyle={{
                        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
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
                            Cập nhật thông tin xe của bạn. Những thay đổi sẽ được áp dụng ngay lập tức.
                        </Text>
                        
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
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
                                                Hình ảnh xe (hiện tại)
                                            </span>
                                        }
                                        size="small"
                                        style={{ 
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <Text style={{ color: '#666', fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                                            Hình ảnh hiện tại của xe. Để thay đổi hình ảnh, vui lòng liên hệ với quản trị viên.
                                        </Text>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            {carData?.images?.map((imageUrl, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <Image
                                                        width={120}
                                                        height={80}
                                                        src={imageUrl}
                                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </Col>

                                <Col xs={24}>
                                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                        <Space size="large">
                                            <Button 
                                                size="large"
                                                onClick={() => navigate('/my-cars')}
                                                style={{
                                                    height: '48px',
                                                    padding: '0 32px',
                                                    borderRadius: '24px',
                                                    fontSize: '16px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit" 
                                                size="large" 
                                                loading={isUpdating}
                                                style={{
                                                    height: '48px',
                                                    padding: '0 48px',
                                                    borderRadius: '24px',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                                                    border: 'none',
                                                    boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
                                                }}
                                            >
                                                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật xe'}
                                            </Button>
                                        </Space>
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

export default EditCar; 