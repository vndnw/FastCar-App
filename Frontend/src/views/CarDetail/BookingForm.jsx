import React, { useState } from 'react';
import { Button, Modal, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import './BookingForm.css';

const BookingForm = ({ car }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [durationHours, setDurationHours] = useState(0);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleOk = () => {
        if (!startTime || !endTime) {
            message.warning('Vui lòng chọn đầy đủ thời gian nhận và trả xe');
            return;
        }

        if (endTime.isBefore(startTime)) {
            message.error('⛔ Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        const startHour = startTime.hour();
        const endHour = endTime.hour();

        if (startHour >= 23) {
            message.error('📌 Giờ nhận xe không được sau 23h00');
            return;
        }

        if (endHour < 5) {
            message.error('📌 Giờ trả xe không được trước 05h00 sáng');
            return;
        }

        // ✅ Tính số giờ thuê
        const diff = endTime.diff(startTime, 'hour', true); // true để lấy số thực
        const rounded = Math.ceil(diff); // Làm tròn lên theo giờ
        setDurationHours(rounded);

        setIsModalOpen(false);
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

    const totalPrice = durationHours * car.pricePerHour;

    return (
        <div className="booking-form">
            <h3>Thời gian thuê</h3>

            <div className="time-selection">
                <div className="time-input">

                    <div className="datetime-input" onClick={showModal}>
                        <span>
                            📅 {startTime && endTime
                                ? `${dayjs(startTime).format('HH[h]mm, DD/MM/YYYY')} đến ${dayjs(endTime).format('HH[h]mm, DD/MM/YYYY')}`
                                : 'Chọn thời gian nhận và trả xe'}
                        </span>
                    </div>
                    <p className="time-note">
                        📌 Không nhận xe sau 23h, không trả xe trước 5h sáng.
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
                    <span>{car.pricePerHour.toLocaleString('vi-VN')}đ/giờ</span>
                </div>

                {durationHours > 0 && (
                    <>
                        <div className="price-row">
                            <span>Số giờ thuê:</span>
                            <span>{durationHours} giờ</span>
                        </div>
                        <div className="price-row total">
                            <span>Thành tiền:</span>
                            <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </>
                )}

                {durationHours === 0 && (
                    <div className="price-row total">
                        <span>Thành tiền:</span>
                        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                )}
            </div>

            <Button type="primary" size="large" className="rent-button" block>
                THUÊ XE
            </Button>

            <Modal
                title="Chọn thời gian thuê xe"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <div style={{ marginBottom: 16 }}>
                    <label><strong>Thời gian bắt đầu:</strong></label>
                    <DatePicker
                        showTime={{ format: 'HH:mm', disabledHours: disableStartHours }}
                        format="HH[h]mm, DD/MM/YYYY"
                        value={startTime}
                        onChange={setStartTime}
                        style={{ width: '100%' }}
                        disabledDate={disablePastDates}
                    />
                </div>
                <div>
                    <label><strong>Thời gian kết thúc:</strong></label>
                    <DatePicker
                        showTime={{ format: 'HH:mm', disabledHours: disableEndHours }}
                        format="HH[h]mm, DD/MM/YYYY"
                        value={endTime}
                        onChange={setEndTime}
                        style={{ width: '100%' }}
                        disabledDate={disablePastDates}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default BookingForm;
