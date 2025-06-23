import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd'; // Import message từ antd
import './OtpVerification.css';
import { useNavigate } from 'react-router-dom';

const OtpVerification = ({ email, onClose, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const { verifyOTP } = useAuth(); // Lấy hàm verifyOTP từ AuthContext
    const navigate = useNavigate(); // Điều hướng đến trang chủ sau khi xác thực thành công

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await verifyOTP({ email, otp }); // Gửi email và OTP
            if (result.success) {
                message.success(result.message); // Hiển thị thông báo thành công
                onSuccess(); // Gọi hàm onSuccess khi xác thực thành công
            } else {
                message.error(result.error); // Hiển thị thông báo lỗi
            }
        } catch (error) {
            console.error('OTP verification failed:', error.message);
            message.error('Xác thực OTP thất bại. Vui lòng thử lại.'); // Hiển thị thông báo lỗi
        }
    };

    return (
        <div className="otp-modal">
            <div className="otp-container">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <form className="otp-form" onSubmit={handleSubmit}>
                    <h2 className="otp-title">Xác nhận OTP</h2>
                    <p className="otp-description">Nhập mã OTP đã được gửi đến email của bạn</p>
                    <input
                        type="text"
                        className="otp-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Nhập mã OTP"
                        required
                    />
                    <button type="submit" className="otp-button">
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;