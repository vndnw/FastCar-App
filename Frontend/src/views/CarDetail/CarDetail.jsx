// CarDetail.jsx – Component chính tổng hợp
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './CarDetail.css';
import carService from '../../services/carService';

import CarGallery from './CarGallery';
import CarInfo from './CarInfo';
import BookingForm from './BookingForm';
import CarDescription from './CarDescription';
import CarFeatures from './CarFeatures';
import CarTerms from './CarTerms';

const CarDetail = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);

    const getCarId = async (id) => {
        try {
            const response = await carService.getCarById(id);
            setCar(response.data);
            console.log('Car data fetched:', response.data);
        } catch (error) {
            console.error('Error fetching car by ID:', error);
        }
    };

    useEffect(() => {
        if (carId) getCarId(carId);
    }, [carId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!car) {
        return (
            <div className="car-detail-loading">
                <p>Đang tải thông tin xe...</p>
            </div>
        );
    }

    return (
        <div className="car-detail-page">
            <div className="car-detail-header">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleGoBack}
                    className="back-button"
                >
                    Quay lại
                </Button>
            </div>

            <div className="car-detail-content">
                <Row gutter={[32, 32]}>
                    <Col xs={24} lg={14}>
                        <CarGallery car={car} />
                        <CarDescription car={car} />
                        <CarFeatures car={car} />
                        <CarTerms car={car} />
                    </Col>

                    <Col xs={24} lg={10}>
                        <CarInfo car={car} />
                        <BookingForm car={car} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CarDetail;
