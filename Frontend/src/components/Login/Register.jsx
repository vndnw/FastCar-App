import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      // Kiểm tra email đã tồn tại (demo)
      // const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      // const emailExists = existingUsers.some(user => user.email === formData.email);
      
      // Demo: giả lập không có email trùng
      const emailExists = false;
      
      if (emailExists) {
        setErrors({ email: 'Email này đã được sử dụng' });
        setIsLoading(false);
        return;
      }
      
      // Tạo user mới
      const newUser = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };
      
      // Lưu user mới (comment vì không dùng localStorage)
      // const updatedUsers = [...existingUsers, newUser];
      // localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      navigate('/login');
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-icon">
            <UserPlus />
          </div>
          <h2 className="register-title">Đăng ký</h2>
          <p className="register-subtitle">Tạo tài khoản mới</p>
        </div>

        {/* Form */}
        <div className="register-form">
          <div className="form-fields">
            <div className="form-group">
              <label className="form-label">
                Họ và tên
              </label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Nhập họ và tên"
                />
              </div>
              {errors.fullName && (
                <p className="error-text">{errors.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Nhập email"
                />
              </div>
              {errors.email && (
                <p className="error-text">{errors.email}</p>
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

            <div className="form-group">
              <label className="form-label">
                Xác nhận mật khẩu
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input form-input-password ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="terms-wrapper">
              <div className="terms-checkbox-wrapper">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="terms-text">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="terms-link">
                    điều khoản sử dụng
                  </Link>
                  {' '}và{' '}
                  <Link to="/privacy" className="terms-link">
                    chính sách bảo mật
                  </Link>
                </span>
              </div>
              {errors.agreeTerms && (
                <p className="error-text">{errors.agreeTerms}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="register-button"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>

          <div className="login-link-section">
            <p className="login-text">
              Đã có tài khoản?
              <Link
                to="/login"
                className="login-link"
              >
                Đăng nhập
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

export default Register;