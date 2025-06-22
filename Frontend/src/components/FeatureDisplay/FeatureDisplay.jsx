import React from 'react';
import { Card, Row, Col, Typography, Image, Tag, Spin, Empty, Button, Space, Popconfirm } from 'antd';
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const FeatureDisplay = ({
    features = [],
    title = "Car Features",
    showHeader = true,
    loading = false,
    emptyText = "No features available",
    onEdit = null,
    onDelete = null,
    showActions = false
}) => {
    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">Loading features...</Text>
                    </div>
                </div>
            </Card>
        );
    }

    if (!features || features.length === 0) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Empty
                        image={<SettingOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                        description={
                            <Text type="secondary">{emptyText}</Text>
                        }
                    />
                </div>
            </Card>
        );
    }

    return (
        <Card>
            {showHeader && (
                <div style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                        <SettingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        {title}
                    </Title>
                    <Text type="secondary">Available car features and specifications</Text>
                </div>
            )}

            <Row gutter={[16, 16]}>
                {features.map((feature) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={feature.id}>
                        <Card
                            size="small"
                            hoverable
                            style={{
                                height: '100%',
                                borderRadius: 8,
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{
                                padding: 16,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '100%'
                            }}
                        >
                            <div style={{ marginBottom: 12 }}>
                                <Image
                                    width={60}
                                    height={60}
                                    src={feature.iconUrl}
                                    style={{ borderRadius: 8 }}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxY4Q9//8/BbaAGOLiLKvWBvs5eaKp6hSu9Aw4AAAAAAAAz8mU3dUaAAAAAElFTkSuQmCC"
                                    preview={false}
                                />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <Title level={5} style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600 }}>
                                        {feature.name}
                                    </Title>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 12,
                                            lineHeight: '16px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {feature.description}
                                    </Text>
                                </div>                                <div style={{ marginTop: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                        <Tag color="blue" size="small" style={{ fontSize: 10 }}>
                                            ID: {feature.id}
                                        </Tag>

                                        {showActions && (onEdit || onDelete) && (
                                            <Space size="small">
                                                {onEdit && (
                                                    <Button
                                                        type="primary"
                                                        size="middle"
                                                        icon={<EditOutlined />}
                                                        onClick={() => onEdit(feature)}
                                                        style={{
                                                            minWidth: 36,
                                                            height: 36,
                                                            borderRadius: 6,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 14
                                                        }}
                                                        title="Edit Feature"
                                                    />
                                                )}
                                                {onDelete && (
                                                    <Popconfirm
                                                        title="Delete Feature"
                                                        description="Are you sure you want to delete this feature?"
                                                        onConfirm={() => onDelete(feature.id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        okType="danger"
                                                    >
                                                        <Button
                                                            type="primary"
                                                            danger
                                                            size="middle"
                                                            icon={<DeleteOutlined />}
                                                            style={{
                                                                minWidth: 36,
                                                                height: 36,
                                                                borderRadius: 6,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: 14
                                                            }}
                                                            title="Delete Feature"
                                                        />
                                                    </Popconfirm>
                                                )}
                                            </Space>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default FeatureDisplay;
