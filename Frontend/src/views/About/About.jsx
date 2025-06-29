import React from 'react';
import { Row, Col, Button, Card } from 'antd';
import { CarOutlined, EnvironmentOutlined, SmileOutlined } from '@ant-design/icons';
import './About.css';
import AboutImage1 from '../../assets/images/aboutus1.png';
import AboutImage2 from '../../assets/images/aboutus2.png';
import AboutImage3 from '../../assets/images/aboutus3.png';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-section">
        <Row gutter={[32, 32]} align="middle" justify="center">
          <Col xs={24} md={8}>
            <h1 className="about-title">FastCar - Cùng bạn đến mọi hành trình</h1>
          </Col>
          <Col xs={24} md={16}>
            <p className="about-description">
              Mỗi chuyến đi là một hành trình khám phá cuộc sống và thế giới xung quanh, là cơ hội học hỏi và chinh phục những điều mới lạ của mỗi cá nhân để trở nên tốt hơn. Do đó, chất lượng trải nghiệm của khách hàng là ưu tiên hàng đầu và là nguồn cảm hứng của đội ngũ FastCar.
            </p>
            <p className="about-description">
            FastCar là nền tảng chia sẻ ô tô, sứ mệnh của chúng tôi không chỉ dừng lại ở việc kết nối chủ xe và khách hàng một cách Nhanh chóng - An toàn - Tiện lợi, mà còn hướng đến việc truyền cảm hứng KHÁM PHÁ những điều mới lạ đến cộng đồng qua những chuyến đi trên nền tảng của chúng tôi.
            </p>
          </Col>
        </Row>
        <Row justify="center">
          <Col xs={24} md={24}>
            <div className="about-image">
              <img src={AboutImage1} alt="FastCar Journey" className="about-image-content" />
            </div>
          </Col>
        </Row>
      </div>

      <div className="about-section">
        <Row gutter={[32, 32]} align="middle" justify="center">
          <Col xs={24} md={13}>
            <h1 className="about-title">Drive. Explore. Inspire</h1>
            <p className="about-description"><b>Cầm lái</b> và <b>Khám phá</b> thế giới đầy <b>Cảm hứng</b>.</p>
            <p className="about-description">
            FastCar đặt mục tiêu trở thành cộng đồng người dùng ô tô Văn minh & Uy tín #1 tại Việt Nam, nhằm mang lại những giá trị thiết thực cho tất cả những thành viên hướng đến một cuộc sống tốt đẹp hơn.
            </p>
            <p className="about-description">
            Chúng tôi tin rằng mỗi hành trình đều quan trọng, vì vậy đội ngũ và các đối tác của FastCar với nhiều kinh nghiệm về lĩnh vực cho thuê xe, công nghệ, bảo hiểm & du lịch sẽ mang đến cho hành trình của bạn thêm nhiều trải nghiệm mới lạ, thú vị cùng sự an toàn ở mức cao nhất.
            </p>
          </Col>
          <Col xs={24} md={11}>
            <div className="about-image">
              <img src={AboutImage2} alt="FastCar Journey" className="about-image-content" />
            </div>
          </Col>
        </Row>
      </div>

      <div className="about-stats">
        <h2 className="stats-title">FastCar và những con số</h2>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card className="stats-card">
              <CarOutlined className="stats-icon" />
              <h3 className="stats-number">10,000+</h3>
              <p className="stats-label">Tổng chuyến đi</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="stats-card">
              <CarOutlined className="stats-icon" />
              <h3 className="stats-number">5,000+</h3>
              <p className="stats-label">Số lượng xe</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="stats-card">
              <EnvironmentOutlined className="stats-icon" />
              <h3 className="stats-number">50+</h3>
              <p className="stats-label">Thành phố</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="stats-card">
              <CarOutlined className="stats-icon" />
              <h3 className="stats-number">20+</h3>
              <p className="stats-label">Dòng xe</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="stats-card">
              <SmileOutlined className="stats-icon" />
              <h3 className="stats-number">100,000+</h3>
              <p className="stats-label">Điểm khác hành</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="stats-card">
              <SmileOutlined className="stats-icon" />
              <h3 className="stats-number">1,000+</h3>
              <p className="stats-label">Khách hàng hài lòng</p>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="about-cta">
        <h2>Bắt đầu ngay hôm nay</h2>
        <Row justify="center">
          <Col xs={24} md={24}>
            <div className="about-image with-content">
              <img src={AboutImage3} alt="FastCar Journey" className="about-image-content" />
              <div className='image-overlay'>
                <div className="content-overlay">
                <p className="content-text">
                  <strong>Xe đã sẵn sàng.<br />Bắt đầu hành trình ngay!</strong>
                  Tự tay cầm lái chiếc xe bạn yêu thích<br />
                  cho hành trình thêm hứng khởi.
                </p><br />

                  <Button
                    type="primary"
                    className="rent-button"
                    onClick={() => window.location.href = '/'}
                  >
                    Thuê xe tự lái
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

    </div>
  );
};

export default About;
