import React from 'react';
import { Row, Col } from 'antd';
import { FacebookFilled, YoutubeFilled, CarOutlined, TwitterOutlined, InstagramOutlined, LinkedinFilled, PhoneOutlined } from '@ant-design/icons';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <Row gutter={[16, 16]} justify="space-between">
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <div className="footer-column">
              <div className="navbar-logo" style={{ cursor: 'pointer' }}>
                <CarOutlined />
                FastCar
              </div>
              <div className="footer-no-link">CÔNG TY TNHH ABCDE VIỆT NAM</div>
              <div className="footer-no-link">Mã số thuế: 123456789. Cấp ngày: 12/12/2024</div>
              <div href="#" className="footer-no-link"><b>Văn phòng Hồ Chí Minh</b></div>
              <a href="#" className="footer-link">123 Đường A, Quận 1, HCM</a>
              <div href="#" className="footer-no-link"><b>Văn phòng Hà Nội</b></div>
              <a href="#" className="footer-link">456 Đường B, Quận 3, HN</a>
              <div href="#" className="footer-no-link"><b>Văn phòng Đà Nẵng</b></div>
              <a href="#" className="footer-link">789 Đường C, TP. Đà Nẵng</a>
              <div href="#" className="footer-no-link"><b>Văn phòng Bình Dương</b></div>
              <a href="#" className="footer-link">779 Đường C, TP. Bình Dương</a>
              <a href="mailto:contact@example.com" className="footer-link">Email: contact@example.com</a>
            </div>
          </Col>

          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
            <div className="footer-column">
              <h4>Chính sách</h4>
              <a href="#" className="footer-link">Điều kiện giao dịch chung</a>
              <a href="#" className="footer-link">Chính sách bảo vệ dữ liệu cá nhân</a>
              <a href="#" className="footer-link">Điều khoản sử dụng nền tảng</a>
            </div>
          </Col>

          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
            <div className="footer-column">
              <h4>Địa điểm dịch vụ</h4>
              <a href="#" className="footer-link">Hồ Chí Minh</a>
              <a href="#" className="footer-link">Đà Nẵng</a>
              <a href="#" className="footer-link">Hà Nội</a>
              <a href="#" className="footer-link">Bình Dương</a>
              <div href="#" className="footer-no-link"><b>Mạng xã hội</b></div>
              <div className="footer-social-icons">
                <FacebookFilled style={{ color: '#4267B2', fontSize: '24px' }} />
                <YoutubeFilled style={{ color: '#FF0000', fontSize: '24px' }} />
                <TwitterOutlined style={{ color: '#1DA1F2', fontSize: '24px' }} />
                <InstagramOutlined style={{ color: '#C13584', fontSize: '24px' }} />
                <LinkedinFilled style={{ color: '#0077B5', fontSize: '24px' }} />
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
            <div className="footer-column">
              <h4>Ứng dụng</h4>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="app-badge"
                />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="app-badge"
                />
              </a>
            </div>
          </Col>

          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
            <div className="footer-column">
              <h4>Hỗ trợ</h4>
              <a href="#" className="footer-link">Quy định dịch vụ</a>
              <a href="tel:19005335" className="footer-link footer-phone">
                <PhoneOutlined className="footer-phone-icon" />
                1900 5335
              </a>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;