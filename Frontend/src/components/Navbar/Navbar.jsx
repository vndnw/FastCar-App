import React, { useState } from 'react';
import './Navbar.css';
import { Layout, Select, Button, Avatar, Dropdown, message } from 'antd';
import {
  UserOutlined,
  DownOutlined,
  CarOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header } = Layout;
const { Option } = Select;

const locationList = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương'];

const Navbar = () => {
  const [location, setLocation] = useState('Hồ Chí Minh');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // Menu items cho user đã đăng nhập
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'my-trips',
      label: 'Chuyến của tôi',
      icon: <CarOutlined />,
      onClick: () => navigate('/my-trips'),
    },
    ...(isAdmin() ? [{
      key: 'admin',
      label: 'Quản trị viên',
      icon: <SettingOutlined />,
      onClick: () => navigate('/admin/dashboard'),
    }] : []),
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
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Header className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-left">
          <div
            className="navbar-logo"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <CarOutlined />
            CarRental
          </div>
        </div>

        {/* Right section */}
        <div className="navbar-right">
          {/* Link about */}
          <Link to="/about" className="navbar-link">
            Về chúng tôi
          </Link>

          <Link to="/owner-car" className="navbar-link">
            Trở thành chủ xe
          </Link>

          {/* Chỉ hiển thị link "Chuyến của tôi" khi đã đăng nhập */}
          {isAuthenticated && (
            <Link to="/my-trips" className="navbar-link">
              Chuyến của tôi
            </Link>
          )}

          {/* Hiển thị nút đăng nhập khi chưa đăng nhập */}
          {!isAuthenticated ? (
            <div className="navbar-auth">
              <Button type="default" onClick={() => navigate('/register')} style={{ marginRight: '8px' }}>
                Đăng ký
              </Button>
              <Button type="primary" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button>
            </div>
          ) : (
            /* Hiển thị avatar và dropdown khi đã đăng nhập */
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div className="navbar-avatar" style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} size="medium" />
                <span className="navbar-avatar-name">
                  {user?.fullName || user?.email || 'User'}
                </span>
                <DownOutlined />
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
