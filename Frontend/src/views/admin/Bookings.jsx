import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Table,
    Space,
    Button,
    Tag,
    Tooltip,
    Modal,
    message,
    Typography,
    Row,
    Col,
    Descriptions,
    Input,
    Select,
    DatePicker,
    Popconfirm,
    Spin,
    Image,
    Statistic,
    Divider,
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
    FilterOutlined,
    CarOutlined,
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
    ReloadOutlined,
    ExportOutlined,
    FileExcelOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { bookingService } from '../../services/bookingService';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Bookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState([]);
    const [statistics, setStatistics] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            // API pagination starts from 0, but UI starts from 1
            const result = await bookingService.getBookings(page - 1, pageSize);

            if (result.status === 200 && result.data) {
                // Handle both array response and paginated response
                const bookingsData = Array.isArray(result.data) ? result.data : result.data.content || [];
                const totalElements = Array.isArray(result.data) ? result.data.length : result.data.totalElements || 0;

                setBookings(bookingsData);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize,
                    total: totalElements,
                }));

                // Calculate statistics
                const stats = {
                    total: totalElements,
                    pending: bookingsData.filter(b => b.status === 'PENDING').length,
                    confirmed: bookingsData.filter(b => b.status === 'CONFIRMED').length,
                    completed: bookingsData.filter(b => b.status === 'COMPLETED').length,
                    cancelled: bookingsData.filter(b => b.status === 'CANCELLED').length,
                    revenue: bookingsData
                        .filter(b => b.status === 'COMPLETED')
                        .reduce((sum, b) => sum + (b.rentalPrice || 0), 0),
                };
                setStatistics(stats);
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch bookings';
                message.error(errorMessage);
                setBookings([]);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bookings';
            message.error(errorMessage);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (paginationInfo) => {
        const { current, pageSize } = paginationInfo;
        fetchBookings(current, pageSize);
    };

    const handleViewBooking = (booking) => {
        navigate(`/admin/bookings/${booking.id}`);
    };

    const handleConfirmBooking = async (bookingId) => {
        try {
            const result = await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');
            if (result.status === 200) {
                message.success('Booking confirmed successfully');
                fetchBookings(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to confirm booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm booking';
            message.error(errorMessage);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const result = await bookingService.cancelBooking(bookingId, 'Cancelled by admin');
            if (result.status === 200) {
                message.success('Booking cancelled successfully');
                fetchBookings(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to cancel booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel booking';
            message.error(errorMessage);
        }
    };

    const handleCompleteBooking = async (bookingId) => {
        try {
            const result = await bookingService.updateBookingStatus(bookingId, 'COMPLETED');
            if (result.status === 200) {
                message.success('Booking completed successfully');
                fetchBookings(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to complete booking';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error completing booking:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to complete booking';
            message.error(errorMessage);
        }
    };

    const handleProcessRefund = async (bookingId) => {
        try {
            const result = await bookingService.processRefund(bookingId);
            if (result.status === 200) {
                message.success('Refund processed successfully');
                fetchBookings(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to process refund';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to process refund';
            message.error(errorMessage);
        }
    };

    const handleApplyExtraCharge = async (bookingId) => {
        try {
            const result = await bookingService.applyExtraCharge(bookingId);
            if (result.status === 200) {
                message.success('Extra charge applied successfully');
                fetchBookings(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to apply extra charge';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error applying extra charge:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to apply extra charge';
            message.error(errorMessage);
        }
    };

    const handleStartUsing = async (bookingId) => {
        try {
            const result = await bookingService.updateBookingStatus(bookingId, 'USE_IN');
            if (result.status === 200) {
                message.success('Booking marked as in use');
                fetchBookings(pagination.current, pagination.pageSize);
            } else {
                const errorMessage = result.data?.message || 'Failed to update booking status';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update booking status';
            message.error(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': 'orange',
            'CONFIRMED': 'blue',
            'USE_IN': 'cyan',
            'WAITING_REFUND': 'purple',
            'WAITING_EXTRA_CHARGE': 'magenta',
            'CANCELLED': 'red',
            'COMPLETED': 'green',
        };
        return statusColors[status] || 'default';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'Chờ xác nhận',
            'CONFIRMED': 'Đã xác nhận',
            'USE_IN': 'Đang sử dụng',
            'WAITING_REFUND': 'Chờ hoàn tiền',
            'WAITING_EXTRA_CHARGE': 'Chờ thu phí phụ',
            'CANCELLED': 'Đã hủy',
            'COMPLETED': 'Hoàn thành',
        };
        return statusTexts[status] || status;
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0 VNĐ';
        return `${amount.toLocaleString('vi-VN')} VNĐ`;
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return dayjs(date).format('DD/MM/YYYY');
    };

    // Enhanced export function
    //   const handleExportData = () => {
    //     try {
    //       const csvContent = [
    //         ['ID', 'Booking Code', 'Customer', 'Car', 'Pickup Time', 'Return Time', 'Status', 'Rental Price'],
    //         ...filteredData.map(booking => [
    //           booking.id,
    //           booking.bookingCode || '',
    //           `${booking.user?.firstName} ${booking.user?.lastName}`,
    //           booking.car?.name,
    //           formatDate(booking.pickupTime),
    //           formatDate(booking.returnTime),
    //           getStatusText(booking.status),
    //           booking.rentalPrice
    //         ])
    //       ].map(row => row.join(',')).join('\n');

    //       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    //       const link = document.createElement('a');
    //       const url = URL.createObjectURL(blob);
    //       link.setAttribute('href', url);
    //       link.setAttribute('download', `bookings_${dayjs().format('YYYY_MM_DD')}.csv`);
    //       link.style.visibility = 'hidden';
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);

    //       message.success('Dữ liệu đã được xuất thành công');
    //     } catch (error) {
    //       console.error('Export error:', error);
    //       message.error('Lỗi khi xuất dữ liệu');
    //     }
    //   };

    const handleExportData = () => {
        try {
            const worksheetData = [
                ['ID', 'Booking Code', 'Customer', 'Car', 'Pickup Time', 'Return Time', 'Status', 'Rental Price'],
                ...filteredData.map(booking => [
                    booking.id,
                    booking.bookingCode || '',
                    `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`,
                    booking.car?.name || '',
                    formatDate(booking.pickupTime),
                    formatDate(booking.returnTime),
                    getStatusText(booking.status),
                    booking.rentalPrice
                ])
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bookings_${dayjs().format('YYYY_MM_DD')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            message.success('Dữ liệu đã được xuất thành Excel thành công');
        } catch (error) {
            console.error('Export error:', error);
            message.error(error.response?.data?.message || 'Lỗi khi xuất dữ liệu Excel');
        }
    };

    // Refresh data
    const handleRefresh = () => {
        fetchBookings(pagination.current, pagination.pageSize);
        message.success('Dữ liệu đã được làm mới');
    };

    // Bulk actions
    const handleBulkConfirm = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một đặt xe');
            return;
        }

        setBulkActionLoading(true);
        try {
            const promises = selectedRowKeys.map(id =>
                bookingService.updateBookingStatus(id, 'CONFIRMED')
            );

            await Promise.all(promises);
            message.success(`Đã xác nhận ${selectedRowKeys.length} đặt xe`);
            setSelectedRowKeys([]);
            fetchBookings(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error('Bulk confirm error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xác nhận đặt xe';
            message.error(errorMessage);
        } finally {
            setBulkActionLoading(false);
        }
    };

    const handleBulkCancel = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Vui lòng chọn ít nhất một đặt xe');
            return;
        }

        setBulkActionLoading(true);
        try {
            const promises = selectedRowKeys.map(id =>
                bookingService.cancelBooking(id, 'Hủy hàng loạt bởi admin')
            );

            await Promise.all(promises);
            message.success(`Đã hủy ${selectedRowKeys.length} đặt xe`);
            setSelectedRowKeys([]);
            fetchBookings(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error('Bulk cancel error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi hủy đặt xe';
            message.error(errorMessage);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Row selection config
    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
        getCheckboxProps: (record) => ({
            disabled: record.status === 'COMPLETED' || record.status === 'CANCELLED',
        }),
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '60px',
            render: (id) => <Text code>#{id}</Text>,
        },
        {
            title: 'Mã đặt xe',
            dataIndex: 'bookingCode',
            key: 'bookingCode',
            width: '200px',
            render: (code) => (
                <Text code style={{ fontSize: 11, color: '#1890ff' }}>
                    {code}
                </Text>
            ),
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'user',
            width: '200px',
            render: (user) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <div>
                        <Text strong>{user?.firstName} {user?.lastName}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{user?.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Xe',
            dataIndex: 'car',
            key: 'car',
            width: '250px',
            render: (car) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {car?.images && car.images.length > 0 ? (
                        <Image
                            width={50}
                            height={50}
                            src={car.images[0].imageUrl}
                            style={{ borderRadius: 8, objectFit: 'cover' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxY4Q9//8/BbaAGOLiLKvWBvs5eaKp6hSu9Aw4AAAAAAAAz8mU3dUaAAAAAElFTkSuQmCC"
                        />
                    ) : (
                        <div style={{
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f0f0f0',
                            borderRadius: 8,
                            color: '#bbb',
                        }}>
                            <CarOutlined />
                        </div>
                    )}
                    <div>
                        <Text strong>{car?.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{car?.carBrand?.name}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thời gian',
            key: 'datetime',
            width: '200px',
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <CalendarOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                        <Text style={{ fontSize: 12 }}>Nhận: {formatDate(record.pickupTime)}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                        <Text style={{ fontSize: 12 }}>Trả: {formatDate(record.returnTime)}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '130px',
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'rentalPrice',
            key: 'rentalPrice',
            width: '120px',
            render: (amount) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <Text strong style={{ color: '#52c41a' }}>
                        {formatCurrency(amount)}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '200px',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewBooking(record)}
                            size="small"
                        />
                    </Tooltip>

                    {record.status === 'PENDING' && (
                        <>
                            <Popconfirm
                                title="Xác nhận đặt xe này?"
                                onConfirm={() => handleConfirmBooking(record.id)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Tooltip title="Xác nhận">
                                    <Button
                                        type="text"
                                        icon={<CheckOutlined />}
                                        size="small"
                                        style={{ color: '#52c41a' }}
                                    />
                                </Tooltip>
                            </Popconfirm>

                            <Popconfirm
                                title="Hủy đặt xe này?"
                                onConfirm={() => handleCancelBooking(record.id)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Tooltip title="Hủy">
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        danger
                                        size="small"
                                    />
                                </Tooltip>
                            </Popconfirm>
                        </>
                    )}

                    {record.status === 'CONFIRMED' && (
                        <Popconfirm
                            title="Bắt đầu sử dụng xe?"
                            onConfirm={() => handleStartUsing(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Tooltip title="Bắt đầu sử dụng">
                                <Button
                                    type="text"
                                    icon={<CarOutlined />}
                                    size="small"
                                    style={{ color: '#1890ff' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}

                    {record.status === 'USE_IN' && (
                        <Popconfirm
                            title="Hoàn thành đặt xe này?"
                            onConfirm={() => handleCompleteBooking(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Tooltip title="Hoàn thành">
                                <Button
                                    type="text"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    style={{ color: '#52c41a' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}

                    {record.status === 'WAITING_REFUND' && (
                        <Popconfirm
                            title="Xử lý hoàn tiền?"
                            onConfirm={() => handleProcessRefund(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Tooltip title="Xử lý hoàn tiền">
                                <Button
                                    type="text"
                                    icon={<DollarOutlined />}
                                    size="small"
                                    style={{ color: '#722ed1' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}

                    {record.status === 'WAITING_EXTRA_CHARGE' && (
                        <Popconfirm
                            title="Thu phí phát sinh?"
                            onConfirm={() => handleApplyExtraCharge(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Tooltip title="Thu phí phát sinh">
                                <Button
                                    type="text"
                                    icon={<DollarOutlined />}
                                    size="small"
                                    style={{ color: '#eb2f96' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const filteredData = bookings.filter(booking => {
        const matchesSearch = !searchText ||
            booking.user?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.user?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.car?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            booking.bookingCode?.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            {/* Statistics Cards */}
            <div style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Card size="small">
                            <Statistic
                                title="Tổng đặt xe"
                                value={statistics.total}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Card size="small">
                            <Statistic
                                title="Chờ xác nhận"
                                value={statistics.pending}
                                valueStyle={{ color: '#fa8c16' }}
                                prefix={<CloseOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Card size="small">
                            <Statistic
                                title="Đang sử dụng"
                                value={bookings.filter(b => b.status === 'USE_IN').length}
                                valueStyle={{ color: '#13c2c2' }}
                                prefix={<CarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Card size="small">
                            <Statistic
                                title="Chờ xử lý"
                                value={bookings.filter(b => b.status === 'WAITING_REFUND' || b.status === 'WAITING_EXTRA_CHARGE').length}
                                valueStyle={{ color: '#eb2f96' }}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Card size="small">
                            <Statistic
                                title="Hoàn thành"
                                value={statistics.completed}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Card size="small">
                            <Statistic
                                title="Doanh thu"
                                value={statistics.revenue}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<DollarOutlined />}
                                formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CalendarOutlined style={{ color: '#1890ff' }} />
                                    <span>Quản lý đặt xe</span>
                                </div>
                            }
                            extra={
                                <Space wrap>
                                    <Search
                                        placeholder="Tìm kiếm khách hàng, xe, mã đặt xe..."
                                        allowClear
                                        style={{ width: 280 }}
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        prefix={<SearchOutlined />}
                                    />
                                    <Select
                                        placeholder="Trạng thái"
                                        style={{ width: 150 }}
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                        suffixIcon={<FilterOutlined />}
                                    >
                                        <Option value="all">Tất cả</Option>
                                        <Option value="PENDING">Chờ xác nhận</Option>
                                        <Option value="CONFIRMED">Đã xác nhận</Option>
                                        <Option value="USE_IN">Đang sử dụng</Option>
                                        <Option value="WAITING_REFUND">Chờ hoàn tiền</Option>
                                        <Option value="WAITING_EXTRA_CHARGE">Chờ thu phí phụ</Option>
                                        <Option value="CANCELLED">Đã hủy</Option>
                                        <Option value="COMPLETED">Hoàn thành</Option>
                                    </Select>
                                    <Tooltip title="Làm mới dữ liệu">
                                        <Button
                                            icon={<ReloadOutlined />}
                                            onClick={handleRefresh}
                                            disabled={loading}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Xuất dữ liệu Excel">
                                        <Button
                                            icon={<FileExcelOutlined />}
                                            onClick={handleExportData}
                                            disabled={loading || filteredData.length === 0}
                                        />
                                    </Tooltip>
                                </Space>
                            }
                        >
                            {/* Bulk Actions */}
                            {selectedRowKeys.length > 0 && (
                                <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8 }}>
                                    <Space>
                                        <Text strong>
                                            Đã chọn {selectedRowKeys.length} đặt xe
                                        </Text>
                                        <Divider type="vertical" />
                                        <Popconfirm
                                            title="Xác nhận tất cả đặt xe đã chọn?"
                                            onConfirm={handleBulkConfirm}
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <Button
                                                type="primary"
                                                icon={<CheckOutlined />}
                                                loading={bulkActionLoading}
                                                disabled={!selectedRowKeys.some(id => {
                                                    const booking = bookings.find(b => b.id === id);
                                                    return booking?.status === 'PENDING';
                                                })}
                                            >
                                                Xác nhận hàng loạt
                                            </Button>
                                        </Popconfirm>
                                        <Popconfirm
                                            title="Hủy tất cả đặt xe đã chọn?"
                                            onConfirm={handleBulkCancel}
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <Button
                                                danger
                                                icon={<CloseOutlined />}
                                                loading={bulkActionLoading}
                                                disabled={!selectedRowKeys.some(id => {
                                                    const booking = bookings.find(b => b.id === id);
                                                    return booking?.status === 'PENDING' || booking?.status === 'CONFIRMED';
                                                })}
                                            >
                                                Hủy hàng loạt
                                            </Button>
                                        </Popconfirm>
                                        <Button
                                            onClick={() => setSelectedRowKeys([])}
                                            disabled={bulkActionLoading}
                                        >
                                            Bỏ chọn tất cả
                                        </Button>
                                    </Space>
                                </div>
                            )}

                            <div className="table-responsive">
                                <Spin spinning={loading}>
                                    <Table
                                        columns={columns}
                                        dataSource={filteredData}
                                        rowSelection={rowSelection}
                                        pagination={{
                                            ...pagination,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            showTotal: (total, range) =>
                                                `${range[0]}-${range[1]} of ${total} bookings`,
                                        }}
                                        onChange={handleTableChange}
                                        className="ant-border-space"
                                        rowKey="id"
                                        scroll={{ x: 1200 }}
                                    />
                                </Spin>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Booking Detail Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <EyeOutlined />
                        <span>Chi tiết đặt xe #{selectedBooking?.id}</span>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
                width={800}
            >
                {selectedBooking && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small" title="Thông tin khách hàng">
                                    <Descriptions column={2} size="small">
                                        <Descriptions.Item label="Họ tên">
                                            {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {selectedBooking.user?.email}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Số điện thoại">
                                            {selectedBooking.user?.phone || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">
                                            <Tag color={getStatusColor(selectedBooking.status)}>
                                                {getStatusText(selectedBooking.status)}
                                            </Tag>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card size="small" title="Thông tin xe">
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {selectedBooking.car?.images && selectedBooking.car.images.length > 0 && (
                                            <Image
                                                width={120}
                                                height={80}
                                                src={selectedBooking.car.images[0].imageUrl}
                                                style={{ borderRadius: 8, objectFit: 'cover' }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Tên xe">
                                                    {selectedBooking.car?.name}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Hãng xe">
                                                    {selectedBooking.car?.carBrand?.name}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Biển số">
                                                    {selectedBooking.car?.licensePlate || 'N/A'}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Giá thuê">
                                                    {formatCurrency(selectedBooking.car?.pricePerHour)}/giờ
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card size="small" title="Chi tiết đặt xe">
                                    <Descriptions column={2} size="small">
                                        <Descriptions.Item label="Mã đặt xe">
                                            <Text code style={{ color: '#1890ff' }}>
                                                {selectedBooking.bookingCode}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Loại đặt xe">
                                            {selectedBooking.type}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Thời gian nhận xe">
                                            {formatDate(selectedBooking.pickupTime)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Thời gian trả xe">
                                            {formatDate(selectedBooking.returnTime)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa điểm nhận xe">
                                            {selectedBooking.location?.address || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phí thuê xe">
                                            <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                                                {formatCurrency(selectedBooking.rentalPrice)}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phí đặt cọc">
                                            {formatCurrency(selectedBooking.reservationFee)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Tiền cọc">
                                            {formatCurrency(selectedBooking.depositAmount)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày tạo">
                                            {formatDateTime(selectedBooking.createdAt)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Mã giảm giá">
                                            {selectedBooking.discountCode || 'Không có'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Bookings;
