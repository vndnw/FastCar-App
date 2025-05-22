import React from 'react';
import { Typography } from 'antd';
import SearchBar from '../SearchBar/SearchBar';
import './HeroSection.css';

const { Title } = Typography;

const HeroSection = () => {
    return (
        <div className="hero-section">
            <div className="hero-overlay">
                <div className="hero-content">
                    <div className="hero-text">
                        <Title level={1} className="hero-title">
                            Thuê xe tự lái
                        </Title>
                        <Title level={1} className="hero-subtitle">
                            hành trình tự tại
                        </Title>
                    </div>
                </div>
            </div>

            {/* SearchBar overlay trên Hero */}
            <SearchBar />
        </div>
    );
};

export default HeroSection;