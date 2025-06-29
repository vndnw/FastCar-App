import React, { useState } from 'react';
import './Register.css';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import OtpVerification from './OtpVerification';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; // Sử dụng message từ antd

const Register = ({ onClose }) => {
  const { register } = useAuth(); // Sử dụng hàm register từ AuthContext
  const navigate = useNavigate(); // Điều hướng đến trang chủ
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false); // Quản lý trạng thái hiển thị modal OTP
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      message.error('Bạn cần đồng ý với điều khoản để tiếp tục.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      // Gọi hàm register từ AuthContext
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      if (result.success) {
        message.success(result.message); // Hiển thị thông báo thành công
        setShowOtpForm(true); // Hiển thị modal OTP ngay lập tức
      } else {
        message.error(result.error); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error('Đăng ký thất bại:', error.message);
      message.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleOtpSuccess = () => {
    // 1. Đóng modal OTP
    setShowOtpForm(false);

    // 2. Sử dụng hàm navigate để điều hướng đến trang chủ
    navigate('/');

    // 3. (Quan trọng) Đóng luôn cả modal Register chính
    // Hàm onClose này được truyền từ component cha của Register
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="register-modal">
      {showOtpForm ? (
        <OtpVerification
          email={formData.email} // Truyền email sang OtpVerification
          onClose={() => setShowOtpForm(false)} // Đóng modal OTP khi nhấn nút x
          onSuccess={handleOtpSuccess} // Gọi khi xác nhận OTP thành công
        />
      ) : (
        <div className="register-container">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <form className="register-form" onSubmit={handleSubmit}>
            <h2 className="register-title">Đăng ký</h2>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nhập Tên"
                required
              />
            </div>
            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Nhập Họ"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <span
                  className="password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <span
                  className="password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={handleCheckboxChange}
                  required
                />
                Tôi đồng ý với{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  điều khoản sử dụng
                </a>
              </label>
            </div>
            <button type="submit" className="register-button">
              Đăng ký
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;