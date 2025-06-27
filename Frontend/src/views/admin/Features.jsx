import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Space,
    Popconfirm,
    Card,
    Tag,
    Image,
    Upload,
    Row,
    Col,
    Tooltip,
    Typography
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { featureService } from '../../services';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Features = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
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
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} features`,
    });

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const result = await featureService.getFeatures(page - 1, pageSize);

            if (result.status === 200 && result.data && result.data.content) {
                setFeatures(result.data.content);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: result.data.totalElements || 0,
                }));
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch features';
                message.error(errorMessage);
                setFeatures([]);
            }
        } catch (error) {
            console.error('Error fetching features:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch features';
            message.error(errorMessage);
            setFeatures([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFeature = async (values) => {
        try {
            setCreateLoading(true);
            const featureData = {
                name: values.name,
                description: values.description,
                iconUrl: values.iconUrl || `https://placehold.co/100x100/CCCCCC/FFFFFF?text=${encodeURIComponent(values.name.charAt(0))}`
            };

            const result = await featureService.createFeature(featureData);

            if (result.status === 201 || result.status === 200) {
                message.success('Feature created successfully');
                setCreateModalVisible(false);
                form.resetFields();
                fetchFeatures(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to create feature';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error creating feature:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create feature';
            message.error(errorMessage);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleEditFeature = async (values) => {
        try {
            setEditLoading(true);
            const featureData = {
                name: values.name,
                description: values.description,
                iconUrl: values.iconUrl
            };

            const result = await featureService.updateFeature(selectedFeature.id, featureData);

            if (result.status === 200) {
                message.success('Feature updated successfully');
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedFeature(null);
                fetchFeatures(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to update feature';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error updating feature:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update feature';
            message.error(errorMessage);
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteFeature = async (id) => {
        try {
            const result = await featureService.deleteFeature(id);

            if (result.status === 200) {
                message.success('Feature deleted successfully');
                fetchFeatures(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to delete feature';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error deleting feature:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete feature';
            message.error(errorMessage);
        }
    };

    const openEditModal = (feature) => {
        setSelectedFeature(feature);
        editForm.setFieldsValue({
            name: feature.name,
            description: feature.description,
            iconUrl: feature.iconUrl
        });
        setEditModalVisible(true);
    };

    const handleTableChange = (paginationInfo) => {
        const { current, pageSize } = paginationInfo;
        fetchFeatures(current, pageSize);
    };

    const columns = [
        {
            title: 'Icon',
            dataIndex: 'iconUrl',
            key: 'iconUrl',
            width: '80px',
            render: (iconUrl, record) => (
                <div style={{ textAlign: 'center' }}>
                    <Image
                        width={50}
                        height={50}
                        src={iconUrl}
                        style={{ borderRadius: 8 }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxY4Q9//8/BbaAGOLiLKvWBvs5eaKp6hSu9Aw4AAAAAAAAz8mU3dUaAAAAAElFTkSuQmCC"
                    />
                </div>
            ),
        },
        {
            title: 'Feature Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            render: (text, record) => (
                <div>
                    <Text strong style={{ fontSize: 14 }}>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        ID: {record.id}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (text) => (
                <Tooltip title={text}>
                    <Text style={{ fontSize: 13 }}>
                        {text && text.length > 100 ? `${text.substring(0, 100)}...` : text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (date) => (
                <Text style={{ fontSize: 12 }}>
                    {new Date(date).toLocaleDateString('vi-VN')}
                </Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this feature?"
                        onConfirm={() => handleDeleteFeature(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                        <SettingOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                        Car Features Management
                    </Title>
                    <Text type="secondary">Manage car features and specifications</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateModalVisible(true)}
                    size="large"
                >
                    Add New Feature
                </Button>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                {pagination.total}
                            </Title>
                            <Text type="secondary">Total Features</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                                {features.length}
                            </Title>
                            <Text type="secondary">Current Page</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ margin: 0, color: '#faad14' }}>
                                {Math.ceil(pagination.total / pagination.pageSize)}
                            </Title>
                            <Text type="secondary">Total Pages</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Features Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={features}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="id"
                    size="middle"
                />
            </Card>

            {/* Create Feature Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <PlusOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        Create New Feature
                    </div>
                }
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateFeature}
                >
                    <Form.Item
                        name="name"
                        label="Feature Name"
                        rules={[
                            { required: true, message: 'Please enter feature name' },
                            { max: 100, message: 'Feature name must be less than 100 characters' }
                        ]}
                    >
                        <Input placeholder="Enter feature name (e.g., Camera hành trình)" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: 'Please enter feature description' },
                            { max: 500, message: 'Description must be less than 500 characters' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter detailed description of the feature"
                        />
                    </Form.Item>

                    <Form.Item
                        name="iconUrl"
                        label="Icon URL"
                        rules={[
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="https://example.com/icon.png (optional)" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
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
                                Create Feature
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Feature Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <EditOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        Edit Feature
                    </div>
                }
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    editForm.resetFields();
                    setSelectedFeature(null);
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditFeature}
                >
                    <Form.Item
                        name="name"
                        label="Feature Name"
                        rules={[
                            { required: true, message: 'Please enter feature name' },
                            { max: 100, message: 'Feature name must be less than 100 characters' }
                        ]}
                    >
                        <Input placeholder="Enter feature name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: 'Please enter feature description' },
                            { max: 500, message: 'Description must be less than 500 characters' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter detailed description of the feature"
                        />
                    </Form.Item>

                    <Form.Item
                        name="iconUrl"
                        label="Icon URL"
                        rules={[
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="https://example.com/icon.png" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button
                                onClick={() => {
                                    setEditModalVisible(false);
                                    editForm.resetFields();
                                    setSelectedFeature(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={editLoading}
                            >
                                Update Feature
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Features;
