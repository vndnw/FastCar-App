/*!
=========================================================
* Car Brand Management - Admin Dashboard
* Copyright 2025 BookingACar
=========================================================
*/
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
} from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CarOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { carBrandService } from "../../services/carBrandService";
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

const CarBrand = () => {
    const [carBrands, setCarBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedCarBrand, setSelectedCarBrand] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} car brands`,
    });

    useEffect(() => {
        fetchCarBrands();
    }, []);

    const fetchCarBrands = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            // API pagination starts from 0, but UI starts from 1
            const result = await carBrandService.getCarBrands(page - 1, pageSize); if (result.status === 0 && result.data && result.data.content) {
                // Map API data to display format - match actual API response structure
                const mappedCarBrands = result.data.content.map(brand => ({
                    id: brand.id, name: brand.name || 'Unknown Brand',
                    description: brand.description || 'No description',
                    logo: brand.logo || "https://placehold.co/200x200/DFB13F/000000?text=VN", // API uses 'logo' field, default placeholder
                    isActive: true, // Set default to true since API doesn't return this field
                    createAt: brand.createAt || new Date().toISOString(), // API uses 'createAt'
                    updateAt: brand.updateAt || new Date().toISOString(), // API uses 'updateAt'
                }));
                setCarBrands(mappedCarBrands);

                // Update pagination info
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: result.data.totalElements || 0,
                }));
            } else {
                message.error('Failed to fetch car brands');
                setCarBrands([]);
            }
        } catch (error) {
            console.error('Error fetching car brands:', error);
            message.error('Failed to fetch car brands');
            setCarBrands([]);
        } finally {
            setLoading(false);
        }
    }; const handleCreateCarBrand = async (values) => {
        try {
            setCreateLoading(true);
            // Map form values to API format
            const carBrandData = {
                name: values.name,
                logo: values.logo || "https://placehold.co/200x200/DFB13F/000000?text=VN", // API expects 'logo' field
                description: values.description,
            };

            // Call actual API
            const result = await carBrandService.createCarBrand(carBrandData);

            if (result.status === 0) {
                message.success('Car brand created successfully!');
                setCreateModalVisible(false);
                form.resetFields();
                // Refresh car brand list with current pagination
                await fetchCarBrands(pagination.current, pagination.pageSize);
            } else {
                message.error(result.message || 'Failed to create car brand');
            }
        } catch (error) {
            console.error('Error creating car brand:', error);
            message.error('Failed to create car brand');
        } finally {
            setCreateLoading(false);
        }
    }; const handleEditCarBrand = async (values) => {
        try {
            setEditLoading(true);
            // Map form values to API format
            const carBrandData = {
                name: values.name,
                logo: values.logo || "https://placehold.co/200x200/DFB13F/000000?text=VN", // API expects 'logo' field
                description: values.description,
            };

            // Call actual API
            const result = await carBrandService.updateCarBrand(selectedCarBrand.id, carBrandData);

            if (result.status === 0) {
                message.success('Car brand updated successfully!');
                setEditModalVisible(false);
                setSelectedCarBrand(null);
                editForm.resetFields();
                // Refresh car brand list with current pagination
                await fetchCarBrands(pagination.current, pagination.pageSize);
            } else {
                message.error(result.message || 'Failed to update car brand');
            }
        } catch (error) {
            console.error('Error updating car brand:', error);
            message.error('Failed to update car brand');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteCarBrand = async (id) => {
        try {
            // Call actual API
            const result = await carBrandService.deleteCarBrand(id);


            message.success('Car brand deleted successfully!');
            // Refresh car brand list with current pagination
            await fetchCarBrands(pagination.current, pagination.pageSize);

        } catch (error) {
            console.error('Error deleting car brand:', error);
            message.error('Failed to delete car brand');
        }
    };

    // Handle pagination change
    const handleTableChange = (paginationInfo) => {
        const { current, pageSize } = paginationInfo;
        fetchCarBrands(current, pageSize);
    };

    const handleViewCarBrand = (carBrand) => {
        setSelectedCarBrand(carBrand);
        setViewModalVisible(true);
    }; const openEditModal = (carBrand) => {
        setSelectedCarBrand(carBrand);
        editForm.setFieldsValue({
            name: carBrand.name,
            description: carBrand.description,
            logo: carBrand.logo || "https://placehold.co/200x200/DFB13F/000000?text=VN", // API uses 'logo' field
        });
        setEditModalVisible(true);
    };

    const columns = [
        {
            title: 'Brand Info',
            dataIndex: 'name',
            key: 'name',
            width: '25%', render: (name, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.logo ? (
                        <Image
                            src={record.logo}
                            alt={name}
                            width={40}
                            height={40}
                            style={{ borderRadius: 4, marginRight: 12 }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xnG4W+FgYxYFMbEQjGRFVuBtYMVOBChkw2cHeikg40wdBBWwMq1Ag=="
                        />
                    ) : (
                        <div style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12
                        }}>
                            <CarOutlined style={{ color: '#999' }} />
                        </div>
                    )}
                    <div style={{ marginLeft: 4 }}>
                        <strong style={{ fontSize: '14px' }}>{name}</strong>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
                            ID: {record.id}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Description',
            key: 'description',
            width: '35%',
            render: (_, record) => (
                <div style={{ fontSize: '12px' }}>
                    {record.description}
                </div>
            ),
        },
        {
            title: 'Created Date',
            key: 'createdAt',
            width: '20%',
            render: (_, record) => (
                <div style={{ fontSize: '12px' }}>
                    {dayjs(record.createAt).format('DD/MM/YYYY')}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewCarBrand(record)}
                        title="View Details"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        title="Edit"
                    />
                    <Popconfirm
                        title="Delete Car Brand"
                        description="Are you sure you want to delete this car brand?"
                        onConfirm={() => handleDeleteCarBrand(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            title="Delete"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            variant={false}
                            className="criclebox tablespace mb-24"
                            title={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CarOutlined style={{ marginRight: 8, fontSize: 20 }} />
                                    Car Brand Management
                                </div>
                            }
                            extra={
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setCreateModalVisible(true)}
                                >
                                    Create Car Brand
                                </Button>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={carBrands}
                                    pagination={pagination}
                                    loading={loading}
                                    rowKey="id"
                                    className="ant-border-space"
                                    onChange={handleTableChange}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Create Car Brand Modal */}
            <Modal
                title="Create New Car Brand"
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >                <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateCarBrand}
                initialValues={{
                    isActive: true,
                    logo: "https://placehold.co/200x200/DFB13F/000000?text=VN"
                }}
            >
                    <Form.Item
                        label="Brand Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input brand name!' },
                            { min: 2, message: 'Brand name must be at least 2 characters!' }
                        ]}
                    >
                        <Input placeholder="Enter brand name" />
                    </Form.Item>                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <TextArea rows={3} placeholder="Enter brand description" />
                    </Form.Item>                    <Form.Item
                        label="Logo URL"
                        name="logo"
                        initialValue="https://placehold.co/200x200/DFB13F/000000?text=VN"
                    >
                        <Input placeholder="Enter logo URL (optional)" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
                        <Button
                            onClick={() => {
                                setCreateModalVisible(false);
                                form.resetFields();
                            }}
                            style={{ marginRight: 8 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createLoading}
                        >
                            Create Car Brand
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Car Brand Modal */}
            <Modal
                title="Edit Car Brand"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedCarBrand(null);
                    editForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditCarBrand}
                >
                    <Form.Item
                        label="Brand Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input brand name!' },
                            { min: 2, message: 'Brand name must be at least 2 characters!' }
                        ]}
                    >
                        <Input placeholder="Enter brand name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <TextArea rows={3} placeholder="Enter brand description" />
                    </Form.Item>                    <Form.Item
                        label="Logo URL"
                        name="logo"
                    >
                        <Input placeholder="Enter logo URL (optional)" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
                        <Button
                            onClick={() => {
                                setEditModalVisible(false);
                                setSelectedCarBrand(null);
                                editForm.resetFields();
                            }}
                            style={{ marginRight: 8 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={editLoading}
                        >
                            Update Car Brand
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Car Brand Modal */}
            <Modal
                title="Car Brand Details"
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedCarBrand(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setViewModalVisible(false);
                        setSelectedCarBrand(null);
                    }}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                {selectedCarBrand && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>                            {selectedCarBrand.logo ? (
                            <Image
                                src={selectedCarBrand.logo}
                                alt={selectedCarBrand.name}
                                width={80}
                                height={80}
                                style={{ borderRadius: 8 }}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1xnG4W+FgYxYFMbEQtGRFVuBtYMVOBChkw2cHeikg40wdBBWwMq1Ag=="
                            />
                        ) : (
                            <CarOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        )}                            <Title level={3} style={{ marginTop: 16 }}>
                                {selectedCarBrand.name}
                            </Title>
                        </div>

                        <Divider />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <strong>Brand Name:</strong>
                                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                                    {selectedCarBrand.name}
                                </div>
                            </Col>
                            <Col span={12}>
                                <strong>Brand ID:</strong>
                                <div>#{selectedCarBrand.id}</div>
                            </Col>
                            <Col span={24}>
                                <strong>Description:</strong>
                                <div>{selectedCarBrand.description}</div>
                            </Col>                            <Col span={12}>
                                <strong>Logo URL:</strong>
                                <div style={{ wordBreak: 'break-all' }}>
                                    {selectedCarBrand.logo || 'No logo'}
                                </div>                            </Col>
                            <Col span={12}>
                                <strong>Created:</strong>
                                <div>{dayjs(selectedCarBrand.createAt).format('DD/MM/YYYY HH:mm')}</div>
                            </Col>
                            <Col span={12}>
                                <strong>Last Updated:</strong>
                                <div>{dayjs(selectedCarBrand.updateAt).format('DD/MM/YYYY HH:mm')}</div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default CarBrand;
