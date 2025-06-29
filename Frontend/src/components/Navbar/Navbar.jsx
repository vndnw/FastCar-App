import React, { useState } from 'react';
import './Navbar.css';
import { Layout, Button, Avatar, Dropdown, message } from 'antd';
import {
  UserOutlined,
  DownOutlined,
  CarOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Register from '../Login/Register';
import Login from '../Login/Login';

const { Header } = Layout;

const Navbar = () => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // Logic xử lý menu và logout không thay đổi
  async function handleLogout() {
    try {
      await logout();
      message.success('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Đăng xuất thất bại!');
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/user-profile'),
    },
    {
      key: 'my-trips',
      label: 'Chuyến của tôi',
      icon: <CarOutlined />,
      onClick: () => navigate('/my-trips'),
    },
    ...(isAdmin() ? [
      {
        key: 'admin',
        label: 'Quản trị viên',
        icon: <SettingOutlined />,
        onClick: () => navigate('/admin/dashboard'),
      },
    ] : []),
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <Header className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <div
              className="navbar-logo"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
              <CarOutlined />
              FastCar
            </div>
          </div>

          <div className="navbar-right">
            <Link to="/about" className="navbar-link">
              Về chúng tôi
            </Link>
            <Link to="/owner-car" className="navbar-link">
              Trở thành chủ xe
            </Link>

            {!isAuthenticated ? (
              <div className="navbar-auth">
                <Button
                  type="default"
                  onClick={() => setIsRegisterModalVisible(true)}
                  style={{ marginRight: '8px' }}
                >
                  Đăng ký
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsLoginModalVisible(true)}
                >
                  Đăng nhập
                </Button>
              </div>
            ) : (
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <div className="navbar-avatar" style={{ cursor: 'pointer' }}>
                  {/* === THAY ĐỔI DUY NHẤT TẠI ĐÂY === */}
                  <Avatar
                    src={user?.profilePicture}
                    icon={<UserOutlined />}
                    size="medium"
                  />
                  {/* =================================== */}
                  <span className="navbar-avatar-name">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.fullName || user?.email || 'User'}
                  </span>
                  <DownOutlined />
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </Header>

      {isRegisterModalVisible && (
        <Register onClose={() => setIsRegisterModalVisible(false)} />
      )}

      {isLoginModalVisible && (
        <Login onClose={() => setIsLoginModalVisible(false)} />
      )}
    </>
  );
};

export default Navbar;