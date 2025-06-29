import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Modal, Descriptions, 
    Spin, Empty, message, Space, Typography
} from 'antd';
import { 
    EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, 
    CloseCircleOutlined, CarOutlined, CalendarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { bookingService } from '../../services';

const { Title, Text } = Typography;

const BookingHistory = ({ userId, visible, onClose, embedded = false }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    useEffect(() => {
        if ((visible || embedded) && userId) {
            fetchBookingHistory();
        }
    }, [visible, embedded, userId]);

    const fetchBookingHistory = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getUserBookingHistory(userId);
            if (response.data) {
                setBookings(response.data.content);
            }
        } catch (error) {
            console.error('Error fetching booking history:', error);
            message.error('Không thể tải lịch sử đặt xe');
        } finally {
            setLoading(false);
        }
    };

    console.log(bookings);

    const showBookingDetail = (booking) => {
        setSelectedBooking(booking);
        setDetailModalVisible(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'orange';
            case 'CONFIRMED':
                return 'blue';
            case 'COMPLETED':
                return 'green';
            case 'CANCELLED':
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <ClockCircleOutlined />;
            case 'CONFIRMED':
                return <CheckCircleOutlined />;
            case 'COMPLETED':
                return <CheckCircleOutlined />;
            case 'CANCELLED':
                return <CloseCircleOutlined />;
            default:
                return null;
        }
    };

    const columns = [
        {
            title: 'Mã đặt xe',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Xe',
            dataIndex: 'car',
            key: 'car',
            render: (car) => (
                <div>
                    <div><CarOutlined /> {car?.name || 'N/A'}</div>
                    <Text type="secondary">{car?.carBrand?.name || 'N/A'}</Text>
                </div>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (startDate) => (
                <div>
                    <CalendarOutlined /> {dayjs(startDate).format('DD/MM/YYYY')}
                </div>
            ),
        },
        {
            title: 'Ngày trả',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (endDate) => (
                <div>
                    <CalendarOutlined /> {dayjs(endDate).format('DD/MM/YYYY')}
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'rentalPrice',
            key: 'rentalPrice',
            render: (price) => (
                <Text strong>{price?.toLocaleString('vi-VN')} VNĐ</Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={() => showBookingDetail(record)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const renderBookingDetail = () => {
        if (!selectedBooking) return null;

        return (
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã đặt xe">{selectedBooking.id}</Descriptions.Item>
                <Descriptions.Item label="Tên xe">{selectedBooking.car?.name}</Descriptions.Item>
                <Descriptions.Item label="Hãng xe">{selectedBooking.car?.carBrand?.name}</Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">{dayjs(selectedBooking.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">{dayjs(selectedBooking.endDate).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Số ngày thuê">{dayjs(selectedBooking.endDate).diff(dayjs(selectedBooking.startDate), 'day')} ngày</Descriptions.Item>
                <Descriptions.Item label="Giá thuê/ngày">{selectedBooking.car?.pricePerHour?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{selectedBooking.rentalPrice?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(selectedBooking.status)} icon={getStatusIcon(selectedBooking.status)}>
                        {getStatusText(selectedBooking.status)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">{selectedBooking.note || 'Không có'}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
            </Descriptions>
        );
    };

    // Calculate summary statistics
    const getBookingStats = () => {
        const total = bookings.length;
        const completed = bookings.filter(b => b.status === 'COMPLETED').length;
        const pending = bookings.filter(b => b.status === 'PENDING').length;
        const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
        const totalSpent = bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        return { total, completed, pending, cancelled, totalSpent };
    };

    return (
        <>
            {embedded ? (
                // Embedded mode - render directly without modal
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 16 }}>Đang tải lịch sử đặt xe...</div>
                        </div>
                    ) : bookings.length > 0 ? (
                        <>
                            {/* Summary Statistics */}
                            <div className="booking-summary">
                                {(() => {
                                    const stats = getBookingStats();
                                    return (
                                        <>
                                            <div className="booking-summary-item">
                                                <div className="booking-summary-label">Tổng đặt xe</div>
                                                <div className="booking-summary-value">{stats.total}</div>
                                            </div>
                                            <div className="booking-summary-item">
                                                <div className="booking-summary-label">Đã hoàn thành</div>
                                                <div className="booking-summary-value">{stats.completed}</div>
                                            </div>
                                            <div className="booking-summary-item">
                                                <div className="booking-summary-label">Đang chờ</div>
                                                <div className="booking-summary-value">{stats.pending}</div>
                                            </div>
                                            <div className="booking-summary-item">
                                                <div className="booking-summary-label">Đã hủy</div>
                                                <div className="booking-summary-value">{stats.cancelled}</div>
                                            </div>
                                            <div className="booking-summary-item">
                                                <div className="booking-summary-label">Tổng chi tiêu</div>
                                                <div className="booking-summary-value">{stats.totalSpent.toLocaleString('vi-VN')} VNĐ</div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <Table
                                columns={columns}
                                dataSource={bookings}
                                rowKey="id"
                                pagination={{
                                    pageSize: 5,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đặt xe`,
                                }}
                                scroll={{ x: 800 }}
                                className="booking-history-table"
                                size="small"
                            />
                        </>
                    ) : (
                        <Empty
                            description="Chưa có lịch sử đặt xe nào"
                            style={{ padding: '50px 0' }}
                        />
                    )}
                </div>
            ) : (
                // Modal mode - original implementation
                <Modal
                    title="Lịch sử đặt xe"
                    open={visible}
                    onCancel={onClose}
                    footer={null}
                    width={1200}
                    destroyOnClose
                    className="booking-history-modal"
                >
                    <Card>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <Spin size="large" />
                                <div style={{ marginTop: 16 }}>Đang tải lịch sử đặt xe...</div>
                            </div>
                        ) : bookings.length > 0 ? (
                            <>
                                {/* Summary Statistics */}
                                <div className="booking-summary">
                                    {(() => {
                                        const stats = getBookingStats();
                                        return (
                                            <>
                                                <div className="booking-summary-item">
                                                    <div className="booking-summary-label">Tổng đặt xe</div>
                                                    <div className="booking-summary-value">{stats.total}</div>
                                                </div>
                                                <div className="booking-summary-item">
                                                    <div className="booking-summary-label">Đã hoàn thành</div>
                                                    <div className="booking-summary-value">{stats.completed}</div>
                                                </div>
                                                <div className="booking-summary-item">
                                                    <div className="booking-summary-label">Đang chờ</div>
                                                    <div className="booking-summary-value">{stats.pending}</div>
                                                </div>
                                                <div className="booking-summary-item">
                                                    <div className="booking-summary-label">Đã hủy</div>
                                                    <div className="booking-summary-value">{stats.cancelled}</div>
                                                </div>
                                                <div className="booking-summary-item">
                                                    <div className="booking-summary-label">Tổng chi tiêu</div>
                                                    <div className="booking-summary-value">{stats.totalSpent.toLocaleString('vi-VN')} VNĐ</div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <Table
                                    columns={columns}
                                    dataSource={bookings}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đặt xe`,
                                    }}
                                    scroll={{ x: 800 }}
                                    className="booking-history-table"
                                />
                            </>
                        ) : (
                            <Empty
                                description="Chưa có lịch sử đặt xe nào"
                                style={{ padding: '50px 0' }}
                            />
                        )}
                    </Card>
                </Modal>
            )}

            <Modal
                title="Chi tiết đặt xe"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
                className="booking-detail-modal"
            >
                {renderBookingDetail()}
            </Modal>
        </>
    );
};

export default BookingHistory; 