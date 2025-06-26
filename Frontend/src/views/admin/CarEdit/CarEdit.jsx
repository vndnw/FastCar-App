import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Form,
    Input,
    InputNumber,
    Select,
    Checkbox,
    Button,
    Space,
    Divider,
    message,
    Spin,
    Upload,
    Modal
} from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    PlusOutlined,
    CarOutlined,
    UploadOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { carService } from '../../../services/carService';
import { carBrandService } from '../../../services/carBrandService';
import { featureService } from '../../../services/featureService';
import { imageService } from '../../../services/imageService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CarEdit = () => {
    const navigate = useNavigate();
    const { carId } = useParams();

    const [form] = Form.useForm();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [carBrands, setCarBrands] = useState([]);
    const [carFeatures, setCarFeatures] = useState([]);
    const [fileList, setFileList] = useState([]); // For file upload
    const [currentImages, setCurrentImages] = useState([]); // Current car images

    useEffect(() => {
        fetchCarDetail();
        fetchCarBrands();
        fetchCarFeatures();
    }, [carId]);

    const fetchCarDetail = async () => {
        try {
            setInitialLoading(true);
            const result = await carService.getCarById(carId); if (result.status === 200 && result.data) {
                const carData = result.data;
                setCar(carData);

                // Store current images
                const images = carData.images || [];
                setCurrentImages(images);

                // Set form values
                form.setFieldsValue({
                    name: carData.name,
                    model: carData.model,
                    year: carData.year,
                    seats: carData.seats,
                    transmission: carData.transmission,
                    type: carData.carType,
                    carBrandId: carData.carBrand?.id || carData.carBrandId,
                    fuelType: carData.fuelType,
                    color: carData.color,
                    licensePlate: carData.licensePlate,
                    fuelConsumption: carData.fuelConsumption,
                    pricePerHour: carData.pricePerHour,
                    pricePer4Hour: carData.pricePer4Hour,
                    pricePer8Hour: carData.pricePer8Hour,
                    pricePer12Hour: carData.pricePer12Hour,
                    pricePer24Hour: carData.pricePer24Hour,
                    description: carData.description,
                    // Handle location data - parse address into separate fields if needed
                    street: carData.location?.street || (carData.location?.address ? carData.location.address.split(',')[0]?.trim() : ''),
                    ward: carData.location?.ward || (carData.location?.address ? carData.location.address.split(',')[1]?.trim() : ''),
                    district: carData.location?.district || (carData.location?.address ? carData.location.address.split(',')[2]?.trim() : ''),
                    city: carData.location?.city || (carData.location?.address ? carData.location.address.split(',')[3]?.trim() : ''),
                    address: carData.location?.address || '',
                    latitude: carData.location?.latitude || 10.8231,
                    longitude: carData.location?.longitude || 106.6297,
                    locationId: carData.location?.id,
                    carFeatures: carData.features?.map(f => f.id) || carData.carFeatures || []
                });
            } else {
                message.error('Failed to fetch car details');
                navigate('/admin/cars');
            }
        } catch (error) {
            console.error('Error fetching car details:', error);
            message.error('Failed to fetch car details');
            navigate('/admin/cars');
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchCarBrands = async () => {
        try {
            const result = await carBrandService.getCarBrands(0, 9999);
            if (result.status === 0 && result.data && result.data.content) {
                setCarBrands(result.data.content);
            }
        } catch (error) {
            console.error('Error fetching car brands:', error);
        }
    };

    const fetchCarFeatures = async () => {
        try {
            const result = await featureService.getFeatures(0, 9999);
            if (result.status === 200 && result.data && result.data.content) {
                setCarFeatures(result.data.content);
            } else {
                setCarFeatures([]);
            }
        } catch (error) {
            console.error('Error fetching car features:', error);
            setCarFeatures([]);
        }
    };

    const updateAddressField = (changedFields, allFields, formInstance) => {
        const changedField = changedFields[0];
        if (changedField && ['street', 'ward', 'district', 'city'].includes(changedField.name[0])) {
            const street = formInstance.getFieldValue('street') || '';
            const ward = formInstance.getFieldValue('ward') || '';
            const district = formInstance.getFieldValue('district') || '';
            const city = formInstance.getFieldValue('city') || '';

            const fullAddress = [street, ward, district, city]
                .filter(part => part.trim() !== '')
                .join(', ');

            formInstance.setFieldsValue({ address: fullAddress });
        }
    };

    const handleSubmit = async (values) => {
        await handleCarInfoUpdate(values);
    };

    // Handle car information update (without images)
    const handleCarInfoUpdate = async (values) => {
        try {
            setLoading(true);

            const carData = {
                name: values.name,
                carBrandId: values.carBrandId,
                model: values.model,
                year: values.year,
                seats: values.seats,
                transmission: values.transmission,
                type: values.type,
                licensePlate: values.licensePlate,
                pricePerHour: values.pricePerHour,
                pricePer4Hour: values.pricePer4Hour,
                pricePer8Hour: values.pricePer8Hour,
                pricePer12Hour: values.pricePer12Hour,
                pricePer24Hour: values.pricePer24Hour,
                fuelType: values.fuelType,
                fuelConsumption: values.fuelConsumption,
                color: values.color,
                description: values.description,
                carFeatures: values.carFeatures || [],
                location: {
                    id: values.locationId,
                    address: values.address,
                    latitude: values.latitude,
                    longitude: values.longitude,
                    street: values.street,
                    ward: values.ward,
                    district: values.district,
                    city: values.city,
                }
            };

            const result = await carService.updateCar(car.id, carData);

            if (result.status === 200) {
                message.success('Car information updated successfully!');
                // Refresh car data
                await fetchCarDetail();
            } else {
                message.error('Failed to update car information');
            }
        } catch (error) {
            console.error('Error updating car:', error);
            message.error('Failed to update car information');
        } finally {
            setLoading(false);
        }
    };

    // Handle image upload separately
    const handleImageUpload = async () => {
        if (fileList.length === 0) {
            message.warning('Please select images to upload');
            return;
        }

        try {
            setImageLoading(true);

            // Extract actual files from fileList
            const files = fileList.map(file => file.originFileObj || file).filter(file => file instanceof File);

            if (files.length === 0) {
                message.warning('No valid files selected');
                return;
            }

            const result = await imageService.uploadCarImages(car.id, files);

            if (result.status === 200) {
                message.success('Images uploaded successfully!');
                // Clear file list
                setFileList([]);
                // Refresh car data to show new images
                await fetchCarDetail();
            } else {
                message.error('Failed to upload images');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            message.error('Failed to upload images');
        } finally {
            setImageLoading(false);
        }
    };

    // Handle file list change
    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Handle removing current images
    const handleRemoveCurrentImage = async (imageId) => {
        try {
            await imageService.deleteCarImage(car.id, imageId);
            message.success('Image removed successfully');
            await fetchCarDetail(); // Refresh to show updated images
        } catch (error) {
            console.error('Error removing image:', error);
            message.error('Failed to remove image');
        }
    };

    // Handle removing all current images
    const handleRemoveAllImages = async () => {
        try {
            await imageService.deleteAllCarImages(car.id);
            message.success('All images removed successfully');
            await fetchCarDetail(); // Refresh to show updated images
        } catch (error) {
            console.error('Error removing all images:', error);
            message.error('Failed to remove all images');
        }
    };

    if (!car) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <CarOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                    <Title level={4} style={{ color: '#666' }}>Car not found</Title>
                    <Button type="primary" onClick={() => navigate('/admin/cars')}>
                        Back to Cars
                    </Button>
                </div>
            </Card>
        );
    }

    if (initialLoading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>Loading car data...</div>
                </div>
            </Card>
        );
    }

    return (
        <div>
            {/* Header */}
            <Card style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/admin/cars')}
                            >
                                Back to Cars
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>
                                Edit Car: {car.name}
                            </Title>
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => form.submit()}
                            loading={loading}
                        >
                            Save Changes
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Form */}
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    onFieldsChange={(changedFields, allFields) => updateAddressField(changedFields, allFields, form)}
                >
                    {/* Hidden fields for latitude and longitude */}
                    <Form.Item name="latitude" style={{ display: 'none' }}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="longitude" style={{ display: 'none' }}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="locationId" style={{ display: 'none' }}>
                        <Input />
                    </Form.Item>

                    <Divider>Basic Information</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Car Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter car name' }]}
                            >
                                <Input placeholder="Enter car name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Car Brand"
                                name="carBrandId"
                                rules={[{ required: true, message: 'Please select car brand' }]}
                            >
                                <Select placeholder="Select car brand">
                                    {carBrands.map(brand => (
                                        <Option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Model"
                                name="model"
                                rules={[{ required: true, message: 'Please enter model' }]}
                            >
                                <Input placeholder="Enter model" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Year"
                                name="year"
                                rules={[{ required: true, message: 'Please enter year' }]}
                            >
                                <InputNumber
                                    placeholder="Enter year"
                                    min={1990}
                                    max={new Date().getFullYear() + 1}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Seats"
                                name="seats"
                                rules={[{ required: true, message: 'Please enter number of seats' }]}
                            >
                                <InputNumber
                                    placeholder="Number of seats"
                                    min={2}
                                    max={50}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Transmission"
                                name="transmission"
                                rules={[{ required: true, message: 'Please select transmission' }]}
                            >
                                <Select placeholder="Select transmission">
                                    <Option value="AUTO">Automatic</Option>
                                    <Option value="MANUAL">Manual</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Car Type"
                                name="type"
                                rules={[{ required: true, message: 'Please select car type' }]}
                            >
                                <Select placeholder="Select car type">
                                    <Option value="ECONOMY">Economy</Option>
                                    <Option value="STANDARD">Standard</Option>
                                    <Option value="PREMIUM">Premium</Option>
                                    <Option value="LUXURY">Luxury</Option>
                                    <Option value="SUPER_LUXURY">Super Luxury</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="License Plate"
                                name="licensePlate"
                                rules={[{ required: true, message: 'Please enter license plate' }]}
                            >
                                <Input placeholder="Enter license plate" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Pricing Information</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Price per Hour"
                                name="pricePerHour"
                                rules={[{ required: true, message: 'Please enter hourly price' }]}
                            >
                                <InputNumber
                                    placeholder="Price per hour"
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Price per 4 Hours"
                                name="pricePer4Hour"
                            >
                                <InputNumber
                                    placeholder="Price per 4 hours"
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Price per 8 Hours"
                                name="pricePer8Hour"
                            >
                                <InputNumber
                                    placeholder="Price per 8 hours"
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Price per 12 Hours"
                                name="pricePer12Hour"
                            >
                                <InputNumber
                                    placeholder="Price per 12 hours"
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Price per Day"
                                name="pricePer24Hour"
                                rules={[{ required: true, message: 'Please enter daily price' }]}
                            >
                                <InputNumber
                                    placeholder="Price per day"
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Vehicle Details</Divider>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Fuel Type"
                                name="fuelType"
                                rules={[{ required: true, message: 'Please select fuel type' }]}
                            >
                                <Select placeholder="Select fuel type">
                                    <Option value="GASOLINE">Gasoline</Option>
                                    <Option value="DIESEL">Diesel</Option>
                                    <Option value="ELECTRIC">Electric</Option>
                                    <Option value="HYBRID">Hybrid</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Fuel Consumption"
                                name="fuelConsumption"
                            >
                                <Input placeholder="e.g., 7 L/100km" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Color"
                                name="color"
                                rules={[{ required: true, message: 'Please enter color' }]}
                            >
                                <Input placeholder="Enter color" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Location Information</Divider>

                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                label="Street"
                                name="street"
                                rules={[{ required: true, message: 'Please enter street' }]}
                            >
                                <Input placeholder="Enter street" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Ward"
                                name="ward"
                                rules={[{ required: true, message: 'Please enter ward' }]}
                            >
                                <Input placeholder="Enter ward" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="District"
                                name="district"
                                rules={[{ required: true, message: 'Please enter district' }]}
                            >
                                <Input placeholder="Enter district" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: 'Please enter city' }]}
                            >
                                <Input placeholder="Enter city" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Full Address"
                                name="address"
                            >
                                <Input
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Features</Divider>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Car Features"
                                name="carFeatures"
                            >
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Row gutter={[16, 8]}>
                                        {carFeatures.map(feature => (
                                            <Col span={8} key={feature.id}>
                                                <Checkbox value={feature.id}>
                                                    {feature.name}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Images & Description</Divider>

                    {/* Current Images Section */}
                    <Divider>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span>Current Car Images</span>
                            {currentImages.length > 0 && (
                                <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: 'Delete All Images',
                                            content: 'Are you sure you want to delete all car images? This action cannot be undone.',
                                            okText: 'Yes, Delete All',
                                            okType: 'danger',
                                            cancelText: 'Cancel',
                                            onOk: handleRemoveAllImages,
                                        });
                                    }}
                                >
                                    Delete All Images
                                </Button>
                            )}
                        </div>
                    </Divider>
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        {currentImages.map((image, index) => (
                            <Col key={index} span={6}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={image.imageUrl || image.url}
                                        alt={`Car image ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: 120,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            border: '1px solid #d9d9d9'
                                        }}
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveCurrentImage(image.id)}
                                        style={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                        }}
                                    />
                                </div>
                            </Col>
                        ))}
                        {currentImages.length === 0 && (
                            <Col span={24}>
                                <div style={{
                                    textAlign: 'center',
                                    color: '#999',
                                    padding: '20px',
                                    border: '1px dashed #d9d9d9',
                                    borderRadius: 8
                                }}>
                                    No images uploaded yet
                                </div>
                            </Col>
                        )}
                    </Row>

                    {/* Upload New Images Section */}
                    <Divider>Upload New Images</Divider>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleFileChange}
                                beforeUpload={() => false} // Prevent auto upload
                                multiple
                                accept="image/*"
                            >
                                {fileList.length >= 8 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                onClick={handleImageUpload}
                                loading={imageLoading}
                                disabled={fileList.length === 0}
                                block
                            >
                                Upload Images
                            </Button>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter car description"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 32, textAlign: 'right' }}>
                        <Space size="middle">
                            <Button size="large" onClick={() => navigate('/admin/cars')}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                icon={<SaveOutlined />}
                            >
                                Update Car Information
                            </Button>
                        </Space>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'right' }}>
                            * This will only update car information (not images)
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CarEdit;
