import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Divider, Spin, message, Input } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useBooking } from '../../contexts/BookingContext';
import './Booking.css';

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return dayjs(isoString).format('HH:mm, DD/MM/YYYY');
};

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { carId } = useParams();
    const { bookCar, loading } = useBooking();
    const { car, bookingDetails } = location.state || {};

    const [description, setDescription] = useState('');

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

    const {
        startTime,
        endTime,
        totalPrice,
        discount = 0,
        VAT = 0,
        giuCho = 0,
        cocXe = 0,
        coupon = '',
        couponPercent = 0,
    } = bookingDetails;

    console.log('Booking Details:', bookingDetails);

    const tongCong = totalPrice - discount + VAT;
    const tienThue = tongCong;
    const tienTheChap = cocXe;
    const tienGiuCho = giuCho;
    const tienThanhToanKhiNhanXe = tongCong + cocXe - giuCho;

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

        const pickupLocationPayload1 = {
            address: bookingDetails.deliveryAddress || "Không xác định",
            latitude: car.location.latitude || 0.0,
            longitude: car.location.longitude || 0.0,
        };

        const payload = {
            carId: parseInt(carId, 10),
            type: "VEHICLE",
            pickupLocation: bookingDetails.deliveryAddress === "" ? pickupLocationPayload : pickupLocationPayload1,
            pickupTime: bookingDetails.startTime,
            returnTime: bookingDetails.endTime,
            discountCode: coupon || "",
            description: description || "Khách hàng xác nhận đặt xe."
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
            <div className="booking-page" style={{ background: '#f7faf9', minHeight: '100vh', padding: 0 }}>
                {/* Header tiến trình */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '24px 0 0 24px', gap: 16 }}>
                    <Button type="link" onClick={() => navigate(-1)} style={{ fontSize: 18, padding: 0 }}>
                        &lt; Quay lại
                    </Button>

                </div>



                {/* Thông tin đơn hàng */}
                <Card variant={false} style={{ margin: '24px auto', maxWidth: 600, borderRadius: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Thông tin đơn hàng</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1890ff', marginBottom: 8 }}>
                        <CalendarOutlined />
                        <span style={{ fontWeight: 500 }}>Thời gian thuê</span>
                    </div>
                    <div style={{ marginLeft: 28, marginBottom: 8 }}>
                        <b>{formatDateTime(startTime)} đến {formatDateTime(endTime)}</b>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1890ff', marginBottom: 8 }}>
                        <EnvironmentOutlined />
                        <span style={{ fontWeight: 500 }}>Nhận xe tại vị trí của xe</span>
                    </div>
                    <div style={{ marginLeft: 28, marginBottom: 16 }}>
                        <b>{bookingDetails.deliveryAddress ? bookingDetails.deliveryAddress : car.location.address}</b>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>Phí thuê xe <span style={{ color: '#aaa' }}>ⓘ</span></span>
                        <span>{totalPrice?.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {coupon && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>
                                Giảm giá <br />
                                <span style={{ color: '#888', fontSize: 13 }}>{coupon} {couponPercent ? `- ${couponPercent}%` : ''}</span>
                            </span>
                            <span style={{ color: '#fa541c' }}>-{discount?.toLocaleString('vi-VN')}đ</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span>Thuế VAT</span>
                        <span>{VAT?.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 8 }}>
                        <span>Tổng cộng tiền thuê</span>
                        <span>{tongCong?.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Các bước thanh toán</div>
                    {/* Bước 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <StepCircle number={1} active />
                        <span style={{ fontWeight: 500, marginLeft: 8 }}>Thanh toán giữ chỗ qua VNPAY</span>
                        <span style={{ flex: 1 }} />
                        <span style={{ fontWeight: 700 }}>{tienGiuCho?.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div style={{ color: '#888', fontSize: 13, marginLeft: 36, marginBottom: 12 }}>
                        Tiền này để xác nhận đơn thuê và giữ xe, sẽ được trừ vào tiền thế chấp khi nhận xe
                    </div>
                    {/* Bước 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <StepCircle number={2} active />
                        <span style={{ fontWeight: 500, marginLeft: 8 }}>Thanh toán khi nhận xe</span>
                        <span style={{ flex: 1 }} />
                        <span style={{ fontWeight: 700 }}>{tienThanhToanKhiNhanXe?.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div style={{ marginLeft: 36 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tiền thuê</span>
                            <span>{tienThue?.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Tiền thế chấp</span>
                            <span>
                                {giuCho > 0 && (
                                    <span style={{ textDecoration: 'line-through', color: '#bbb', marginRight: 8 }}>
                                        {(tienTheChap)?.toLocaleString('vi-VN')}đ
                                    </span>
                                )}
                                {tienTheChap ? (tienTheChap - tienGiuCho).toLocaleString('vi-VN') : 0}đ
                            </span>
                        </div>
                        <div style={{ color: '#888', fontSize: 13 }}>
                            Sẽ hoàn lại khi trả xe
                        </div>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />

                    {/* Thêm ô nhập mô tả ở đây */}
                    <div style={{ marginBottom: 16 }}>
                        <Input.TextArea
                            rows={3}
                            placeholder="Ghi chú cho chủ xe (ví dụ: yêu cầu đặc biệt, thời gian liên hệ, v.v.)"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={300}
                        />
                    </div>

                    <div>
                        Lưu ý : khi bấm xác nhận thanh toán thì sẽ chuyển hướng đến cổng thanh toán của VNPAY để thanh toán tiền giữ chỗ. Sau khi thanh toán thành công, bạn sẽ nhận được thông tin chi tiết về đơn hàng qua email và SMS.
                    </div>
                </Card>
                <div className="booking-actions" style={{ maxWidth: 600, margin: '0 auto 24px', display: 'flex', gap: 16 }}>
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

// Component hiển thị số bước
function StepCircle({ number, active }) {
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: active ? '#13c2c2' : '#eee',
            color: active ? '#fff' : '#888',
            fontWeight: 700,
            fontSize: 16,
        }}>
            {number}
        </span>
    );
}

// Component hiển thị tiến trình
function Step({ active, label }) {
    return (
        <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: active ? '#13c2c2' : '#bbb',
            fontWeight: active ? 700 : 400,
            fontSize: 15,
        }}>
            {active && <CheckCircleFilled style={{ color: '#13c2c2', fontSize: 18 }} />}
            <span>{label}</span>
            <span style={{
                width: 36, height: 2, background: '#eee', margin: '0 8px', display: 'inline-block'
            }} />
        </span>
    );
}

export default Booking;
