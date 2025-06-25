import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Badge } from 'antd';
import { ArrowLeftOutlined, UserOutlined, SettingOutlined, CarOutlined } from '@ant-design/icons';
// import { sampleCars, luxuryCars } from '../../data/sampleCars';
import './CarDetail.css';
import carService from '../../services/carService';


const CarDetail = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);

    const getCarId = async (id) => {
        try {
            const response = await carService.getCarById(id);
            setCar(response.data);
            console.log('Car data fetched:', (await response).data);
            return response.data;
        } catch (error) {
            console.error('Error fetching car by ID:', error);
            return null;
        }
    };

    useEffect(() => {
        if (carId) {
            getCarId(carId);
        }
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

// Gallery ảnh xe
const CarGallery = ({ car }) => {
    const [activeImage, setActiveImage] = useState(0);

    const images = car.images;


    return (
        <div className="car-gallery">
            <div className="main-image">
                <img
                    src={images[activeImage]}
                    alt={car.name}
                    className="main-car-image"
                />
                <div className="view-all-badge">
                    <Button type="primary" className="view-all-btn">
                        XEM TẤT CẢ
                    </Button>
                </div>
            </div>

            <div className="thumbnail-gallery">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                        onClick={() => setActiveImage(index)}
                    >
                        <img src={image} alt={`${car.name} ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Thông tin xe
const CarInfo = ({ car }) => {
    return (
        <div className="car-info">
            <div className="car-header">
                <h1 className="car-title">{car.name} {car.year}</h1>
                {/* <div className="car-badges">
                    {car.available247 && (
                        <Badge count="24/7" style={{ backgroundColor: '#52c41a' }} />
                    )}
                    {car.discount && (
                        <Badge count={`-${car.discount}%`} style={{ backgroundColor: '#ff4d4f' }} />
                    )}
                </div> */}
            </div>

            <p className="car-location">📍 {car.location.district}</p>

            <div className="car-pricing">
                <div className="current-price">
                    <span className="price-value">
                        {(car.pricePerHour).toLocaleString('vi-VN')}K
                    </span>
                    <span className="price-unit">/giờ</span>
                </div>
                {car.originalPrice && (
                    <div className="original-price">
                        <span className="original-value">
                            {(car.pricePerHour).toLocaleString('vi-VN')}K
                        </span>
                        <span className="discount-amount">
                            Tiết kiệm {((car.pricePerHour)).toLocaleString('vi-VN')}K
                        </span>
                    </div>
                )}
            </div>

            <div className="car-features">
                <h3>Đặc điểm</h3>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div className="feature-item">
                            <UserOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Số ghế</div>
                                <div className="feature-value">{car.seats} chỗ</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="feature-item">
                            <SettingOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Truyền động</div>
                                <div className="feature-value">{car.transmission}</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="feature-item">
                            <CarOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Nhiên liệu</div>
                                <div className="feature-value">{car.fuelType}</div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="feature-item">
                            <CarOutlined className="feature-icon" />
                            <div>
                                <div className="feature-label">Tiêu hao</div>
                                <div className="feature-value">{car.fuelConsumption}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

// Form đặt xe
const BookingForm = ({ car }) => {

    const navigate = useNavigate();

    const handleBooking = () => {
        const bookingDetails = {
            startTime: '00h00, 28/05/2025',
            endTime: '04h00, 30/05/2025',
            totalPrice: car.pricePerHour * 4,
        };

        navigate(`/booking/${car.id}`, { state: { car, bookingDetails } });
    };

    return (
        <div className="booking-form">
            <h3>Thời gian thuê</h3>

            <div className="time-selection">
                <div className="time-input">
                    <label>Nhận xe</label>
                    <div className="datetime-input">
                        <span>📅 00h00, 28/05/2025 đến 04h00, 30/05/2025</span>
                    </div>
                    <p className="time-note">
                        Xe không nhận trong khoảng giờ 23h-5h, vui lòng chọn khung giờ khác.
                    </p>
                </div>
            </div>

            <div className="pickup-location">
                <h4>🟢 Nhận xe tại vị trí xe</h4>
                <div className="location-info">
                    <p>{car.location.address}</p>
                    <p className="location-note">
                        Địa điểm cụ thể sẽ được hiển thị sau khi thanh toán thành công, và thời gian lấy xe 24/24.
                    </p>
                </div>
            </div>

            <div className="price-summary">
                <div className="price-row">
                    <span>Đơn giá gốc:</span>
                    <span>{car.pricePerHour || car.pricePerHour}K/giờ</span>
                </div>
                {car.discount && (
                    <div className="price-row discount">
                        <span>Khuyến mãi giảm giá:</span>
                        <span>-{(car.pricePerHour - car.pricePerHour)}K</span>
                    </div>
                )}
                <div className="price-row total">
                    <span>Thành tiền:</span>
                    <span>{car.pricePerHour}K/giờ</span>
                </div>
            </div>

            <Button
                type="primary"
                size="large"
                className="rent-button"
                block
                onClick={handleBooking}
            >
                THUÊ XE
            </Button>
        </div>
    );
};

// Mô tả xe
const CarDescription = ({ car }) => {
    return (
        <div className="car-description">
            <h3>Mô tả</h3>
            <p>
                {car.description}
            </p>
        </div>
    );
};

// Tiện nghi xe
const CarFeatures = ({ car }) => {
    const features = [
        { icon: '📻', label: 'Bản đồ' },
        { icon: '🔵', label: 'Bluetooth' },
        { icon: '📷', label: 'Camera 360' },
        { icon: '📹', label: 'Camera cập lề' },
        { icon: '📹', label: 'Camera hành trình' },
        { icon: '📷', label: 'Camera Lùi' },
        { icon: '🚨', label: 'Cảm biến lốp' },
        { icon: '🚗', label: 'Cảm biến va chạm' },
        { icon: '⚡', label: 'Cảnh báo tốc độ' },
        { icon: '📀', label: 'Màn hình DVD' },
        { icon: '🗺️', label: 'Định vị GPS' },
        { icon: '🔌', label: 'Khe cắm USB' },
        { icon: '☂️', label: 'Lốp dự phòng' },
        { icon: '💳', label: 'ETC' },
        { icon: '🔐', label: 'Túi khí an toàn' }
    ];

    return (
        <div className="car-features-extended">
            <h3>Các tiện nghi khác</h3>
            <Row gutter={[16, 16]}>
                {features.map((feature, index) => (
                    <Col xs={12} sm={8} md={6} key={index}>
                        <div className="feature-item-extended">
                            <span className="feature-emoji">{feature.icon}</span>
                            <span className="feature-text">{feature.label}</span>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

// Điều khoản
const CarTerms = ({ car }) => {
    return (
        <div className="car-terms">
            <h3>Điều khoản</h3>
            <div className="terms-content">
                <p><strong>Quy định khác:</strong></p>
                <ul>
                    <li>Sử dụng xe đúng mục đích.</li>
                    <li>Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</li>
                    <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                    <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</li>
                    <li>Không chở hàng quốc cấm dễ cháy nổ.</li>
                    <li>Không chở hoa quả, thực phẩm nặng mùi trong xe.</li>
                    <li>Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc đóng phí vệ sinh xe.</li>
                    <li>Xe được giới hạn di chuyển tối đa 400km cho 24h, và tần suất là 250km, 300km, 350 km cho 6h, 8h, 12h.</li>
                </ul>
                <p>Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời!</p>
            </div>
        </div>
    );
};

export default CarDetail;