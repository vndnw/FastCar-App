import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';
import { message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'; // Import icon từ Ant Design

const Login = ({ onClose }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmailOrPhone = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Email hoặc số điện thoại không được để trống';
    } else if (!validateEmailOrPhone(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Email hoặc số điện thoại không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData.emailOrPhone, formData.password);
      if (result.success) {
        message.success('Đăng nhập thành công!');
        onClose();
      } else {
        setErrors({
          general: result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Đăng nhập</h2>
          {errors.general && <div className="error-alert">{errors.general}</div>}

          <div className="form-group">
            <label>Email hoặc Số điện thoại</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Nhập email hoặc số điện thoại"
              className={`form-input ${errors.emailOrPhone ? 'error' : ''}`}
            />
            {errors.emailOrPhone && <p className="error-text">{errors.emailOrPhone}</p>}
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
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              <span
                className="password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="checkbox-label">Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;