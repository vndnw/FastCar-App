import React from 'react';
import { Button, Result, Space, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CarOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToCars = () => {
        navigate('/car-listing');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px' }}>
            <Card style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
                <Result
                    status="404"
                    title="404"
                    subTitle="Oops! Trang bạn đang tìm kiếm không tồn tại."
                    extra={
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<HomeOutlined />}
                                    onClick={handleGoHome}
                                >
                                    Về Trang Chủ
                                </Button>
                                <Button
                                    size="large"
                                    icon={<CarOutlined />}
                                    onClick={handleGoToCars}
                                >
                                    Xem Xe Cho Thuê
                                </Button>
                                <Button
                                    size="large"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleGoBack}
                                >
                                    Quay Lại
                                </Button>
                            </Space>

                            <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                                <Title level={5}>Có thể bạn đang tìm:</Title>
                                <Space wrap>
                                    <Button
                                        type="link"
                                        onClick={() => navigate('/car-listing')}
                                    >
                                        Danh sách xe cho thuê
                                    </Button>
                                    <Button
                                        type="link"
                                        onClick={() => navigate('/about')}
                                    >
                                        Về chúng tôi
                                    </Button>
                                    <Button
                                        type="link"
                                        onClick={() => navigate('/user-profile')}
                                    >
                                        Trang cá nhân
                                    </Button>
                                </Space>
                            </Card>
                        </Space>
                    }
                />
            </Card>
        </div>
    );
};

export default NotFound;
