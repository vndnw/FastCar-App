import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Card, Descriptions, message } from 'antd';
import dayjs from 'dayjs';
import './Booking.css'; // Import file CSS

// --- HELPER FUNCTION ---
// Hàm helper để format lại ngày giờ cho dễ đọc
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    // Ví dụ output: "15:30, 24/06/2025"
    return dayjs(isoString).format('HH:mm, DD/MM/YYYY');
};


// --- SUB-COMPONENT 1: CarSummary ---
const CarSummary = ({ car }) => {
    return (
        <Card title="Thông tin xe" bordered={false} className="booking-card">
            <div className="booking-car-image-wrapper">
                <img
                    src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder-image.png'}
                    alt={car.name}
                    className="booking-car-image"
                />
            </div>
            <Descriptions column={1} layout="horizontal" bordered>
                <Descriptions.Item label="Tên xe">{`${car.name} (${car.year})`}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{car.location.address}</Descriptions.Item>
                <Descriptions.Item label="Giá thuê">
                    <strong>{car.pricePerHour.toLocaleString('vi-VN')}K / giờ</strong>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};


// --- SUB-COMPONENT 2: BookingSummary ---
const BookingSummary = ({ bookingDetails, carLocation }) => {
    return (
        <Card title="Chi tiết đặt xe" bordered={false} className="booking-card">
            <Descriptions column={1} layout="vertical" bordered>
                <Descriptions.Item label="Thời gian nhận xe">
                    {formatDateTime(bookingDetails.startTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian trả xe">
                    {formatDateTime(bookingDetails.endTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng thời gian thuê">
                    {bookingDetails.rentalDuration} giờ
                </Descriptions.Item>
                <Descriptions.Item label="Địa điểm nhận xe">
                    {carLocation}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền thanh toán">
                    <span className="total-price">
                        {bookingDetails.totalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};


// --- MAIN COMPONENT: Booking ---
const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { carId } = useParams();

    // Lấy thông tin từ trang trước, có fallback để tránh lỗi
    const { car, bookingDetails } = location.state || {};

    // Xử lý khi không có dữ liệu
    if (!car || !bookingDetails) {
        return (
            <div className="booking-status-container">
                <p>Không có thông tin đặt xe. Vui lòng quay lại trang chi tiết.</p>
                <Button type="primary" onClick={() => navigate(carId ? `/car-detail/${carId}` : '/')}>
                    Quay lại
                </Button>
            </div>
        );
    }

    const handleConfirmBooking = () => {
        message.success('Chuyển đến trang thanh toán...');
        console.log('Xác nhận thanh toán với dữ liệu:', { car, bookingDetails });
        // Điều hướng đến trang thanh toán
        navigate('/payment', { state: { car, bookingDetails } });
    };

    return (
        <div className="booking-page">
            <h1 className="booking-title">Xác nhận thông tin đặt xe</h1>
            <Row gutter={[32, 32]}>
                {/* Cột thông tin xe */}
                <Col xs={24} md={12}>
                    <CarSummary car={car} />
                </Col>

                {/* Cột thông tin đặt xe */}
                <Col xs={24} md={12}>
                    <BookingSummary bookingDetails={bookingDetails} carLocation={car.location.address} />
                </Col>
            </Row>

            <div className="booking-actions">
                <Button size="large" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <Button size="large" type="primary" onClick={handleConfirmBooking}>
                    Xác nhận và Thanh toán
                </Button>
            </div>
        </div>
    );
};

export default Booking;