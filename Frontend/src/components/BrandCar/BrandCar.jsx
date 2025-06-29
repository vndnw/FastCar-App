// src/components/BrandCar/BrandCar.jsx

import React, { useRef } from 'react';
import { Card, Typography, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './BrandCar.css';

const { Title } = Typography;

// Dữ liệu giả lập về các hãng xe (bạn có thể thay thế bằng dữ liệu từ API)
const MOCK_BRANDS = [
    { id: 1, name: 'PEUGEOT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Peugeot_Logo.svg/100px-Peugeot_Logo.svg.png' },
    { id: 2, name: 'MERCEDES', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo.svg/120px-Mercedes-Benz_Logo.svg.png' },
    { id: 3, name: 'AUDI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/120px-Audi-Logo_2016.svg.png' },
    { id: 4, name: 'ZOTYE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Zotye_logo.svg/100px-Zotye_logo.svg.png' },
    { id: 5, name: 'ISUZU', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Isuzu_logo.svg/100px-Isuzu_logo.svg.png' },
    { id: 6, name: 'BYD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/BYD_Auto_logo.svg/120px-BYD_Auto_logo.svg.png' },
    { id: 7, name: 'SUBARU', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Subaru_logo.svg/100px-Subaru_logo.svg.png' },
    { id: 8, name: 'TOYOTA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Toyota_EU.svg/100px-Toyota_EU.svg.png' },
    { id: 9, name: 'HONDA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/100px-Honda.svg.png' },
    { id: 10, name: 'FORD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/120px-Ford_Motor_Company_Logo.svg.png' },
    { id: 11, name: 'KIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/KIA_logo2.svg/100px-KIA_logo2.svg.png' },
    { id: 12, name: 'VINFAST', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/VinFast_logo.svg/120px-VinFast_logo.svg.png' }
];

const BrandCar = () => {
    const scrollContainerRef = useRef(null);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Khoảng cách cuộn mỗi lần nhấn nút
            if (direction === 'left') {
                scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="brand-car-container">
            <Title level={3} className="brand-car-title">Chọn xe theo hãng</Title>
            <div className="brand-scroll-wrapper">
                <Button
                    className="scroll-arrow left"
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={() => handleScroll('left')}
                />
                <div className="brand-list-container" ref={scrollContainerRef}>
                    {MOCK_BRANDS.map(brand => (
                        <div key={brand.id} className="brand-item-wrapper">
                            <Card
                                hoverable
                                className="brand-card"
                            >
                                <img src={brand.logo} alt={brand.name} className="brand-logo" />
                                <div className="brand-name">{brand.name}</div>
                            </Card>
                        </div>
                    ))}
                </div>
                <Button
                    className="scroll-arrow right"
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={() => handleScroll('right')}
                />
            </div>
        </div>
    );
};

export default BrandCar;