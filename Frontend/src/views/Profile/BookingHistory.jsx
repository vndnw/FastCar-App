import React, { useState, useEffect } from 'react';
import {
    Table, Card, Tag, Button, Modal, Descriptions,
    Spin, Empty, message, Space, Typography, Popconfirm,
    Divider, Alert
} from 'antd';
import {
    EyeOutlined, ClockCircleOutlined, CheckCircleOutlined,
    CloseCircleOutlined, CarOutlined, CalendarOutlined, LoginOutlined,
    CreditCardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { bookingService } from '../../services';

const { Title, Text } = Typography;

const BookingHistory = ({ userId, visible, onClose, embedded = false }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // Add CSS animation for countdown pulse effect
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                from { transform: scale(1); opacity: 1; }
                to { transform: scale(1.1); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

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

    const handleCheckIn = async (bookingId) => {
        try {
            const response = await bookingService.simpleCheckIn(bookingId);

            // Check if response contains payment URL
            if (response.data && response.data.paymentUrl) {
                const { rentalFee, depositFee, totalFee, paymentUrl } = response.data;

                let countdown = 5;
                let countdownInterval;

                // Show payment information modal (mandatory payment with auto redirect)
                const modal = Modal.info({
                    title: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CreditCardOutlined style={{ color: '#52c41a' }} />
                            Check-in thành công! Chuyển đến thanh toán
                        </div>
                    ),
                    width: 500,
                    icon: null,
                    content: (
                        <div style={{ marginTop: 16 }}>
                            <Alert
                                message="Check-in thành công!"
                                description="Hệ thống sẽ tự động chuyển bạn đến trang thanh toán để hoàn tất quy trình."
                                type="success"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />

                            <Alert
                                message={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span>Tự động chuyển hướng sau</span>
                                        <span id="countdown" style={{
                                            color: '#ff4d4f',
                                            fontWeight: 'bold',
                                            fontSize: '18px',
                                            minWidth: '20px',
                                            textAlign: 'center'
                                        }}>
                                            {countdown}
                                        </span>
                                        <span>giây</span>
                                    </div>
                                }
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />

                            <Divider />
                            <div style={{ marginBottom: 8 }}>
                                <strong>Chi tiết thanh toán:</strong>
                            </div>
                            <div style={{ paddingLeft: 16, marginBottom: 8 }}>
                                <div>• Phí thuê xe: <span style={{ fontWeight: 600 }}>{rentalFee?.toLocaleString('vi-VN')} VNĐ</span></div>
                                <div>• Tiền cọc: <span style={{ fontWeight: 600 }}>{depositFee?.toLocaleString('vi-VN')} VNĐ</span></div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>• <strong>Tổng cộng: <span style={{ color: '#ff4d4f', fontWeight: 700 }}>{totalFee?.toLocaleString('vi-VN')} VNĐ</span></strong></div>
                            </div>
                            <Alert
                                message="Lưu ý"
                                description="Bạn bắt buộc phải hoàn tất thanh toán để xác nhận việc check-in."
                                type="warning"
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                        </div>
                    ),
                    okText: 'Thanh toán ngay',
                    onOk: () => {
                        // Clear countdown when user clicks button
                        if (countdownInterval) {
                            clearInterval(countdownInterval);
                        }
                        // Mandatory redirect to payment URL
                        window.location.href = paymentUrl;
                    },
                    // Remove cancel option to make payment mandatory
                    closable: false,
                    maskClosable: false
                });

                // Start countdown timer
                countdownInterval = setInterval(() => {
                    countdown--;
                    const countdownElement = document.getElementById('countdown');
                    if (countdownElement) {
                        countdownElement.textContent = countdown;
                        // Add pulsing effect when countdown is low
                        if (countdown <= 3) {
                            countdownElement.style.animation = 'pulse 0.5s ease-in-out infinite alternate';
                        }
                    }

                    // Auto redirect when countdown reaches 0
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        modal.destroy();
                        window.location.href = paymentUrl;
                    }
                }, 1000);

                fetchBookingHistory(); // Refresh the data
            } else {
                message.success('Check-in thành công!');
                fetchBookingHistory(); // Refresh the data
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            message.error('Không thể check-in. Vui lòng thử lại.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'orange';
            case 'CONFIRMED':
                return 'blue';
            case 'CHECKED_IN':
                return 'cyan';
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
            case 'CHECKED_IN':
                return 'Đã check-in';
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
            case 'CHECKED_IN':
                return <LoginOutlined />;
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
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => showBookingDetail(record)}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'CHECKED' && (
                        <Popconfirm
                            title="Xác nhận check-in"
                            description="Sau khi check-in, bạn sẽ bắt buộc phải thanh toán ngay lập tức"
                            onConfirm={() => handleCheckIn(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Button
                                type="primary"
                                size="small"
                                icon={<LoginOutlined />}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                                }}
                            >
                                Check-in
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
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
        const checkedIn = bookings.filter(b => b.status === 'CHECKED_IN').length;
        const pending = bookings.filter(b => b.status === 'PENDING').length;
        const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
        const totalSpent = bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        return { total, completed, checkedIn, pending, cancelled, totalSpent };
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
                                                <div className="booking-summary-label">Đã check-in</div>
                                                <div className="booking-summary-value">{stats.checkedIn}</div>
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
                                                    <div className="booking-summary-label">Đã check-in</div>
                                                    <div className="booking-summary-value">{stats.checkedIn}</div>
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