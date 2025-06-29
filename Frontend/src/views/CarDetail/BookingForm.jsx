import React, { useState, useEffect } from 'react';
import { Button, Modal, DatePicker, Card, Divider, Input, List, Spin } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, CalendarOutlined, GiftOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import './BookingForm.css';
import { useNavigate } from 'react-router-dom';
import 'dayjs/locale/vi';
import discountService from '../../services/discountService';
import bookingService from '../../services/bookingService';

const { RangePicker } = DatePicker;
const now = dayjs().minute(0).second(0); // giờ hiện tại, phút = 0
const BookingForm = ({ car }) => {
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [discountList, setDiscountList] = useState([]);
    const [loadingDiscount, setLoadingDiscount] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startTime, setStartTime] = useState(now);
    const [endTime, setEndTime] = useState(now.add(1, 'hour'));
    const [tempStart, setTempStart] = useState(now);
    const [tempEnd, setTempEnd] = useState(now.add(1, 'hour'));
    const [durationHours, setDurationHours] = useState(0);
    const [timeError, setTimeError] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [coupon, setCoupon] = useState('');
    const [couponPercent, setCouponPercent] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Lưu mã đã áp dụng
    const [discount, setDiscount] = useState(0); // Số tiền giảm giá
    const [couponError, setCouponError] = useState('');
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);

    const fetchSchedules = async () => {
        try {
            const res = await bookingService.getSchedulesByCar(car.id);
            // console.log("Fetched schedules:", res.data);
            setSchedules(res.data || []);
        } catch (err) {
            console.error("Error fetching schedules:", err);
            setSchedules([]);
        }
    };

    const disablePastDates = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const disableStartHours = () => {
        return Array.from({ length: 24 }, (_, i) => i >= 23 ? i : null).filter(Boolean);
    };

    const disableEndHours = () => {
        return Array.from({ length: 24 }, (_, i) => i < 5 ? i : null).filter(Boolean);
    };

    const disabledDate = (current) => {
        // Disable ngày trong quá khứ
        if (current && current < dayjs().startOf('day')) return true;
        // Disable nếu ngày này nằm trong bất kỳ khoảng đã đặt nào
        return schedules.some(sch => {
            const start = dayjs(sch.pickupTime);
            const end = dayjs(sch.returnTime);
            return current.isBetween(start, end, 'day', '[]'); // '[]' để bao gồm cả ngày đầu và cuối
        });
    };

    const [rangeValue, setRangeValue] = useState([startTime, endTime]);

    // Khi mở modal, đồng bộ rangeValue với startTime, endTime
    const showModal = () => {
        setRangeValue([startTime, endTime]);
        setIsModalOpen(true);
    };
    const handleCancel = () => setIsModalOpen(false);

    // Trong RangePicker chỉ update rangeValue
    <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="DD/MM/YYYY HH:mm"
        value={rangeValue}
        onChange={val => {
            if (!val || !val[0] || !val[1]) return;
            setRangeValue(val);
            setTimeError('');
        }}
        style={{ width: '100%', borderRadius: 12, fontSize: 16 }}
        disabledDate={disabledDate}
        allowClear={false}
    />

    // Khi nhấn OK, kiểm tra và gán lại startTime, endTime
    const handleOk = () => {
        if (!rangeValue[0] || !rangeValue[1]) {
            setTimeError('Vui lòng chọn đầy đủ thời gian nhận và trả xe');
            return;
        }
        if (rangeValue[1].isBefore(rangeValue[0])) {
            setTimeError('⛔ Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }
        const startHour = rangeValue[0].hour();
        const endHour = rangeValue[1].hour();
        if (startHour >= 23) {
            setTimeError('📌 Giờ nhận xe không được sau 23h00');
            return;
        }
        if (endHour < 5) {
            setTimeError('📌 Giờ trả xe không được trước 05h00 sáng');
            return;
        }
        setStartTime(rangeValue[0]);
        setEndTime(rangeValue[1]);
        setIsModalOpen(false);
        setTimeError('');
    };

    // Lấy danh sách mã giảm giá khi mở modal
    const fetchDiscounts = async () => {
        setLoadingDiscount(true);
        try {
            const res = await discountService.getActiveDiscounts();
            console.log("Fetched discounts:", res.data);
            setDiscountList(res.data || []);
        } catch (err) {
            setDiscountList([]);
        }
        setLoadingDiscount(false);
    };


    // Khi mở modal mã giảm giá
    const openCouponModal = () => {
        setIsCouponModalOpen(true);
        fetchDiscounts();
    };

    // Áp dụng mã giảm giá (có thể gọi API kiểm tra mã)
    const handleApplyCoupon = async (code) => {
        const codeToApply = code || coupon;
        if (!codeToApply) {
            setCouponError('Vui lòng nhập mã khuyến mãi!');
            return;
        }
        try {
            const res = await discountService.getDiscountByCode(codeToApply.trim());
            const discountData = res.data;
            // Kiểm tra status === 'ACTIVE'
            if (discountData && discountData.status === 'ACTIVE') {
                setAppliedCoupon({
                    code: discountData.code,
                    desc: discountData.description || '',
                    percent: discountData.percent,
                });
                // Tính giảm giá
                let discountValue = 0;
                if (discountData.percent) {
                    discountValue = Math.round((totalPrice * discountData.percent) / 100);
                }
                setDiscount(discountValue);
                setCouponPercent(discountData.percent);
                setCoupon(codeToApply);
                setCouponError('');
                setIsCouponModalOpen(false);
            } else {
                setAppliedCoupon(null);
                setDiscount(0);
                setCouponError('Mã không hợp lệ hoặc đã hết hạn!');
            }
        } catch {
            setAppliedCoupon(null);
            setDiscount(0);
            setCouponError('Mã không hợp lệ hoặc đã hết hạn!');
        }
    };

    useEffect(() => {
        if (car && car.id) {
            fetchSchedules();
        }
        if (startTime && endTime) {
            if (endTime.isBefore(startTime)) {
                setDurationHours(0);
            } else {
                const diff = endTime.diff(startTime, 'hour', true);
                setDurationHours(Math.ceil(diff));
            }
        } else {
            setDurationHours(0);
        }
    }, [startTime, endTime]);

    // Đảm bảo car tồn tại
    if (!car) return null;

    const totalPrice = calculateTotalPrice(durationHours, car);
    const finalPrice = totalPrice - discount;

    // Giả sử các giá trị này, bạn có thể lấy từ props hoặc tính toán lại cho phù hợp
    const VAT = Math.round((totalPrice - discount) * 0.1); // 10% VAT
    const giuCho = 500000; // Tiền giữ chỗ cố định
    let cocXe = 0; // Cọc xe cố định
    if (car.carType === 'STANDARD') {
        cocXe = cocXe + 5000000; // Cọc xe tiêu chuẩn
    } else if (car.carType === 'LUXURY') {
        cocXe = cocXe + 10000000; // Cọc xe hạng sang
    } else {
        cocXe = cocXe + 20000000; // Cọc xe sieu sang
    }
    const tongCong = finalPrice + VAT;



    // Định nghĩa hàm thuê xe
    const handleRentCar = () => {
        if (!startTime || !endTime || durationHours <= 0) {
            setTimeError('Vui lòng chọn thời gian thuê hợp lệ!');
            return;
        }

        const bookingDetails = {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            deliveryAddress,
            durationHours,
            totalPrice,
            VAT,
            giuCho,
            cocXe,
            coupon,
            couponPercent,
            discount
        };
        navigate(`/booking/${car.id}`, {
            state: { car, bookingDetails }
        });
    };

    return (
        <Card className="booking-form" variant={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px #eee', padding: 24 }}>

            {/* Vùng chọn thời gian, click để mở modal */}
            <div
                onClick={showModal}
                style={{
                    border: `1.5px solid ${timeError ? '#ff4d4f' : '#52c41a'}`,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                }}
            >
                <div style={{ color: '#888', fontWeight: 500, marginBottom: 4 }}>
                    <CalendarOutlined style={{ color: '#13c2c2', marginRight: 8 }} />
                    Thời gian thuê
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
                    {startTime && endTime
                        ? `${startTime.format('HH[h]mm, DD/MM/YYYY')} đến ${endTime.format('HH[h]mm, DD/MM/YYYY')}`
                        : <span style={{ color: '#bbb', fontWeight: 400 }}>Chọn thời gian nhận và trả xe</span>
                    }
                </div>
                {timeError && (
                    <div style={{ color: '#ff4d4f', fontWeight: 500 }}>
                        {timeError}
                    </div>
                )}
            </div>

            {/* Modal chọn lịch */}
            <Modal
                title={<span style={{ fontWeight: 700, fontSize: 22 }}>Thời gian thuê</span>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="ÁP DỤNG"
                cancelText="Hủy"
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>ÁP DỤNG</Button>,
                ]}
            >
                <div style={{ marginBottom: 16 }}>
                    <div style={{ color: '#888', fontWeight: 500, marginBottom: 4 }}>
                        <CalendarOutlined style={{ color: '#13c2c2', marginRight: 8 }} />
                        Thời gian thuê
                    </div>
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="DD/MM/YYYY HH:mm"
                        value={rangeValue}
                        onChange={val => {
                            if (!val || !val[0] || !val[1]) return;
                            setRangeValue(val);
                            setTimeError('');
                        }}
                        style={{ width: '100%', borderRadius: 12, fontSize: 16 }}
                        disabledDate={disabledDate}
                        allowClear={false}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                        <div>
                            <b>Từ</b> {startTime ? startTime.format('DD/MM') : '__/__/____'}
                        </div>
                        <div>
                            <b>đến</b> {endTime ? endTime.format('DD/MM') : '__/__/____'}
                        </div>
                        <div>
                            <b>Giờ nhận</b> {startTime ? startTime.format('HH:mm') : '__:__'}
                        </div>
                        <div>
                            <b>Giờ trả</b> {endTime ? endTime.format('HH:mm') : '__:__'}
                        </div>
                    </div>
                    {timeError && (
                        <div style={{ color: '#ff4d4f', fontWeight: 500, marginTop: 8 }}>
                            {timeError}
                        </div>
                    )}
                </div>
            </Modal>

            <Divider />

            <div className="pickup-location" style={{ marginBottom: 16 }}>
                <h4 style={{ marginBottom: 4 }}>
                    <EnvironmentOutlined style={{ color: '#13c2c2', marginRight: 8 }} />
                    Nhận xe tại vị trí xe
                </h4>
                <div className="location-info" style={{ marginLeft: 24 }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{car.location ? `${car.location.district}, ${car.location.city}` : ''}</p>
                    <p className="location-note" style={{ color: '#888', fontSize: 13, margin: 0 }}>
                        Địa điểm cụ thể sẽ được hiển thị sau khi hoàn thành .
                    </p>
                </div>
                <br />
                <div style={{ marginBottom: 5 }}>
                    <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
                        Địa chỉ giao xe (nếu muốn giao tận nơi):
                    </label>
                    <Input
                        placeholder="Nhập địa chỉ bạn muốn giao xe (tuỳ chọn)"
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        allowClear
                    />
                </div>
            </div>

            {/* Ô nhập mã giảm giá */}
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
                    Giảm giá
                </label>
                {appliedCoupon ? (
                    <div style={{
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <span style={{ fontWeight: 700, color: '#52c41a' }}>{appliedCoupon.code}</span>
                            <span style={{ marginLeft: 8, color: '#fa541c' }}>{appliedCoupon.desc}</span>
                            <span style={{ marginLeft: 8, color: '#888' }}>
                                {appliedCoupon.percent ? `- ${appliedCoupon.percent}%` : ''}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#fa541c', fontWeight: 700 }}>
                                -{discount.toLocaleString('vi-VN')}đ
                            </span>
                            <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => {
                                    setAppliedCoupon(null);
                                    setDiscount(0);
                                    setCoupon('');
                                }}
                                style={{ marginLeft: 8 }}
                            >
                                X
                            </Button>
                        </div>
                    </div>
                ) : null}
                <Button
                    type="primary"
                    block
                    icon={<GiftOutlined />}
                    style={{
                        border: 'none',
                        fontWeight: 600,
                        marginBottom: couponError ? 4 : 0
                    }}
                    onClick={openCouponModal}
                    disabled={!!appliedCoupon}
                >
                    Áp dụng mã khuyến mãi / giới thiệu
                </Button>
                {couponError && (
                    <div style={{ color: '#ff4d4f', marginTop: 4 }}>{couponError}</div>
                )}
            </div>

            {/* Modal chọn mã giảm giá */}
            <Modal
                title="Mã khuyến mãi / giới thiệu"
                open={isCouponModalOpen}
                onCancel={() => setIsCouponModalOpen(false)}
                footer={null}
                width={400}
                bodyStyle={{ height: 420, overflow: 'hidden', padding: 16 }} // Thêm dòng này
            >
                <Input
                    placeholder="Nhập mã khuyến mãi"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    style={{ marginBottom: 12 }}
                    allowClear
                    disabled={!!appliedCoupon}
                    onPressEnter={() => handleApplyCoupon()}
                />
                <Button
                    type="primary"
                    block
                    style={{ marginBottom: 16 }}
                    onClick={() => handleApplyCoupon()}
                >
                    Đổi mã
                </Button>
                <Divider style={{ margin: '12px 0' }}>Hoặc chọn mã bên dưới</Divider>
                <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                    {loadingDiscount ? (
                        <Spin />
                    ) : (
                        <List
                            dataSource={discountList}
                            locale={{ emptyText: 'Không có mã giảm giá khả dụng' }}
                            renderItem={item => (
                                <List.Item
                                    style={{
                                        border: '1px solid #e6f7ff',
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        padding: 16,
                                        background: appliedCoupon?.code === item.code ? '#f6ffed' : '#fff'
                                    }}
                                    actions={[
                                        <Button
                                            type="primary"
                                            onClick={() => handleApplyCoupon(item.code)}
                                            disabled={appliedCoupon?.code === item.code}
                                        >
                                            {appliedCoupon?.code === item.code ? 'Đã Áp Dụng' : 'Áp Dụng'}
                                        </Button>
                                    ]}
                                >
                                    <div style={{ width: '100%' }}>
                                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                                            {item.code}
                                        </div>
                                        <div style={{ color: '#fa541c', marginBottom: 4 }}>
                                            {item.description}
                                        </div>
                                        <div style={{ color: '#52c41a', marginBottom: 4 }}>
                                            {item.percent
                                                ? `giảm ${item.percent}%`
                                                : item.value
                                                    ? `giảm ${item.value.toLocaleString('vi-VN')}đ`
                                                    : ''}
                                        </div>
                                        {item.startDate && item.endDate && (
                                            <div style={{ color: '#faad14', fontSize: 12, marginBottom: 4 }}>
                                                Thời gian: {dayjs(item.startDate).format('DD/MM/YYYY')} - {dayjs(item.endDate).format('DD/MM/YYYY')}
                                            </div>
                                        )}
                                        {typeof item.quantity === 'number' && (
                                            <div style={{ color: '#888', fontSize: 12 }}>
                                                Số lượng còn lại: {item.quantity}
                                            </div>
                                        )}
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Modal>

            <Divider />

            <div className="price-summary" style={{ marginBottom: 24 }}>
                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>
                        <DollarOutlined style={{ color: '#fa541c', marginRight: 4 }} />
                        Phí thuê xe
                    </span>
                    <span style={{ fontWeight: 500 }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                {appliedCoupon && (
                    <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#52c41a' }}>
                            Giảm giá ({appliedCoupon.code} {appliedCoupon.desc})
                        </span>
                        <span style={{ color: '#fa541c', fontWeight: 700 }}>
                            -{discount.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                )}

                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Thuế VAT</span>
                    <span>{VAT.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Tổng cộng tiền thuê</span>
                    <span style={{ fontWeight: 500 }}>{tongCong.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Tiền giữ chỗ</span>
                    <span>{giuCho.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Cọc xe</span>
                    <span>{cocXe.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <Button
                type="primary"
                size="large"
                className="rent-button"
                block
                style={{ fontWeight: 700, fontSize: 18, height: 48, borderRadius: 8, background: 'linear-gradient(90deg,#1890ff 0%,#52c41a 100%)', border: 'none' }}
                onClick={handleRentCar}
            >
                🚗 THUÊ XE NGAY
            </Button>
        </Card >
    );
};

function calculateTotalPrice(hours, car) {
    if (!car) return 0;
    let total = 0;
    let remain = hours;

    // Ưu tiên gói lớn trước
    if (car.pricePer24Hour && remain >= 24) {
        const count = Math.floor(remain / 24);
        total += count * Number(car.pricePer24Hour);
        remain = remain % 24;
    }
    if (car.pricePer12Hour && remain >= 12) {
        const count = Math.floor(remain / 12);
        total += count * Number(car.pricePer12Hour);
        remain = remain % 12;
    }
    if (car.pricePer8Hour && remain >= 8) {
        const count = Math.floor(remain / 8);
        total += count * Number(car.pricePer8Hour);
        remain = remain % 8;
    }
    if (car.pricePer4Hour && remain >= 4) {
        const count = Math.floor(remain / 4);
        total += count * Number(car.pricePer4Hour);
        remain = remain % 4;
    }
    if (car.pricePerHour && remain > 0) {
        total += remain * Number(car.pricePerHour);
    }
    return total;
}

export default BookingForm;
