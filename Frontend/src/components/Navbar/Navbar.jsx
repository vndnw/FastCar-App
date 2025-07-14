import React, { useState } from 'react';
import './Navbar.css';
import { Layout, Button, Avatar, Dropdown, Drawer, message } from 'antd';
import {
  UserOutlined,
  DownOutlined,
  CarOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Register from '../Login/Register';
import Login from '../Login/Login';

const { Header } = Layout;

const Navbar = () => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Đăng xuất thất bại!');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/user-profile'),
    },
    ...(user?.roles?.includes('owner')
      ? [
        {
          key: 'owner-panel',
          label: 'Quản lý xe của tôi',
          icon: <SettingOutlined />,
          onClick: () => navigate('/owner/dashboard'),
        },
      ]
      : []),
    ...(isAdmin()
      ? [
        {
          key: 'admin',
          label: 'Quản trị viên',
          icon: <SettingOutlined />,
          onClick: () => navigate('/admin/dashboard'),
        },
      ]
      : []),
    { type: 'divider' },
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
            <div className="navbar-logo" onClick={handleLogoClick}>
              <CarOutlined />
              <span style={{ marginLeft: 8 }}>FastCar</span>
            </div>
          </div>

          {/* Menu desktop */}
          <div className="navbar-right desktop-only">
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
                  <Avatar
                    src={user?.profilePicture}
                    icon={<UserOutlined />}
                    size="medium"
                  />
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

          {/* Menu mobile */}
          <div className="mobile-only">
            <MenuOutlined
              className="mobile-menu-icon"
              onClick={() => setIsDrawerVisible(true)}
            />
          </div>
        </div>
      </Header>

      {/* Drawer mobile menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        bodyStyle={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Link to="/about" onClick={() => setIsDrawerVisible(false)} className="drawer-link">
          Về chúng tôi
        </Link>
        <Link to="/owner-car" onClick={() => setIsDrawerVisible(false)} className="drawer-link">
          Trở thành chủ xe
        </Link>

        {!isAuthenticated ? (
          <>
            <Button
              type="default"
              onClick={() => {
                setIsRegisterModalVisible(true);
                setIsDrawerVisible(false);
              }}
              style={{ width: '80%' }}
            >
              Đăng ký
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setIsLoginModalVisible(true);
                setIsDrawerVisible(false);
              }}
              style={{ width: '80%' }}
            >
              Đăng nhập
            </Button>
          </>
        ) : (
          <p style={{ marginTop: '20px' }}>Xin chào, {user?.email || 'User'}</p>
        )}
      </Drawer>

      {/* Modal Auth */}
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
