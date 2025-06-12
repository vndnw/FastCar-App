
import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import SearchBar from '../SearchBar/SearchBar';
import './HeroSection.css';

const { Title } = Typography;

const HeroSection = () => {
    // Danh sách ảnh và slogan
    const slideData = [

        {
            image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&h=600&fit=crop',
            slogan: { line1: 'Thuê xe tự lái', line2: 'vi vu thoải mái' },
            position: 'left'
        },
        {
            image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1200&h=600&fit=crop',
            slogan: { line1: 'Thuê xe tự lái', line2: 'tự do dã ngoại' },
            position: 'right'
        },
        {
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=600&fit=crop',
            slogan: { line1: 'Thuê xe tự lái', line2: 'ấn tượng khó phai' },
            position: 'left'
        },
        {
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop',
            slogan: { line1: 'Thuê xe tự lái', line2: 'nhà thêm gần lại' },
            position: 'right'
        }
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto chuyển ảnh sau 10 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === slideData.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000);

        return () => clearInterval(interval);
    }, [slideData.length]);

    // Xử lý khi người dùng click vào dot
    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Xử lý vuốt/kéo
    const handleTouchStart = (e) => {
        const touchStartX = e.touches[0].clientX;
        e.currentTarget.touchStartX = touchStartX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchStartX = e.currentTarget.touchStartX;
        const diff = touchStartX - touchEndX;

        if (diff > 50) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === slideData.length - 1 ? 0 : prevIndex + 1
            );
        } else if (diff < -50) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? slideData.length - 1 : prevIndex - 1
            );
        }
    };

    const currentSlide = slideData[currentImageIndex];

    return (
        <div className="hero-section">
            {/* THÊM: Background slideshow */}
            <div
                className="hero-slideshow"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {slideData.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                ))}
            </div>

            {/* THÊM: Dots indicator */}
            <div className="hero-dots">
                {slideData.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Chuyển đến ảnh ${index + 1}`}
                    />
                ))}
            </div>


            {/* GIỮ NGUYÊN: Cấu trúc overlay gốc */}
            <div className="hero-overlay">
                <div className="hero-content">
                    <div className={`hero-text hero-text-${currentSlide.position}`}>
                        <Title level={1} className="hero-title">
                            {currentSlide.slogan.line1}
                        </Title>
                        <Title level={1} className="hero-subtitle">
                            {currentSlide.slogan.line2}
                        </Title>
                    </div>
                </div>
            </div>

            {/* GIỮ NGUYÊN: SearchBar overlay trên Hero */}
            <SearchBar />
        </div>
    );
};

export default HeroSection;