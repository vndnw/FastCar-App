import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    Tag,
    Space,
    message,
    Popconfirm,
    Typography,
    Divider,
    Upload,
    Image,
    Select, InputNumber,
    DatePicker,
    Tabs,
    Checkbox,
    Dropdown,
    Menu
} from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined, CarOutlined,
    UploadOutlined,
    SearchOutlined,
    SettingOutlined,
    ReloadOutlined,
    DownOutlined,
    CheckCircleOutlined,
    ToolOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { carService } from "../../services/carService";
import { carBrandService } from "../../services/carBrandService";
import { featureService } from "../../services/featureService";
import { imageService } from "../../services/imageService";
import { useAuth } from "../../contexts/AuthContext";
import FeatureDisplay from "../../components/FeatureDisplay";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Cars = () => {
    const { user } = useAuth(); // Get current user from auth context
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [carBrands, setCarBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} cars`,
    });    // State for car features (tính năng xe)
    const [carFeatures, setCarFeatures] = useState([]);

    // Feature CRUD state
    const [featureCreateModalVisible, setFeatureCreateModalVisible] = useState(false);
    const [featureEditModalVisible, setFeatureEditModalVisible] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [featureCreateLoading, setFeatureCreateLoading] = useState(false);
    const [featureEditLoading, setFeatureEditLoading] = useState(false);
    const [featureForm] = Form.useForm();
    const [featureEditForm] = Form.useForm(); useEffect(() => {
        fetchCars();
        fetchCarBrands();
        fetchCarFeatures();

        // Cleanup function to clear search timeout
        return () => {
            if (window.searchTimeout) {
                clearTimeout(window.searchTimeout);
            }
        };
    }, []);

    const fetchCars = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            // API pagination starts from 0, but UI starts from 1
            const result = await carService.getCars(page - 1, pageSize);

            if (result.status === 200 && result.data && result.data.content) {
                const mappedCars = result.data.content.map(car => ({
                    id: car.id,
                    key: car.id,
                    name: car.name,
                    emailOwner: car.emailOwner,
                    username: car.username,
                    carBrand: car.carBrand,
                    model: car.model,
                    year: car.year,
                    seats: car.seats,
                    transmission: car.transmission,
                    carType: car.carType,
                    licensePlate: car.licensePlate,
                    pricePerHour: car.pricePerHour,
                    pricePer4Hour: car.pricePer4Hour,
                    pricePer8Hour: car.pricePer8Hour,
                    pricePer12Hour: car.pricePer12Hour,
                    pricePer24Hour: car.pricePer24Hour,
                    fuelType: car.fuelType,
                    fuelConsumption: car.fuelConsumption,
                    status: car.status,
                    color: car.color,
                    description: car.description,
                    images: car.images || [],
                    features: car.features,
                    location: car.location,
                    createdAt: car.createdAt,
                    updatedAt: car.updatedAt,
                }));
                setCars(mappedCars);

                // Update pagination info
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: result.data.totalElements || 0,
                }));
            } else {
                message.error('Failed to fetch cars');
                setCars([]);
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            message.error('Failed to fetch cars');
            setCars([]);
        } finally {
            setLoading(false);
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
    }; const fetchCarFeatures = async () => {
        try {
            const result = await featureService.getFeatures(0, 9999); // Get all features
            if (result.status === 200 && result.data && result.data.content) {
                setCarFeatures(result.data.content);
            } else {
                setCarFeatures([]);
            }
        } catch (error) {
            console.error('Error fetching car features:', error);
            message.error('Failed to fetch car features');
            setCarFeatures([]);
        }
    };

    // Feature CRUD handlers
    const handleCreateFeature = async (values) => {
        try {
            setFeatureCreateLoading(true);
            const result = await featureService.createFeature(values);

            if (result.status === 201 || result.status === 200) {
                message.success('Feature created successfully!');
                setFeatureCreateModalVisible(false);
                featureForm.resetFields();
                fetchCarFeatures(); // Refresh the features list
            } else {
                message.error('Failed to create feature');
            }
        } catch (error) {
            console.error('Error creating feature:', error);
            message.error('Failed to create feature');
        } finally {
            setFeatureCreateLoading(false);
        }
    };

    const handleEditFeature = async (values) => {
        try {
            setFeatureEditLoading(true);
            const result = await featureService.updateFeature(selectedFeature.id, values);

            if (result.status === 200) {
                message.success('Feature updated successfully!');
                setFeatureEditModalVisible(false);
                setSelectedFeature(null);
                featureEditForm.resetFields();
                fetchCarFeatures(); // Refresh the features list
            } else {
                message.error('Failed to update feature');
            }
        } catch (error) {
            console.error('Error updating feature:', error);
            message.error('Failed to update feature');
        } finally {
            setFeatureEditLoading(false);
        }
    };

    const handleDeleteFeature = async (featureId) => {
        try {
            const result = await featureService.deleteFeature(featureId);

            if (result.status === 200 || result.status === 204) {
                message.success('Feature deleted successfully!');
                fetchCarFeatures(); // Refresh the features list
            } else {
                message.error('Failed to delete feature');
            }
        } catch (error) {
            console.error('Error deleting feature:', error);
            message.error('Failed to delete feature');
        }
    };

    const showEditFeatureModal = (feature) => {
        setSelectedFeature(feature);
        featureEditForm.setFieldsValue(feature);
        setFeatureEditModalVisible(true);
    };

    const updateAddressField = (changedFields, allFields, form) => {
        const street = form.getFieldValue('street') || '';
        const ward = form.getFieldValue('ward') || '';
        const district = form.getFieldValue('district') || '';
        const city = form.getFieldValue('city') || '';

        const addressParts = [street, ward, district, city].filter(part => part.trim() !== '');
        const fullAddress = addressParts.join(', ');

        form.setFieldsValue({ address: fullAddress });
    };

    const handleCreateCar = async (values) => {
        try {
            setCreateLoading(true);

            // Generate full address from individual fields
            const addressParts = [values.street, values.ward, values.district, values.city].filter(part => part && part.trim() !== '');
            const fullAddress = addressParts.join(', ');

            // Prepare car data without images first
            const carData = {
                name: values.name,
                model: values.model,
                year: values.year,
                seats: values.seats,
                transmission: values.transmission, // AUTO or MANUAL
                type: values.carType, // STANDARD, LUXURY, SUPER_LUXURY
                carBrandId: values.carBrandId,
                fuelType: values.fuelType, // OIL, GASOLINE, ELECTRIC, HYBRID
                color: values.color,
                location: {
                    address: fullAddress,
                    street: values.street || '',
                    ward: values.ward || '',
                    district: values.district || '',
                    city: values.city || '',
                    latitude: values.latitude || 10.8231,  // Default latitude for Ho Chi Minh City
                    longitude: values.longitude || 106.6297  // Default longitude for Ho Chi Minh City
                },
                carFeatures: values.carFeatures || [], // Array of feature IDs
                licensePlate: values.licensePlate,
                fuelConsumption: values.fuelConsumption,
                pricePerHour: values.pricePerHour,
                pricePer4Hour: values.pricePer4Hour,
                pricePer8Hour: values.pricePer8Hour,
                pricePer12Hour: values.pricePer12Hour,
                pricePer24Hour: values.pricePer24Hour,
                description: values.description
            };

            // First create the car without images
            const result = await carService.createCarByUser(user.id, carData);

            if (result.status === 201 || result.status === 200) {
                const createdCarId = result.data?.id;

                // If car created successfully and there are images, upload them separately
                if (createdCarId && values.carImages) {
                    try {
                        await imageService.uploadCarImages(createdCarId, values.carImages);
                        message.success('Car created successfully with images');
                    } catch (imageError) {
                        console.error('Error uploading images:', imageError);
                        message.warning('Car created successfully, but failed to upload some images');
                    }
                } else {
                    message.success('Car created successfully');
                }

                setCreateModalVisible(false);
                form.resetFields();
                fetchCars(pagination.current, pagination.pageSize);
            } else {
                message.error('Failed to create car');
            }
        } catch (error) {
            console.error('Error creating car:', error);
            message.error('Failed to create car');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteCar = async (id) => {
        try {
            const result = await carService.deleteCar(id);

            if (result.status === 200) {
                message.success('Car deleted successfully');
                fetchCars(pagination.current, pagination.pageSize);
            } else {
                message.error('Failed to delete car');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            message.error('Failed to delete car');
        }
    };

    // Handle pagination change
    const handleTableChange = (paginationInfo) => {
        const { current, pageSize } = paginationInfo;
        fetchCars(current, pageSize);
    };

    const handleViewCar = (car) => {
        navigate(`/admin/cars/${car.id}`);
    };

    const openEditModal = (car) => {
        navigate(`/admin/cars/edit/${car.id}`);
    };

    const handleSearch = async (searchValue = searchText) => {
        if (searchValue.trim()) {
            try {
                setLoading(true);
                const result = await carService.getCarsByName(searchValue, 0, pagination.pageSize);

                if (result.status === 200 && result.data && result.data.content) {
                    const mappedCars = result.data.content.map(car => ({
                        id: car.id,
                        key: car.id,
                        name: car.name,
                        emailOwner: car.emailOwner,
                        username: car.username,
                        carBrand: car.carBrand,
                        model: car.model,
                        year: car.year,
                        seats: car.seats,
                        transmission: car.transmission,
                        carType: car.carType,
                        licensePlate: car.licensePlate,
                        pricePerHour: car.pricePerHour,
                        pricePer4Hour: car.pricePer4Hour,
                        pricePer8Hour: car.pricePer8Hour,
                        pricePer12Hour: car.pricePer12Hour,
                        pricePer24Hour: car.pricePer24Hour,
                        fuelType: car.fuelType,
                        fuelConsumption: car.fuelConsumption,
                        status: car.status,
                        color: car.color,
                        description: car.description,
                        images: car.images || [],
                        features: car.features,
                        location: car.location,
                        createdAt: car.createdAt,
                        updatedAt: car.updatedAt,
                    }));
                    setCars(mappedCars);
                    setPagination(prev => ({
                        ...prev,
                        current: 1,
                        total: result.data.totalElements || 0,
                    }));
                }
            } catch (error) {
                console.error('Error searching cars:', error);
                message.error('Failed to search cars');
            } finally {
                setLoading(false);
            }
        } else {
            fetchCars(1, pagination.pageSize);
        }
    };

    // Handle search input change with debounce
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        // Clear previous timeout
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }

        // Set new timeout for debounced search
        window.searchTimeout = setTimeout(() => {
            handleSearch(value);
        }, 500); // 500ms delay
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }; const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'blue';
            case 'AVAILABLE':
                return 'green';
            case 'UNAVAILABLE':
                return 'gray';
            case 'MAINTENANCE':
                return 'red';
            default:
                return 'blue';
        }
    };

    const getTransmissionColor = (transmission) => {
        return transmission === 'AUTO' ? 'blue' : 'green';
    };

    const getCarTypeColor = (carType) => {
        switch (carType) {
            case 'STANDARD':
                return 'blue';
            case 'PREMIUM':
                return 'purple';
            case 'LUXURY':
                return 'gold';
            case 'ECONOMY':
                return 'green';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Car Info',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12
                    }}>
                        {record.images && record.images.length > 0 ? (
                            <Image
                                width={60}
                                height={60}
                                src={record.images[0].imageUrl || record.images[0]}
                                style={{ borderRadius: 8 }}
                                fallback={<ImagePlaceholder />}
                            />
                        ) : (
                            <CarOutlined style={{ fontSize: 24, color: '#999' }} />
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: 14 }}>{text}</div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                            {record.carBrand?.name} {record.model} ({record.year})
                        </div>
                        <div style={{ color: '#999', fontSize: 11 }}>
                            {record.licensePlate}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Owner',
            dataIndex: 'emailOwner',
            key: 'emailOwner',
            width: '15%',
            render: (email) => (
                <div style={{ fontSize: 12 }}>
                    <div style={{ color: '#666' }}>{email}</div>
                </div>
            ),
        },
        {
            title: 'Specifications',
            key: 'specs',
            width: '20%',
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <Tag color={getTransmissionColor(record.transmission)}>
                            {record.transmission}
                        </Tag>
                        <Tag color={getCarTypeColor(record.carType)}>
                            {record.carType}
                        </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {record.seats} seats • {record.fuelType}
                    </div>
                    <div style={{ fontSize: 11, color: '#999' }}>
                        {record.fuelConsumption}
                    </div>
                </div>
            ),
        },
        {
            title: 'Pricing',
            key: 'pricing',
            width: '15%',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: 13 }}>
                        {formatCurrency(record.pricePerHour)}/hour
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                        Daily: {formatCurrency(record.pricePer24Hour)}
                    </div>
                </div>
            ),
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '12%',
            render: (status, record) => (
                <Dropdown
                    overlay={
                        <Menu onClick={({ key }) => handleStatusChange(record.id, key)}
                            items={[
                                {
                                    key: 'PENDING',
                                    label: (
                                        <span style={{ color: '#1890ff' }}>
                                            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                                            Pending
                                        </span>
                                    ),
                                    disabled: status === 'PENDING'
                                },
                                {
                                    key: 'AVAILABLE',
                                    label: (
                                        <span style={{ color: '#52c41a' }}>
                                            <CheckCircleOutlined style={{ marginRight: 8 }} />
                                            Available
                                        </span>
                                    ),
                                    disabled: status === 'AVAILABLE'
                                },
                                {
                                    key: 'UNAVAILABLE',
                                    label: (
                                        <span style={{ color: '#d9d9d9' }}>
                                            <StopOutlined style={{ marginRight: 8 }} />
                                            Unavailable
                                        </span>
                                    ),
                                    disabled: status === 'UNAVAILABLE'
                                },
                                {
                                    key: 'MAINTENANCE',
                                    label: (
                                        <span style={{ color: '#ff4d4f' }}>
                                            <ToolOutlined style={{ marginRight: 8 }} />
                                            Maintenance
                                        </span>
                                    ),
                                    disabled: status === 'MAINTENANCE'
                                }
                            ]}
                        />
                    }
                    trigger={['click']}
                >
                    <Tag
                        color={getStatusColor(status)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        title="Click to change status"
                    >
                        {status} <DownOutlined style={{ fontSize: 10 }} />
                    </Tag>
                </Dropdown>
            ),
        }, {
            title: 'Location',
            key: 'location',
            width: '15%',
            render: (_, record) => (
                <div style={{ fontSize: 12 }}>
                    {record.location?.address ? (
                        <div>
                            <div>{record.location.address.split(',')[0]}</div>
                            <div style={{ color: '#666' }}>
                                {record.location.address.split(',').slice(1).join(',')}
                            </div>
                        </div>
                    ) : (
                        <span style={{ color: '#999' }}>No location</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewCar(record)}
                        size="small"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this car?"
                        onConfirm={() => handleDeleteCar(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Tab items
    const tabItems = [
        {
            key: "all",
            label: "All Cars",
            children: (
                <div>
                    {/* Toàn bộ nội dung quản lý xe cũ */}
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                        <Title level={4} style={{ margin: 0 }}>Car Management</Title>
                                    </div>
                                }
                                extra={
                                    <Space>
                                        <Input
                                            placeholder="Search cars..."
                                            value={searchText}
                                            onChange={handleSearchInputChange}
                                            onPressEnter={() => handleSearch()}
                                            style={{ width: 200 }}
                                            suffix={
                                                <SearchOutlined
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSearch()}
                                                />
                                            }
                                        />
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                setCreateModalVisible(true);
                                                fetchCarFeatures(); // Refresh features when opening modal
                                            }}
                                        >
                                            Add Car
                                        </Button>
                                    </Space>
                                }
                            >
                                <div className="table-responsive">
                                    <Table
                                        columns={columns}
                                        dataSource={cars}
                                        pagination={pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                        scroll={{ x: 1200 }}
                                        size="middle"
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Create Car Modal */}
                    <Modal
                        title={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <PlusOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                Add New Car
                            </div>
                        }
                        open={createModalVisible}
                        onCancel={() => {
                            setCreateModalVisible(false);
                            form.resetFields();
                        }}
                        footer={null}
                        width={800}
                        destroyOnClose
                    >                        <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateCar}
                        onFieldsChange={(changedFields, allFields) => updateAddressField(changedFields, allFields, form)}
                        style={{ marginTop: 16 }}
                        initialValues={{
                            latitude: 10.8231,  // Default latitude for Ho Chi Minh City
                            longitude: 106.6297  // Default longitude for Ho Chi Minh City
                        }}
                    >
                            {/* Hidden fields for latitude and longitude */}
                            <Form.Item name="latitude" style={{ display: 'none' }}>
                                <InputNumber />
                            </Form.Item>
                            <Form.Item name="longitude" style={{ display: 'none' }}>
                                <InputNumber />
                            </Form.Item>
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
                                        name="carType"
                                        rules={[{ required: true, message: 'Please select car type' }]}
                                    >
                                        <Select placeholder="Select car type">
                                            <Option value="STANDARD">Standard</Option>
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
                                            <Option value="OIL">Oil</Option>
                                            <Option value="GASOLINE">Gasoline</Option>
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
                            </Row>                            <Row gutter={16}>
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

                            <Divider>Features & Description</Divider><Row gutter={16}>
                                <Col span={20}>
                                    <Form.Item
                                        label="Car Features"
                                        name="carFeatures"
                                    >
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
                                        >
                                            <Row gutter={[16, 8]}>
                                                {carFeatures.map(feature => (
                                                    <Col span={8} key={feature.id}>
                                                        <Checkbox value={feature.id}>
                                                            {feature.name}
                                                        </Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item label=" " style={{ marginTop: 30 }}>
                                        <Button
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={() => setFeatureCreateModalVisible(true)}
                                            size="small"
                                            title="Add new feature"
                                        >
                                            Add Feature
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Enter car description"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                                <Space>
                                    <Button
                                        onClick={() => {
                                            setCreateModalVisible(false);
                                            form.resetFields();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={createLoading}
                                    >
                                        Create Car
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            ),
        },
        {
            key: "features",
            label: "Car Features",
            children: (
                <div>
                    <Row gutter={[24, 0]}>
                        <Col xs="24" xl={24}>
                            <Card
                                bordered={false}
                                className="criclebox tablespace mb-24"
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <SettingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                        <Title level={4} style={{ margin: 0 }}>Car Features Management</Title>
                                    </div>
                                }
                                extra={
                                    <Space>
                                        <Button
                                            icon={<ReloadOutlined />}
                                            onClick={fetchCarFeatures}
                                            loading={loading}
                                        >
                                            Refresh
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setFeatureCreateModalVisible(true)}
                                        >
                                            Add Feature
                                        </Button>
                                    </Space>
                                }
                            >                                {/* Statistics */}
                                <Row gutter={16} style={{ marginBottom: 24 }}>
                                    <Col xs={24} sm={24}>
                                        <Card size="small" style={{ textAlign: 'center' }}>
                                            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                                                {carFeatures.length}
                                            </Title>
                                            <Text type="secondary">Total Features</Text>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* Features Display */}                                <FeatureDisplay
                                    features={carFeatures}
                                    title="Available Car Features"
                                    showHeader={false}
                                    loading={loading}
                                    emptyText="No car features found. Add some features to get started."
                                    onEdit={showEditFeatureModal}
                                    onDelete={handleDeleteFeature}
                                    showActions={true}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ),
        },
    ]; const handleStatusChange = async (carId, newStatus) => {
        try {
            const result = await carService.updateCarStatus(carId, newStatus);

            if (result.status === 200) {
                message.success(`Car status updated to ${newStatus}`);
                fetchCars(pagination.current, pagination.pageSize);
            } else {
                message.error('Failed to update car status');
            }
        } catch (error) {
            console.error('Error updating car status:', error);
            message.error('Failed to update car status');
        }
    };

    return (
        <>
            <Tabs defaultActiveKey="all" items={tabItems} />

            {/* Feature Create Modal */}
            <Modal
                title="Add New Feature"
                open={featureCreateModalVisible}
                onOk={() => featureForm.submit()}
                onCancel={() => {
                    setFeatureCreateModalVisible(false);
                    featureForm.resetFields();
                }}
                confirmLoading={featureCreateLoading}
                width={600}
            >
                <Form
                    form={featureForm}
                    layout="vertical"
                    onFinish={handleCreateFeature}
                >
                    <Form.Item
                        name="name"
                        label="Feature Name"
                        rules={[
                            { required: true, message: 'Please enter feature name' },
                            { min: 2, message: 'Feature name must be at least 2 characters' }
                        ]}
                    >
                        <Input placeholder="Enter feature name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: 'Please enter feature description' },
                            { min: 10, message: 'Description must be at least 10 characters' }
                        ]}
                    >
                        <TextArea
                            placeholder="Enter feature description"
                            rows={4}
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="iconUrl"
                        label="Icon URL"
                        rules={[
                            { required: true, message: 'Please enter icon URL' },
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="Enter icon URL" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Feature Edit Modal */}
            <Modal
                title="Edit Feature"
                open={featureEditModalVisible}
                onOk={() => featureEditForm.submit()}
                onCancel={() => {
                    setFeatureEditModalVisible(false);
                    setSelectedFeature(null);
                    featureEditForm.resetFields();
                }}
                confirmLoading={featureEditLoading}
                width={600}
            >
                <Form
                    form={featureEditForm}
                    layout="vertical"
                    onFinish={handleEditFeature}
                >
                    <Form.Item
                        name="name"
                        label="Feature Name"
                        rules={[
                            { required: true, message: 'Please enter feature name' },
                            { min: 2, message: 'Feature name must be at least 2 characters' }
                        ]}
                    >
                        <Input placeholder="Enter feature name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: 'Please enter feature description' },
                            { min: 10, message: 'Description must be at least 10 characters' }
                        ]}
                    >
                        <TextArea
                            placeholder="Enter feature description"
                            rows={4}
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="iconUrl"
                        label="Icon URL"
                        rules={[
                            { required: true, message: 'Please enter icon URL' },
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="Enter icon URL" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

};

// Add a simple ImagePlaceholder component
const ImagePlaceholder = () => (
    <div style={{
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee',
        borderRadius: 8,
        color: '#bbb',
        fontSize: 24
    }}>
        <CarOutlined />
    </div>
);

export default Cars;