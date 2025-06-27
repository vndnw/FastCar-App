import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Switch,
    Tag,
    Space,
    message,
    Popconfirm,
    Spin,
    Typography,
    Divider,
} from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PercentageOutlined,
    GiftOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { discountService } from "../../services/discountService";
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Discount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
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
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} discounts`,
    });

    useEffect(() => {
        fetchDiscounts();
    }, []); const fetchDiscounts = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            // API pagination starts from 0, but UI starts from 1
            const result = await discountService.getDiscounts(page - 1, pageSize);

            if (result.status === 0 && result.data && result.data.content) {
                // Map API data to display format - only use fields that exist in API
                const mappedDiscounts = result.data.content.map(discount => {
                    const now = new Date();
                    const startDate = new Date(discount.startDate);
                    const endDate = new Date(discount.endDate);

                    let status = 'expired';
                    if (now < startDate) {
                        status = 'upcoming';
                    } else if (now >= startDate && now <= endDate) {
                        status = 'valid';
                    }

                    return {
                        id: discount.id,
                        code: discount.code,
                        description: discount.description || 'No description',
                        percent: discount.percent,
                        quantity: discount.quantity,
                        startDate: discount.startDate,
                        endDate: discount.endDate,
                        status: status,
                        // Keep isActive for backward compatibility
                        isActive: status === 'valid',
                    };
                });
                setDiscounts(mappedDiscounts);

                // Update pagination info
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: result.data.totalElements || 0,
                }));
            } else {
                message.error('Failed to fetch discounts');
                setDiscounts([]);
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            message.error('Failed to fetch discounts');
            setDiscounts([]);
        } finally {
            setLoading(false);
        }
    };
    const handleCreateDiscount = async (values) => {
        try {
            setCreateLoading(true);            // Map form values to API format
            const discountData = {
                code: values.code,
                discription: values.description,
                percent: values.type === 'PERCENTAGE' ? values.value : 0, // API expects 'percent' field
                quantity: values.usageLimit,
                startDate: values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss'),
                endDate: values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss')
            };

            // Call actual API
            const result = await discountService.createDiscount(discountData);

            if (result.status === 0) {
                message.success('Discount created successfully!');
                setCreateModalVisible(false); form.resetFields();
                // Refresh discount list with current pagination
                await fetchDiscounts(pagination.current, pagination.pageSize);
            } else {
                message.error(result.message || 'Failed to create discount');
            }
        } catch (error) {
            console.error('Error creating discount:', error);
            message.error('Failed to create discount');
        } finally {
            setCreateLoading(false);
        }
    };
    const handleEditDiscount = async (values) => {
        try {
            setEditLoading(true);            // Map form values to API format
            const discountData = {
                code: values.code,
                discription: values.description,
                percent: values.type === 'PERCENTAGE' ? values.value : 0, // API expects 'percent' field
                quantity: values.usageLimit,
                startDate: values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss'),
                endDate: values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss')
            };

            // Call actual API
            const result = await discountService.updateDiscount(selectedDiscount.id, discountData);

            if (result.status === 0) {
                message.success('Discount updated successfully!');
                setEditModalVisible(false);
                setSelectedDiscount(null); editForm.resetFields();
                // Refresh discount list with current pagination
                await fetchDiscounts(pagination.current, pagination.pageSize);
            } else {
                message.error(result.message || 'Failed to update discount');
            }
        } catch (error) {
            console.error('Error updating discount:', error);
            message.error('Failed to update discount');
        } finally {
            setEditLoading(false);
        }
    };
    const handleDeleteDiscount = async (id) => {
        try {
            // Call actual API
            const result = await discountService.deleteDiscount(id);

            if (result.status === 0) {
                message.success('Discount deleted successfully!');
                // Refresh discount list with current pagination
                await fetchDiscounts(pagination.current, pagination.pageSize);
            } else {
                message.error(result.message || 'Failed to delete discount');
            }
        } catch (error) {
            console.error('Error deleting discount:', error);
            message.error('Failed to delete discount');
        }
    };

    // Handle pagination change
    const handleTableChange = (paginationInfo) => {
        const { current, pageSize } = paginationInfo;
        fetchDiscounts(current, pageSize);
    };

    const handleViewDiscount = (discount) => {
        setSelectedDiscount(discount);
        setViewModalVisible(true);
    }; const openEditModal = (discount) => {
        setSelectedDiscount(discount);
        editForm.setFieldsValue({
            code: discount.code,
            description: discount.description,
            value: discount.percent, // API uses 'percent' field
            usageLimit: discount.quantity, // API uses 'quantity' field
            dateRange: [dayjs(discount.startDate), dayjs(discount.endDate)]
        });
        setEditModalVisible(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: '15%',
            render: (code, record) => (
                <div>
                    <strong style={{ fontSize: '14px' }}>{code}</strong>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
                        ID: {record.id}
                    </div>
                </div>
            ),
        },
        {
            title: 'Description',
            key: 'description',
            width: '30%',
            render: (_, record) => (
                <div style={{ fontSize: '12px' }}>
                    {record.description}
                </div>
            ),
        },
        {
            title: 'Discount',
            key: 'discount',
            width: '15%',
            render: (_, record) => (
                <div>
                    <Tag color="blue">Percentage</Tag>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {record.percent}%
                    </div>
                </div>
            ),
        },
        {
            title: 'Quantity',
            key: 'quantity',
            width: '10%',
            render: (_, record) => (
                <div >
                    <div>{record.quantity}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>limit</div>
                </div>
            ),
        }, {
            title: 'Status',
            key: 'status',
            width: '15%',
            render: (_, record) => {
                let color = 'red';
                let text = 'Expired';

                if (record.status === 'valid') {
                    color = 'green';
                    text = 'Valid';
                } else if (record.status === 'upcoming') {
                    color = 'blue';
                    text = 'Upcoming';
                }

                return (
                    <div>
                        <Tag color={color}>
                            {text}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Valid Period',
            key: 'period',
            width: '15%',
            render: (_, record) => (
                <div style={{ fontSize: '12px' }}>
                    <div>From: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
                    <div>To: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
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
                        onClick={() => handleViewDiscount(record)}
                        title="View Details"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        title="Edit"
                    />
                    <Popconfirm
                        title="Delete Discount"
                        description="Are you sure you want to delete this discount?"
                        onConfirm={() => handleDeleteDiscount(record.id)}
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
                                    <GiftOutlined style={{ marginRight: 8, fontSize: 20 }} />
                                    Discount Management
                                </div>
                            }
                            extra={
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setCreateModalVisible(true)}
                                >
                                    Create Discount
                                </Button>
                            }
                        >                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={discounts}
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

            {/* Create Discount Modal */}
            <Modal
                title="Create New Discount"
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateDiscount}
                >          <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Discount Code"
                                name="code"
                                rules={[
                                    { required: true, message: 'Please input discount code!' },
                                    { min: 3, message: 'Code must be at least 3 characters!' }
                                ]}
                            >
                                <Input placeholder="Enter discount code" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Discount Percentage"
                                name="value"
                                rules={[
                                    { required: true, message: 'Please input discount percentage!' },
                                    { type: 'number', min: 1, max: 100, message: 'Percentage must be between 1-100!' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Enter percentage (1-100)"
                                    min={1}
                                    max={100}
                                    addonAfter="%"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Enter discount description" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Usage Limit"
                                name="usageLimit"
                                rules={[{ required: true, message: 'Please input usage limit!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Enter usage limit"
                                    min={1}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Valid Period"
                                name="dateRange"
                                rules={[{ required: true, message: 'Please select valid period!' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    placeholder={['Start Date', 'End Date']}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Hidden field to set type as PERCENTAGE since API only supports this */}
                    <Form.Item name="type" initialValue="PERCENTAGE" hidden>
                        <Input />
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
                            Create Discount
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Discount Modal */}
            <Modal
                title="Edit Discount"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedDiscount(null);
                    editForm.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditDiscount}
                >          <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Discount Code"
                                name="code"
                                rules={[
                                    { required: true, message: 'Please input discount code!' },
                                    { min: 3, message: 'Code must be at least 3 characters!' }
                                ]}
                            >
                                <Input placeholder="Enter discount code" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Discount Percentage"
                                name="value"
                                rules={[
                                    { required: true, message: 'Please input discount percentage!' },
                                    { type: 'number', min: 1, max: 100, message: 'Percentage must be between 1-100!' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Enter percentage (1-100)"
                                    min={1}
                                    max={100}
                                    addonAfter="%"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Enter discount description" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Usage Limit"
                                name="usageLimit"
                                rules={[{ required: true, message: 'Please input usage limit!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Enter usage limit"
                                    min={1}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Valid Period"
                                name="dateRange"
                                rules={[{ required: true, message: 'Please select valid period!' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    placeholder={['Start Date', 'End Date']}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Hidden field to set type as PERCENTAGE since API only supports this */}
                    <Form.Item name="type" initialValue="PERCENTAGE" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24, marginLeft: 0, textAlign: 'right' }}>
                        <Button
                            onClick={() => {
                                setEditModalVisible(false);
                                setSelectedDiscount(null);
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
                            Update Discount
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Discount Modal */}
            <Modal
                title="Discount Details"
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedDiscount(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setViewModalVisible(false);
                        setSelectedDiscount(null);
                    }}>
                        Close
                    </Button>
                ]}
                width={600}
            >        {selectedDiscount && (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <PercentageOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        <Title level={3} style={{ marginTop: 16 }}>
                            {selectedDiscount.code}
                        </Title>                        <Tag color={
                            selectedDiscount.status === 'valid' ? 'green' :
                                selectedDiscount.status === 'upcoming' ? 'blue' : 'red'
                        } style={{ fontSize: 14, padding: '4px 12px' }}>
                            {selectedDiscount.status === 'valid' ? 'Valid' :
                                selectedDiscount.status === 'upcoming' ? 'Upcoming' : 'Expired'}
                        </Tag>
                    </div>

                    <Divider />

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <strong>Discount Code:</strong>
                            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                                {selectedDiscount.code}
                            </div>
                        </Col>
                        <Col span={12}>
                            <strong>Discount ID:</strong>
                            <div>#{selectedDiscount.id}</div>
                        </Col>
                        <Col span={24}>
                            <strong>Description:</strong>
                            <div>{selectedDiscount.description}</div>
                        </Col>
                        <Col span={12}>
                            <strong>Discount Percentage:</strong>
                            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                                {selectedDiscount.percent}%
                            </div>
                        </Col>
                        <Col span={12}>
                            <strong>Quantity Limit:</strong>
                            <div>{selectedDiscount.quantity} uses</div>
                        </Col>
                        <Col span={12}>
                            <strong>Valid From:</strong>
                            <div>{dayjs(selectedDiscount.startDate).format('DD/MM/YYYY HH:mm')}</div>
                        </Col>
                        <Col span={12}>
                            <strong>Valid Until:</strong>
                            <div>{dayjs(selectedDiscount.endDate).format('DD/MM/YYYY HH:mm')}</div>
                        </Col>                        <Col span={24}>
                            <strong>Current Status:</strong>
                            <div>
                                <Tag color={
                                    selectedDiscount.status === 'valid' ? 'green' :
                                        selectedDiscount.status === 'upcoming' ? 'blue' : 'red'
                                }>
                                    {selectedDiscount.status === 'valid' ? 'Valid' :
                                        selectedDiscount.status === 'upcoming' ? 'Upcoming' : 'Expired'}
                                </Tag>
                                <span style={{ marginLeft: 8, color: '#666' }}>
                                    {selectedDiscount.status === 'valid' ? '(Currently Active)' :
                                        selectedDiscount.status === 'upcoming' ? '(Not Started Yet)' : '(Expired)'}
                                </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
            </Modal>
        </>
    );
};

export default Discount;
