import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Card, Descriptions, message, Spin } from 'antd';
import dayjs from 'dayjs';

// 1. Import hook từ BookingContext
import { useBooking } from '../../contexts/BookingContext';

import './Booking.css';

// --- HELPER FUNCTION: Định dạng ngày giờ ---
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return dayjs(isoString).format('HH:mm, DD/MM/YYYY');
};

// --- SUB-COMPONENT 1: Tóm tắt thông tin xe ---
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

// --- SUB-COMPONENT 2: Chi tiết đặt xe ---
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

// --- MAIN COMPONENT: Trang xác nhận đặt xe ---
const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { carId } = useParams();
    const { bookCar, loading } = useBooking();
    const { car, bookingDetails } = location.state || {};

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

    const handleConfirmBooking = async () => {
        const pickupLocationPayload = {
            address: car.location.address || "Không xác định",
            street: car.location.street || "",
            ward: car.location.ward || "",
            district: car.location.district || "",
            city: car.location.city || "",
            latitude: car.location.latitude || 0.0,
            longitude: car.location.longitude || 0.0,
        };

        const payload = {
            carId: parseInt(carId, 10),
            type: "VEHICLE",
            pickupLocation: pickupLocationPayload,
            pickupTime: bookingDetails.startTime,
            returnTime: bookingDetails.endTime,
            discountCode: "",
            description: "Khách hàng xác nhận đặt xe."
        };

        const result = await bookCar(payload);

        // --- FIX: Xử lý khi nhận được paymentUrl ---
        if (result.success && result.data && result.data.paymentUrl) {
            // Hiển thị thông báo cho người dùng
            message.success('Tạo đơn thành công! Đang chuyển bạn đến cổng thanh toán...');

            // Chờ một chút để người dùng đọc thông báo, sau đó chuyển hướng
            setTimeout(() => {
                // Sử dụng window.location.href để chuyển hướng đến một trang bên ngoài
                window.location.href = result.data.paymentUrl;
            }, 1500); // Chờ 1.5 giây

        } else {
            // Xử lý các trường hợp lỗi khác
            message.error(result.error || 'Không thể tạo đơn đặt xe. Vui lòng thử lại!');
        }
    };

    return (
        <Spin spinning={loading} tip="Đang xử lý...">
            <div className="booking-page">
                <h1 className="booking-title">Xác nhận thông tin đặt xe</h1>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <CarSummary car={car} />
                    </Col>
                    <Col xs={24} md={12}>
                        <BookingSummary bookingDetails={bookingDetails} carLocation={car.location.address} />
                    </Col>
                </Row>
                <div className="booking-actions">
                    <Button size="large" onClick={() => navigate(-1)} disabled={loading}>
                        Quay lại
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        onClick={handleConfirmBooking}
                        loading={loading}
                    >
                        Xác nhận và Thanh toán
                    </Button>
                </div>
            </div>
        </Spin>
    );
};

export default Booking;
