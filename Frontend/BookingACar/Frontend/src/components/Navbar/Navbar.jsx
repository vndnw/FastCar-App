import React, { useState } from 'react';
import './Navbar.css';
import { Layout, Select, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, DownOutlined, CarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Option } = Select;

const locationList = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương'];

const userMenuItems = [
  { key: '1', label: 'Trang cá nhân' },
  { key: '2', label: 'Đơn thuê của tôi' },
  { key: '3', label: 'Đăng xuất' },
];
const Navbar = () => {
  const [location, setLocation] = useState('Hồ Chí Minh');
  const navigate = useNavigate();

  const handleLocationChange = (value) => {
    setLocation(value);
  
    const locationSlug = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    navigate(`/${locationSlug}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };
  
  return (
    <Header className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <CarOutlined />
            CarRental
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/about" className="navbar-link">Về chúng tôi</Link>

          <div className="navbar-location">
            <EnvironmentOutlined className="navbar-location-icon" />
            <Select
              value={location}
              onChange={handleLocationChange}
              className="navbar-select"
              variant={false}
            >
              {locationList.map((loc) => (
                <Option key={loc} value={loc}>{loc}</Option>
              ))}
            </Select>
          </div>

          <Button type="primary">Đăng nhập</Button>

          <Dropdown menu={{ items: userMenuItems }}>
            <div className="navbar-avatar" style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} size="medium" />
              <span className="navbar-avatar-name">Nguyễn Văn A</span>
              <DownOutlined />
            </div>
        </Dropdown>

        </div>
      </div>
    </Header>
  );
};

export default Navbar;