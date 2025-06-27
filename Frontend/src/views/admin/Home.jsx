import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Modal,
  Table,
  Tag,
  Space,
  Image,
  Button,
  Statistic,
  Avatar,
  Progress,
  Badge,
  Divider,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  CarOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { message } from "antd";

import Echart from "../../components/admin/chart/EChart";
import LineChart from "../../components/admin/chart/LineChart";
import { adminService } from "../../services/adminService";

function Home() {
  const { Title, Text } = Typography;
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCarsModalVisible, setPendingCarsModalVisible] = useState(false);
  const [pendingCars, setPendingCars] = useState([]);
  const [pendingCarsLoading, setPendingCarsLoading] = useState(false);
  const [pendingBookingsModalVisible, setPendingBookingsModalVisible] = useState(false);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingBookingsLoading, setPendingBookingsLoading] = useState(false);
  const [newUsersData, setNewUsersData] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboard();
        setDashboardData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    const fetchNewUsersData = async () => {
      try {
        const response = await adminService.getNewUsersInLast7Days();
        setNewUsersData(response);
      } catch (error) {
        console.error('Error fetching new users data:', error);
        message.error(error.response?.data?.message || 'Failed to load new users data');
      }
    };

    fetchDashboardData();
    fetchNewUsersData();
  }, []);

  // Fetch pending cars
  const fetchPendingCars = async () => {
    try {
      setPendingCarsLoading(true);
      const result = await adminService.getCarsPendingApproval();
      if (result.content) {
        setPendingCars(result.content);
      } else {
        setPendingCars([]);
      }
    } catch (error) {
      console.error('Error fetching pending cars:', error);
      message.error(error.response?.data?.message || 'Failed to load pending cars');
      setPendingCars([]);
    } finally {
      setPendingCarsLoading(false);
    }
  };

  // Handle car approval
  const handleApproveCar = async (carId) => {
    try {
      const result = await adminService.approveCar(carId);
      if (result.status === 200) {
        message.success('Car approved successfully');
        fetchPendingCars();
        const dashboardResponse = await adminService.getDashboard();
        setDashboardData(dashboardResponse);
      } else {
        message.error(result.data?.message || 'Failed to approve car');
      }
    } catch (error) {
      console.error('Error approving car:', error);
      message.error(error.response?.data?.message || 'Failed to approve car');
    }
  };

  // Handle car rejection
  const handleRejectCar = async (carId) => {
    try {
      const result = await adminService.rejectCar(carId);
      if (result.status === 200) {
        message.success('Car rejected successfully');
        fetchPendingCars();
        const dashboardResponse = await adminService.getDashboard();
        setDashboardData(dashboardResponse);
      } else {
        message.error(result.data?.message || 'Failed to reject car');
      }
    } catch (error) {
      console.error('Error rejecting car:', error);
      message.error(error.response?.data?.message || 'Failed to reject car');
    }
  };

  // Show pending cars modal
  const showPendingCarsModal = () => {
    setPendingCarsModalVisible(true);
    fetchPendingCars();
  };

  // Fetch pending bookings
  const fetchPendingBookings = async () => {
    try {
      setPendingBookingsLoading(true);
      const result = await adminService.getBookingWaitingApproval();
      if (result.content) {
        setPendingBookings(result.content);
      } else {
        setPendingBookings([]);
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      message.error(error.response?.data?.message || 'Failed to load pending bookings');
      setPendingBookings([]);
    } finally {
      setPendingBookingsLoading(false);
    }
  };

  // Show pending bookings modal
  const showPendingBookingsModal = () => {
    setPendingBookingsModalVisible(true);
    fetchPendingBookings();
  };

  // Statistics data with improved styling
  const statisticsData = [
    {
      title: "Total Users",
      value: dashboardData?.totalUsers || 0,
      prefix: <UserOutlined style={{ color: '#1890ff' }} />,
      suffix: "users",
      trend: dashboardData?.userGrowth || "+0%",
      trendUp: dashboardData?.userGrowth ? dashboardData.userGrowth.startsWith('+') : true,
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      iconColor: "#1890ff"
    },
    {
      title: "Total Cars",
      value: dashboardData?.totalCars || 0,
      prefix: <CarOutlined style={{ color: '#52c41a' }} />,
      suffix: "vehicles",
      trend: dashboardData?.carGrowth || "+0%",
      trendUp: dashboardData?.carGrowth ? dashboardData.carGrowth.startsWith('+') : true,
      backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      iconColor: "#52c41a"
    },
    {
      title: "Total Bookings",
      value: dashboardData?.totalBookings || 0,
      prefix: <CalendarOutlined style={{ color: '#fa8c16' }} />,
      suffix: "bookings",
      trend: dashboardData?.bookingGrowth || "+0%",
      trendUp: dashboardData?.bookingGrowth ? dashboardData.bookingGrowth.startsWith('+') : true,
      backgroundColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      iconColor: "#fa8c16"
    },
    {
      title: "Total Revenue",
      value: dashboardData?.totalRevenue ? (dashboardData.totalRevenue / 1000000).toFixed(1) : 0,
      prefix: <DollarCircleOutlined style={{ color: '#722ed1' }} />,
      suffix: "M VND",
      trend: dashboardData?.revenueGrowth || "+0%",
      trendUp: dashboardData?.revenueGrowth ? dashboardData.revenueGrowth.startsWith('+') : true,
      backgroundColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      iconColor: "#722ed1"
    }
  ];

  // Pending items data
  const pendingItems = [
    {
      title: "Cars Pending Approval",
      count: dashboardData?.carsPendingApproval || 0,
      icon: <CarOutlined />,
      color: "#fa8c16",
      onClick: showPendingCarsModal,
      clickable: true
    },
    {
      title: "Documents Pending",
      count: dashboardData?.documentsPendingApproval || 0,
      icon: <FileTextOutlined />,
      color: "#1890ff",
      clickable: false
    },
    {
      title: "Bookings Awaiting Action",
      count: dashboardData?.bookingsAwaitingAction || 0,
      icon: <ClockCircleOutlined />,
      color: "#f5222d",
      onClick: showPendingBookingsModal,
      clickable: true
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column'
        }}>
          <Spin size="large" />
          <Text style={{ marginTop: 16, fontSize: 16 }}>Loading dashboard...</Text>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
              Admin Dashboard
            </Title>
            <Text style={{ color: '#6b7280', fontSize: 16 }}>
              Welcome back! Here's what's happening with your car rental platform.
            </Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {statisticsData.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{
                    background: stat.backgroundColor,
                    border: 'none',
                    borderRadius: 16,
                    overflow: 'hidden',
                    height: 160,
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ position: 'relative', height: '100%' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      opacity: 0.2,
                      fontSize: 48
                    }}>
                      {stat.prefix}
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>
                        {stat.title}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Statistic
                          value={stat.value}
                          suffix={stat.suffix}
                          valueStyle={{
                            color: 'white',
                            fontSize: 28,
                            fontWeight: 'bold'
                          }}
                        />
                      </div>
                      <div style={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {stat.trendUp ? (
                          <ArrowUpOutlined style={{ color: '#10b981', fontSize: 12 }} />
                        ) : (
                          <ArrowDownOutlined style={{ color: '#ef4444', fontSize: 12 }} />
                        )}
                        <Text style={{ color: 'white', fontSize: 12, opacity: 0.9 }}>
                          {stat.trend} vs last month
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pending Actions Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                    <span>Pending Actions</span>
                  </div>
                }
                style={{ borderRadius: 12 }}
                headStyle={{
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                <Row gutter={[16, 16]}>
                  {pendingItems.map((item, index) => (
                    <Col xs={24} sm={8} key={index}>
                      <Card
                        hoverable={item.clickable}
                        onClick={item.clickable ? item.onClick : undefined}
                        style={{
                          borderRadius: 12,
                          border: `1px solid ${item.color}20`,
                          backgroundColor: `${item.color}08`,
                          cursor: item.clickable ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                        }}
                        bodyStyle={{ padding: 20, textAlign: 'center' }}
                        className={item.clickable ? 'pending-card-hover' : ''}
                      >
                        <Badge count={item.count} offset={[10, -10]} color={item.color}>
                          <Avatar
                            size={48}
                            style={{
                              backgroundColor: `${item.color}20`,
                              color: item.color,
                              border: `2px solid ${item.color}40`
                            }}
                            icon={item.icon}
                          />
                        </Badge>
                        <div style={{ marginTop: 16 }}>
                          <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: item.color,
                            display: 'block'
                          }}>
                            {item.count}
                          </Text>
                          <Text style={{ color: '#6b7280', fontSize: 14 }}>
                            {item.title}
                          </Text>
                          {item.clickable && (
                            <div style={{
                              marginTop: 8,
                              fontSize: 12,
                              color: item.color,
                              opacity: 0.8
                            }}>
                              Click to manage
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Recent Users Section */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined style={{ color: '#722ed1' }} />
                    <span>Recent Users (Last 7 Days)</span>
                    <Badge
                      count={newUsersData?.totalElements || 0}
                      style={{ backgroundColor: '#722ed1' }}
                    />
                  </div>
                }
                style={{ borderRadius: 12 }}
                headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                extra={
                  <Button type="primary" ghost onClick={() => navigate('/admin/users')}>
                    View All Users
                  </Button>
                }
              >
                {newUsersData?.content && newUsersData.content.length > 0 ? (
                  <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    <Table
                      dataSource={newUsersData.content}
                      pagination={false}
                      size="small"
                      rowKey="id"
                      style={{ backgroundColor: 'transparent' }}
                      onRow={(record) => ({
                        onClick: () => navigate(`/admin/users/${record.id}`),
                        style: { cursor: 'pointer' }
                      })}
                      columns={[
                        {
                          title: 'User',
                          key: 'user',
                          width: '40%',
                          render: (_, record) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <Avatar
                                size={40}
                                src={record.profilePicture}
                                style={{
                                  backgroundColor: record.profilePicture ? 'transparent' : '#1890ff',
                                  border: '2px solid #f0f0f0'
                                }}
                              >
                                {record.firstName?.[0] || record.email[0]}
                              </Avatar>
                              <div>
                                <Text style={{ fontWeight: 500, display: 'block' }}>
                                  {record.firstName && record.lastName
                                    ? `${record.firstName} ${record.lastName}`
                                    : record.email?.split('@')[0]
                                  }
                                </Text>
                                <Text style={{ color: '#6b7280', fontSize: 12 }}>
                                  {record.email}
                                </Text>
                                {record.phone && (
                                  <Text style={{ color: '#9ca3af', fontSize: 11, display: 'block' }}>
                                    {record.phone}
                                  </Text>
                                )}
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: 'Status',
                          key: 'status',
                          width: '20%',
                          render: (_, record) => (
                            <div>
                              <Tag
                                color={record.active ? 'green' : 'red'}
                                style={{ marginBottom: 4 }}
                              >
                                {record.active ? 'Active' : 'Inactive'}
                              </Tag>
                              <br />
                              <Tag color="blue" size="small">
                                {record.roles?.[0]?.toUpperCase() || 'USER'}
                              </Tag>
                            </div>
                          ),
                        },
                        {
                          title: 'Address',
                          key: 'address',
                          width: '25%',
                          render: (_, record) => (
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>
                              {record.address?.address || 'No address provided'}
                            </Text>
                          ),
                        },
                        {
                          title: 'Joined',
                          dataIndex: 'createdAt',
                          key: 'createdAt',
                          width: '15%',
                          render: (date) => (
                            <div>
                              <Text style={{ fontSize: 13, display: 'block' }}>
                                {new Date(date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </Text>
                              <Text style={{ color: '#6b7280', fontSize: 11 }}>
                                {new Date(date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <UserOutlined style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }} />
                    <Text style={{ color: '#6b7280', display: 'block' }}>
                      No new users in the last 7 days
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )
      }

      {/* Pending Cars Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CarOutlined style={{ color: '#fa8c16' }} />
            <span>Cars Pending Approval</span>
          </div>
        }
        open={pendingCarsModalVisible}
        onCancel={() => setPendingCarsModalVisible(false)}
        width={1200}
        footer={null}
        style={{ top: 20 }}
      >
        <Table
          dataSource={pendingCars}
          loading={pendingCarsLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} cars`,
          }}
          columns={[
            {
              title: 'Car Information',
              key: 'carInfo',
              width: '30%',
              render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden' }}>
                    {record.images && record.images.length > 0 ? (
                      <Image
                        width={60}
                        height={60}
                        src={record.images[0].imageUrl || record.images[0]}
                        style={{ objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    ) : (
                      <div style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        color: '#bfbfbf'
                      }}>
                        🚗
                      </div>
                    )}
                  </div>
                  <div>
                    <Text style={{ fontWeight: 600, fontSize: 14, display: 'block' }}>
                      {record.name}
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>
                      {record.carBrand?.name} {record.model} ({record.year})
                    </Text>
                    <Text style={{ color: '#9ca3af', fontSize: 11 }}>
                      {record.licensePlate}
                    </Text>
                  </div>
                </div>
              ),
            },
            {
              title: 'Owner',
              dataIndex: 'emailOwner',
              key: 'emailOwner',
              width: '20%',
              render: (email) => (
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  {email}
                </Text>
              ),
            },
            {
              title: 'Specifications',
              key: 'specs',
              width: '25%',
              render: (_, record) => (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Tag color={record.transmission === 'AUTO' ? 'blue' : 'green'}>
                      {record.transmission}
                    </Tag>
                    <Tag color="purple">
                      {record.carType}
                    </Tag>
                  </div>
                  <Text style={{ fontSize: 12, color: '#6b7280', display: 'block' }}>
                    {record.seats} seats • {record.fuelType}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#9ca3af' }}>
                    {record.fuelConsumption}
                  </Text>
                </div>
              ),
            },
            {
              title: 'Pricing',
              key: 'pricing',
              width: '15%',
              render: (_, record) => (
                <div>
                  <Text style={{ fontWeight: 600, fontSize: 13, display: 'block' }}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(record.pricePerHour)}/hour
                  </Text>
                  <Text style={{ fontSize: 11, color: '#6b7280' }}>
                    Daily: {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(record.pricePer24Hour)}
                  </Text>
                </div>
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              width: '20%',
              render: (_, record) => (
                <Space size="small">
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleApproveCar(record.id)}
                    size="small"
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleRejectCar(record.id)}
                    size="small"
                  >
                    Reject
                  </Button>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => window.open(`/admin/cars/${record.id}`, '_blank')}
                    size="small"
                  >
                    View
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Modal>

      {/* Pending Bookings Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClockCircleOutlined style={{ color: '#f5222d' }} />
            <span>Bookings Awaiting Action</span>
          </div>
        }
        open={pendingBookingsModalVisible}
        onCancel={() => setPendingBookingsModalVisible(false)}
        width={1400}
        footer={null}
        style={{ top: 20 }}
      >
        <Table
          dataSource={pendingBookings}
          loading={pendingBookingsLoading}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Booking Info',
              key: 'bookingInfo',
              width: '18%',
              render: (_, record) => (
                <div>
                  <Text style={{ fontWeight: 600, fontSize: 13, display: 'block' }}>
                    #{record.id}
                  </Text>
                  <Text style={{ color: '#6b7280', fontSize: 11, display: 'block' }}>
                    {record.bookingCode}
                  </Text>
                  <Text style={{ color: '#9ca3af', fontSize: 10, display: 'block' }}>
                    {new Date(record.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                  <Tag
                    color={
                      record.status === 'PENDING' ? 'orange' :
                        record.status === 'CONFIRMED' ? 'blue' :
                          record.status === 'COMPLETED' ? 'green' :
                            record.status === 'CANCELLED' ? 'red' :
                              record.status === 'WAITING_REFUND' ? 'purple' :
                                record.status === 'WAITING_EXTRA_CHARGE' ? 'gold' : 'default'
                    }
                    size="small"
                  >
                    {record.status.replace('_', ' ')}
                  </Tag>
                  {record.discountCode && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color="green" size="small">
                        {record.discountCode}
                      </Tag>
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: 'Customer',
              key: 'customer',
              width: '18%',
              render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>
                    {record.user?.firstName?.[0] || record.user?.email?.[0] || 'U'}
                  </Avatar>
                  <div>
                    <Text style={{ fontWeight: 500, fontSize: 13, display: 'block' }}>
                      {record.user?.firstName && record.user?.lastName
                        ? `${record.user.firstName} ${record.user.lastName}`
                        : record.user?.email?.split('@')[0] || 'Unknown User'
                      }
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: 11 }}>
                      {record.user?.email}
                    </Text>
                    {record.user?.phone && (
                      <Text style={{ color: '#9ca3af', fontSize: 10, display: 'block' }}>
                        {record.user.phone}
                      </Text>
                    )}
                  </div>
                </div>
              ),
            },
            {
              title: 'Car',
              key: 'car',
              width: '20%',
              render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 6, overflow: 'hidden' }}>
                    {record.car?.images && record.car.images.length > 0 ? (
                      <Image
                        width={50}
                        height={50}
                        src={record.car.images[0].imageUrl || record.car.images[0]}
                        style={{ objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    ) : (
                      <div style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: '#bfbfbf'
                      }}>
                        🚗
                      </div>
                    )}
                  </div>
                  <div>
                    <Text style={{ fontWeight: 500, fontSize: 13, display: 'block' }}>
                      {record.car?.name || 'Unknown Car'}
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: 11, display: 'block' }}>
                      {record.car?.carBrand?.name} {record.car?.model} ({record.car?.year})
                    </Text>
                    <Text style={{ color: '#9ca3af', fontSize: 10 }}>
                      {record.car?.licensePlate}
                    </Text>
                  </div>
                </div>
              ),
            },
            {
              title: 'Rental Period',
              key: 'period',
              width: '18%',
              render: (_, record) => (
                <div>
                  <Text style={{ fontSize: 12, display: 'block' }}>
                    <strong>Pickup:</strong> {new Date(record.pickupTime).toLocaleDateString('vi-VN')}
                  </Text>
                  <Text style={{ fontSize: 12, display: 'block' }}>
                    <strong>Return:</strong> {new Date(record.returnTime).toLocaleDateString('vi-VN')}
                  </Text>
                  <Text style={{ color: '#6b7280', fontSize: 11 }}>
                    Duration: {Math.ceil((new Date(record.returnTime) - new Date(record.pickupTime)) / (1000 * 60 * 60 * 24))} days
                  </Text>
                  <Text style={{ color: '#9ca3af', fontSize: 10, display: 'block' }}>
                    Type: {record.type}
                  </Text>
                </div>
              ),
            },
            {
              title: 'Location',
              key: 'location',
              width: '17%',
              render: (_, record) => (
                <div>
                  <Text style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>
                    {record.location?.address || 'No address provided'}
                  </Text>
                  {record.driver && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color="blue" size="small">With Driver</Tag>
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: 'Amount',
              key: 'amount',
              width: '14%',
              render: (_, record) => (
                <div>
                  <Text style={{ fontWeight: 600, fontSize: 12, display: 'block' }}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(record.rentalPrice || 0)}
                  </Text>
                  <Text style={{ color: '#6b7280', fontSize: 10, display: 'block' }}>
                    Rental Price
                  </Text>
                  {record.reservationFee > 0 && (
                    <Text style={{ color: '#fa8c16', fontSize: 10, display: 'block' }}>
                      Fee: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.reservationFee)}
                    </Text>
                  )}
                  {record.depositAmount > 0 && (
                    <Text style={{ color: '#722ed1', fontSize: 10, display: 'block' }}>
                      Deposit: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.depositAmount)}
                    </Text>
                  )}
                  {record.totalExtraCharges > 0 && (
                    <Text style={{ color: '#f5222d', fontSize: 10, display: 'block' }}>
                      Extra: +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalExtraCharges)}
                    </Text>
                  )}
                  {record.totalDiscount > 0 && (
                    <Text style={{ color: '#52c41a', fontSize: 10, display: 'block' }}>
                      Discount: -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalDiscount)}
                    </Text>
                  )}
                  {record.totalRefunded > 0 && (
                    <Text style={{ color: '#52c41a', fontSize: 10, display: 'block' }}>
                      Refunded: -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalRefunded)}
                    </Text>
                  )}
                </div>
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              width: '13%',
              render: (_, record) => (
                <Button
                  type="primary"
                  size="small"
                  style={{ width: '100%' }}
                  onClick={() => {
                    navigate(`/admin/bookings/${record.id}`);
                    setPendingBookingsModalVisible(false);
                  }}
                >
                  Manage
                </Button>
              ),
            },
          ]}
        />
      </Modal>

      <style jsx>{`
        .pending-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </div >
  );
}

export default Home;
