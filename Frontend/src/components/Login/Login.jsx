import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';
import { message } from 'antd';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/'; const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  }); const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  }; const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const result = await login(formData.emailOrPhone, formData.password);
      if (result.success) {
        const { user } = result.data;

        // Chuyển hướng dựa trên role hoặc intended destination
        if (from.startsWith('/admin') && user.roles && user.roles.includes('admin')) {
          navigate(from);
        } else if (user.roles && user.roles.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }

        // Thông báo thành công
        message.success('Đăng nhập thành công!');
      } else {
        setErrors({
          general: result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">
            <LogIn />
          </div>
          <h2 className="login-title">Đăng nhập</h2>

        </div>

        {/* Form */}
        <div className="login-form">
          {errors.general && (
            <div className="error-alert">
              {errors.general}
            </div>
          )}

          <div>            <div className="form-group">
            <label className="form-label">
              Email hoặc Số điện thoại
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                className={`form-input ${errors.emailOrPhone ? 'error' : ''}`}
                placeholder="Nhập email hoặc số điện thoại"
              />
            </div>
            {errors.emailOrPhone && (
              <p className="error-text">{errors.emailOrPhone}</p>
            )}
          </div>

            <div className="form-group">
              <label className="form-label">
                Mật khẩu
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input form-input-password ${errors.password ? 'error' : ''}`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
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
              <Link to="/forgot-password" className="forgot-password-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>

          <div className="register-link-section">
            <p className="register-text">
              Chưa có tài khoản?
              <Link
                to="/register"
                className="register-link"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="back-home-section">
            <Link
              to="/"
              className="back-home-link"
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;