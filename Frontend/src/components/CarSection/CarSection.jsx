import React from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CarCard from '../CarCard';

const CarSection = ({
    title,
    cars,
    buttonText,
    onButtonClick,
    backgroundColor = '#f5f5f5'
}) => {
    const carouselRef = React.useRef();
    const navigate = useNavigate();

    // Mũi tên trái tùy chỉnh cho carousel
    const CustomPrevArrow = ({ onClick }) => (
        <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={onClick}
            style={{
                position: 'absolute',
                left: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #d9d9d9'
            }}
        />
    );

    // Mũi tên phải tùy chỉnh cho carousel
    const CustomNextArrow = ({ onClick }) => (
        <Button
            type="text"
            icon={<RightOutlined />}
            onClick={onClick}
            style={{
                position: 'absolute',
                right: -50,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #d9d9d9'
            }}
        />
    );

    // Xử lý sự kiện click button
    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            // Hành động mặc định - chuyển đến trang danh sách xe
            navigate('/xe-co-ngay');
        }
    };

    return (
        <div style={{
            padding: '40px 100px',
            backgroundColor: backgroundColor
        }}>
            {/* Tiêu đề section */}
            <h2 style={{
                textAlign: 'center',
                marginBottom: 40,
                fontSize: 24,
                fontWeight: 'bold',
                color: '#333'
            }}>
                {title}
            </h2>

            {/* Container carousel */}
            <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
                <Carousel
                    ref={carouselRef}
                    arrows
                    prevArrow={<CustomPrevArrow />}
                    nextArrow={<CustomNextArrow />}
                    dots={false}
                    infinite={true}
                    speed={500}
                    slidesToShow={4}
                    slidesToScroll={1}
                    responsive={[
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 900,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            }
                        }
                    ]}
                >
                    {/* Render từng xe trong carousel */}
                    {cars.map(car => (
                        <div key={car.id} style={{ padding: '0 8px' }}>
                            <CarCard car={car} />
                        </div>
                    ))}
                </Carousel>
            </div>

            {/* Nút xem thêm */}
            <div style={{
                textAlign: 'center',
                marginTop: 40
            }}>
                <Button
                    type="default"
                    size="large"
                    onClick={handleButtonClick}
                    style={{
                        borderColor: '#1890ff',
                        color: '#1890ff',
                        fontWeight: 'normal',
                        height: 40,
                        padding: '0 24px',
                        borderRadius: 6,
                        fontSize: '14px',
                        backgroundColor: 'white'
                    }}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default CarSection;