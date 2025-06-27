import React from 'react';
import { Row, Col, Card } from 'antd';
import { 
  SafetyCertificateOutlined, 
  ClockCircleOutlined, 
  CarOutlined, 
  CustomerServiceOutlined,
  StarOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import './FeatureSection.css';

const FeatureSection = () => {
  const features = [
    {
      icon: <SafetyCertificateOutlined />,
      title: 'An toàn & Bảo hiểm',
      description: 'Tất cả xe đều có bảo hiểm đầy đủ và được kiểm tra kỹ thuật định kỳ',
      color: '#52c41a'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'Thuê xe 24/7',
      description: 'Dịch vụ hoạt động 24/7, thuê xe bất cứ lúc nào bạn muốn',
      color: '#1890ff'
    },
    {
      icon: <CarOutlined />,
      title: 'Đa dạng xe',
      description: 'Hàng nghìn xe từ phổ thông đến cao cấp, đáp ứng mọi nhu cầu',
      color: '#fa8c16'
    },
    {
      icon: <CustomerServiceOutlined />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng chuyên nghiệp, hỗ trợ mọi lúc',
      color: '#eb2f96'
    },
    {
      icon: <StarOutlined />,
      title: 'Đánh giá cao',
      description: 'Hơn 50,000 khách hàng tin tưởng với đánh giá trung bình 4.9/5 sao',
      color: '#722ed1'
    },
    {
      icon: <ThunderboltOutlined />,
      title: 'Đặt xe nhanh',
      description: 'Chỉ 30 giây để đặt xe, nhận xe trong 15 phút',
      color: '#f5222d'
    }
  ];

  return (
    <div className="feature-section">
      <div className="container">
        <div className="section-header">
          <h2>Tại sao chọn chúng tôi?</h2>
          <p>6 lý do khiến khách hàng tin tưởng và lựa chọn dịch vụ của chúng tôi</p>
        </div>
        
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card 
                className="feature-card"
                hoverable
                bordered={false}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default FeatureSection;
