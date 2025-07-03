import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Tag,
    Row,
    Col,
    Modal,
    Image,
    Tooltip,
    Typography,
    Divider
} from 'antd';
import {
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    FileTextOutlined,
    UserOutlined,
    IdcardOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { documentService } from '../../services/documentService';
import dayjs from 'dayjs';
import Meta from '../../components/Meta';

const { Title, Text } = Typography;

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Modal states
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, [pagination.current, pagination.pageSize]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);

            const result = await documentService.getDocuments(
                pagination.current - 1,
                pagination.pageSize
            );

            if (result.status === 200 && result.data) {
                const mappedDocuments = result.data.content?.map(doc => ({
                    key: doc.id.toString(),
                    id: doc.id,
                    serialNumber: doc.serialNumber,
                    fullName: doc.name, // API returns 'name' instead of 'fullName'
                    documentType: doc.documentType,
                    status: doc.status,
                    createdAt: doc.createAt, // API returns 'createAt' instead of 'createdAt'
                    updatedAt: doc.updateAt, // API returns 'updateAt' instead of 'updatedAt'
                    userId: doc.userId || null, // Not present in API response
                    userName: doc.name, // Use document name as user name since user object is not present
                    userEmail: doc.userEmail || 'N/A', // Not present in API response
                    expiryDate: doc.expiryDate,
                    issueDate: doc.issueDate,
                    placeOfIssue: doc.placeOfIssue,
                    dateOfBirth: doc.dateOfBirth,
                    gender: doc.gender,
                    rankLicense: doc.rankLicense,
                    imageFront: doc.imageFrontUrl, // API returns 'imageFrontUrl' instead of 'imageFront'
                    imageBack: doc.imageBackUrl, // API returns 'imageBackUrl' instead of 'imageBack'
                    address: doc.address, // Additional field from API
                    active: doc.active, // Additional field from API
                    reason: doc.reason
                })) || [];

                setDocuments(mappedDocuments);
                setPagination(prev => ({
                    ...prev,
                    total: result.data.totalElements || 0,
                }));
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch documents';
                message.error(errorMessage);
                setDocuments([]);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch documents';
            message.error(errorMessage);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (paginationInfo) => {
        setPagination(prev => ({
            ...prev,
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize,
        }));
    };

    const handleViewDocument = (document) => {
        setSelectedDocument(document);
        setDetailModalVisible(true);
    };

    const handleApproveDocument = async (document) => {
        try {
            setActionLoading(true);
            const result = await documentService.updateDocumentStatus(document.id, 'APPROVED', '');

            if (result.status === 200) {
                message.success('Document approved successfully!');
                fetchDocuments();
            } else {
                const errorMessage = result.data?.message || 'Failed to approve document';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error approving document:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to approve document';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectDocument = async (document) => {
        try {
            setActionLoading(true);
            const result = await documentService.updateDocumentStatus(document.id, 'REJECTED', '');

            if (result.status === 200) {
                message.success('Document rejected successfully!');
                fetchDocuments();
            } else {
                const errorMessage = result.data?.message || 'Failed to reject document';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error rejecting document:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reject document';
            message.error(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            const result = await documentService.deleteDocument(documentId);
            if (result.status === 200) {
                message.success('Document deleted successfully!');
                fetchDocuments();
            } else {
                const errorMessage = result.data?.message || 'Failed to delete document';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete document';
            message.error(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'orange';
            case 'APPROVED':
                return 'green';
            case 'REJECTED':
                return 'red';
            default:
                return 'default';
        }
    };

    const getDocumentTypeIcon = (type) => {
        switch (type) {
            case 'CCCD':
                return <IdcardOutlined />;
            case 'LICENSE':
                return <FileTextOutlined />;
            default:
                return <FileTextOutlined />;
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Serial Number',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 140,
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 160,
        },
        {
            title: 'Type',
            dataIndex: 'documentType',
            key: 'documentType',
            width: 100,
            render: (type) => (
                <Tag icon={getDocumentTypeIcon(type)} color={type === 'CCCD' ? 'blue' : 'purple'}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'License Class',
            dataIndex: 'rankLicense',
            key: 'rankLicense',
            width: 100,
            render: (rank) => rank || '-',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            width: 120,
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
        },
        {
            title: 'Issue Date',
            dataIndex: 'issueDate',
            key: 'issueDate',
            width: 110,
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            width: 120,
            render: (date) => {
                if (!date) return '-';
                const expiryDate = dayjs(date);
                const isExpired = expiryDate.isBefore(dayjs());
                const isExpiringSoon = expiryDate.isBefore(dayjs().add(30, 'days'));

                return (
                    <Text type={isExpired ? 'danger' : isExpiringSoon ? 'warning' : undefined}>
                        {expiryDate.format('DD/MM/YYYY')}
                        {isExpired && ' (Expired)'}
                        {!isExpired && isExpiringSoon && ' (Soon)'}
                    </Text>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            ghost
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleViewDocument(record)}
                        />
                    </Tooltip>
                    {record.status === 'PENDING' && (
                        <>
                            <Tooltip title="Approve">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    loading={actionLoading}
                                    onClick={() => handleApproveDocument(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Reject">
                                <Button
                                    type="primary"
                                    danger
                                    icon={<CloseOutlined />}
                                    size="small"
                                    loading={actionLoading}
                                    onClick={() => handleRejectDocument(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                    <Popconfirm
                        title="Are you sure you want to delete this document?"
                        onConfirm={() => handleDeleteDocument(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Meta 
                title="Documents Management - Admin Dashboard" 
                description="Review and manage user submitted documents, verification, and approvals"
            />
            <div>
                <div>
                <Title level={2}>Document Management</Title>
                <Text type="secondary">Manage and review user submitted documents</Text>
            </div>

            {/* Documents Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={documents}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} documents`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Document Detail Modal */}
            <Modal
                title="Document Details"
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedDocument && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title="Document Information" size="small">
                                    <p><strong>Serial Number:</strong> {selectedDocument.serialNumber}</p>
                                    <p><strong>Full Name:</strong> {selectedDocument.fullName}</p>
                                    <p><strong>Type:</strong> {selectedDocument.documentType}</p>
                                    <p><strong>Status:</strong>
                                        <Tag color={getStatusColor(selectedDocument.status)}>
                                            {selectedDocument.status}
                                        </Tag>
                                    </p>
                                    <p><strong>Issue Date:</strong> {selectedDocument.issueDate ? dayjs(selectedDocument.issueDate).format('DD/MM/YYYY') : '-'}</p>
                                    <p><strong>Expiry Date:</strong> {selectedDocument.expiryDate ? dayjs(selectedDocument.expiryDate).format('DD/MM/YYYY') : '-'}</p>
                                    <p><strong>Place of Issue:</strong> {selectedDocument.placeOfIssue || '-'}</p>
                                    <p><strong>Address:</strong> {selectedDocument.address || '-'}</p>
                                    {selectedDocument.documentType === 'CCCD' && (
                                        <>
                                            <p><strong>Date of Birth:</strong> {selectedDocument.dateOfBirth ? dayjs(selectedDocument.dateOfBirth).format('DD/MM/YYYY') : '-'}</p>
                                            <p><strong>Gender:</strong> {selectedDocument.gender || '-'}</p>
                                        </>
                                    )}
                                    {selectedDocument.documentType === 'LICENSE' && (
                                        <p><strong>License Class:</strong> {selectedDocument.rankLicense || '-'}</p>
                                    )}
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="User Information" size="small">
                                    <p><strong>Name:</strong> {selectedDocument.userName}</p>
                                    <p><strong>Email:</strong> {selectedDocument.userEmail !== 'N/A' ? selectedDocument.userEmail : 'Email not available'}</p>
                                    <p><strong>User ID:</strong> {selectedDocument.userId || 'Not available'}</p>
                                    <p><strong>Address:</strong> {selectedDocument.address || 'Not available'}</p>
                                    <p><strong>Active:</strong> {selectedDocument.active ? 'Yes' : 'No'}</p>
                                </Card>
                                {selectedDocument.reason && (
                                    <>
                                        <Divider />
                                        <Card title="Reason" size="small">
                                            <p>{selectedDocument.reason}</p>
                                        </Card>
                                    </>
                                )}
                            </Col>
                        </Row>

                        <Divider>Document Images</Divider>
                        <Row gutter={16}>
                            {selectedDocument.imageFront && (
                                <Col span={12}>
                                    <Card title="Front Image" size="small">
                                        <Image
                                            width="100%"
                                            src={selectedDocument.imageFront}
                                            alt="Front"
                                        />
                                    </Card>
                                </Col>
                            )}
                            {selectedDocument.imageBack && (
                                <Col span={12}>
                                    <Card title="Back Image" size="small">
                                        <Image
                                            width="100%"
                                            src={selectedDocument.imageBack}
                                            alt="Back"
                                        />
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal>
            </div>
        </>
    );
};

export default Documents;
