import {
  Row,
  Col,
  Card,
  Table,
  message,
  Button,
  Avatar,
  Typography,
  Spin,
  Tag, Modal,
  Descriptions,
  Divider,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Popconfirm,
  Select,
  Tabs,
} from "antd";

import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, KeyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { roleService } from "../../services/roleService";
import { authService } from "../../services/authService";
import dayjs from 'dayjs';
import { Users } from "lucide-react";


const { Title } = Typography;


const getRoleDescription = (roleName) => {
  const descriptions = {
    'admin': 'Administrator with full system access and management capabilities',
    'user': 'Regular user with basic access to book and manage personal trips',
    'driver': 'Driver with access to manage vehicles and accept trip requests',
    'owner': 'Car owner with access to manage their vehicles and bookings'
  };
  return descriptions[roleName.toLowerCase()] || 'Role with specific system permissions';
};


const columns = [
  {
    title: "USER",
    dataIndex: "user",
    key: "user",
    width: "25%",
  },
  {
    title: "CONTACT",
    dataIndex: "contact",
    key: "contact",
    width: "20%",
  },
  {
    title: "ROLES",
    key: "roles",
    dataIndex: "roles",
    width: "15%",
  },
  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
    width: "10%",
  },
  {
    title: "CREATED",
    key: "created",
    dataIndex: "created",
    width: "15%",
  },
  {
    title: "ACTIONS",
    key: "actions",
    dataIndex: "actions",
    width: "15%",
  },
];


const roleColumns = [
  {
    title: "ROLE NAME",
    dataIndex: "name",
    key: "name",
    width: "40%",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    width: "60%",
  },
];


function UserPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Role management states
  const [activeTab, setActiveTab] = useState('users');
  const [roles, setRoles] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);

  const [createForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm(); const handleViewUser = (userId) => {
    // Navigate to user detail page
    navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId) => {
    // Navigate to edit user page
    navigate(`/admin/users/edit/${userId}`);
  };
  const handleDeleteUser = async (userId, userName) => {
    try {
      // Additional validation - prevent deleting admin users or current user
      const userToDelete = users.find(u => u.key === userId.toString());

      if (userToDelete && userToDelete.roles && userToDelete.roles.includes('ADMIN')) {
        message.warning('Cannot delete admin users for security reasons');
        return;
      }

      const result = await userService.deleteUser(userId);

      if (result.status === 200) {
        message.success(`User "${userName}" deleted successfully!`);
        // Refresh the users list
        fetchUsers(pagination.current - 1, pagination.pageSize);
      } else {
        message.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(error.message || 'Failed to delete user');
    }
  };

  // Handle change password functionality
  const handleChangePassword = async (user) => {
    setSelectedUser(user);
    setChangePasswordModalVisible(true);
    changePasswordForm.resetFields();
  };

  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
    setSelectedUser(null);
    changePasswordForm.resetFields();
  };

  const handleSubmitChangePassword = async (values) => {
    try {
      setChangePasswordLoading(true);

      const result = await authService.changePasswordByAdmin(
        selectedUser.email,
        values.newPassword
      );

      if (result.status === 200) {
        message.success(`Password changed successfully for user "${selectedUser.firstName} ${selectedUser.lastName}"`);
        handleCloseChangePasswordModal();
      } else {
        message.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus, userName, userEmail) => {
    try {
      const newStatus = !currentStatus;
      let result;

      if (newStatus) {
        // Activate user
        result = await userService.activateUser(userEmail);
      } else {
        // Deactivate user
        // result = await userService.deactivateUser(userEmail);
        return;
      }

      if (result.status === 200) {
        message.success(`User "${userName}" ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        // Refresh the users list
        fetchUsers(pagination.current - 1, pagination.pageSize);
      } else {
        message.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error(error.message || 'Failed to update user status');
    }
  };

  const fetchUsers = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const result = await userService.getUsers(page, size, 'email,asc');

      if (result.status === 200) {
        const userData = result.data.content.map((user, index) => ({
          key: user.id.toString(),
          user: (
            <Avatar.Group>
              <Avatar
                className="shape-avatar"
                shape="cricle"
                size={40}
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName || 'U'}+${user.lastName || 'ser'}&background=random`}
              />
              <div className="avatar-info">
                <Title level={5}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email.split('@')[0]
                  }
                </Title>
                <p>{user.email}</p>
              </div>
            </Avatar.Group>
          ),
          contact: (
            <div className="author-info">
              <Title level={5}>{user.phone || 'No phone'}</Title>
              <p>{user.address?.address || 'No address'}</p>
            </div>
          ),
          roles: (
            <div>
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, idx) => (
                  <Tag key={idx} color={role === 'admin' ? 'red' : role === 'driver' ? 'blue' : 'green'}>
                    {role.toUpperCase()}
                  </Tag>
                ))
              ) : (
                <Tag color="default">USER</Tag>
              )}
            </div>
          ), status: (
            <Popconfirm
              title={`${user.active ? 'Deactivate' : 'Activate'} User`}
              description={`Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`}
              onConfirm={() => handleToggleUserStatus(
                user.id,
                user.active,
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email.split('@')[0],
                user.email
              )}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                className={user.active ? "tag-primary" : "tag-badge"}
                style={{ cursor: 'pointer' }}
              >
                {user.active ? 'ACTIVE' : 'INACTIVE'}
              </Button>
            </Popconfirm>
          ), created: (
            <div className="ant-employed">
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>Edit</a>
            </div>), actions: (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="text"
                  icon={<InfoCircleOutlined />}
                  onClick={() => handleViewUser(user.id)}
                  title="View Details"
                  style={{ color: '#1890ff' }}
                />
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditUser(user.id)}
                  title="Edit User"
                />
                <Button
                  type="text"
                  icon={<KeyOutlined />}
                  onClick={() => handleChangePassword(user)}
                  title="Change Password"
                  style={{ color: '#fa8c16' }}
                />
                <Popconfirm
                  title="Delete User Account"
                  description={`Are you sure you want to permanently delete the account for "${user.firstName} ${user.lastName}"? This action cannot be undone.`}
                  onConfirm={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okType="danger"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    title="Delete User"
                    danger
                  />
                </Popconfirm>
              </div>
            ),
        }));

        setUsers(userData);
        setPagination({
          current: result.data.number + 1,
          pageSize: result.data.size,
          total: result.data.totalElements,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current - 1, pagination.pageSize);
  };
  // Role management functions
  const fetchRoles = async () => {
    try {
      setRoleLoading(true);
      const result = await roleService.getRoles();

      if (result.status === 200 && result.data) {
        const roleData = result.data.map(role => ({
          key: role.id.toString(),
          name: (
            <div>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                {role.role.toUpperCase()}
              </Tag>
            </div>
          ),
          description: getRoleDescription(role.role),
        }));

        setRoles(roleData);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Fallback to mock data if API fails
      const mockRoles = [
        {
          id: 1,
          name: 'ADMIN',
          description: 'Administrator with full access',
        },
        {
          id: 2,
          name: 'USER',
          description: 'Regular user with basic access',
        },
        {
          id: 3,
          name: 'DRIVER',
          description: 'Driver with vehicle management access',
        },
        {
          id: 4,
          name: 'OWNER',
          description: 'Car owner with vehicle ownership access',
        }
      ];

      const roleData = mockRoles.map(role => ({
        key: role.id.toString(),
        name: (
          <div>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
              {role.name}
            </Tag>
          </div>
        ),
        description: role.description,
      }));

      setRoles(roleData);
      message.error('Failed to fetch roles from server, showing mock data');
    } finally {
      setRoleLoading(false);
    }
  };
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'roles') {
      fetchRoles();
    }
  };

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: 'users',
                  label: 'Users Management',
                  children: (
                    <Card
                      bordered={false}
                      className="criclebox tablespace mb-24"
                      title="Users Table"
                      extra={
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setCreateModalVisible(true)}
                          >
                            Create User
                          </Button>
                        </div>
                      }
                    >
                      <div className="table-responsive">
                        <Spin spinning={loading}>
                          <Table
                            columns={columns}
                            dataSource={users}
                            pagination={{
                              ...pagination,
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} users`,
                            }}
                            onChange={handleTableChange}
                            className="ant-border-space"
                          />
                        </Spin>
                      </div>
                    </Card>
                  )
                },
                {
                  key: 'roles',
                  label: 'Roles',
                  children: (
                    <Card
                      bordered={false}
                      className="criclebox tablespace mb-24"
                      title="Roles Table"
                    >
                      <div className="table-responsive">
                        <Spin spinning={roleLoading}>
                          <Table
                            columns={roleColumns}
                            dataSource={roles}
                            pagination={false}
                            className="ant-border-space"
                          />
                        </Spin>
                      </div>
                    </Card>
                  )
                }
              ]} />
          </Col>
        </Row>      </div>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={900}
      >
        <Form
          form={createForm}
          layout="vertical" onFinish={async (values) => {
            setCreateLoading(true);
            try {
              // Prepare data for API
              const newUser = {
                lastName: values.lastName,
                firstName: values.firstName,
                email: values.email,
                phone: values.phone || '',
                password: values.password,
                address: {
                  address: values.address?.address || '',
                  street: values.address?.street || '',
                  ward: values.address?.ward || '',
                  district: values.address?.district || '',
                  city: values.address?.city || '',
                  latitude: values.address?.latitude || 0.1,
                  longitude: values.address?.longitude || 0.1,
                },
                profilePicture: values.profilePicture || '',
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
                roles: values.roles || ['user']
              }; const result = await userService.createUser(newUser);

              if (result.status === 201 || result.status === 200) {
                message.success('User created successfully!');
                setCreateModalVisible(false);
                createForm.resetFields();
                // Refresh the users list
                fetchUsers(pagination.current - 1, pagination.pageSize);
              } else {
                message.error('Failed to create user');
              }
            } catch (error) {
              console.error('Error creating user:', error);
              message.error(error.message || 'Failed to create user');
            } finally {
              setCreateLoading(false);
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please input first name!' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please input last name!' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input password!' }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please confirm password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Profile Picture URL"
                name="profilePicture"
              >
                <Input placeholder="Enter profile picture URL" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date of birth"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="User Roles"
            name="roles"
            initialValue={['user']}
            rules={[{ required: true, message: 'Please select at least one role!' }]}
          >            <Select
              mode="multiple"
              placeholder="Select user roles"
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'driver', label: 'Driver' },
                { value: 'owner', label: 'Car Owner' },
              ]}
            />
          </Form.Item>

          <Divider orientation="left">Address Information</Divider>

          <Form.Item
            label="Full Address"
            name={['address', 'address']}
          >
            <Input.TextArea
              rows={2}
              placeholder="Enter full address"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Street"
                name={['address', 'street']}
              >
                <Input placeholder="Enter street" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ward"
                name={['address', 'ward']}
              >
                <Input placeholder="Enter ward" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="District"
                name={['address', 'district']}
              >
                <Input placeholder="Enter district" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="City"
                name={['address', 'city']}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Latitude"
                name={['address', 'latitude']}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter latitude"
                  step={0.000001}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Longitude"
                name={['address', 'longitude']}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter longitude"
                  step={0.000001}
                />
              </Form.Item>
            </Col>
          </Row>



          <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
            <Button
              onClick={() => setCreateModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
            >
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={`Change Password for ${selectedUser?.firstName} ${selectedUser?.lastName}`}
        open={changePasswordModalVisible}
        onCancel={handleCloseChangePasswordModal}
        footer={null}
        width={400}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleSubmitChangePassword}
          disabled={changePasswordLoading}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: 'Please input new password!' }]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Confirm New Password"
                name="confirmNewPassword"
                rules={[
                  { required: true, message: 'Please confirm new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
            <Button
              onClick={handleCloseChangePasswordModal}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={changePasswordLoading}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserPage;
