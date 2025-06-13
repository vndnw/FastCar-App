import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Demo users - trong thực tế sẽ kết nối với API
  const demoUsers = [
    { email: 'demo@example.com', password: '123456', name: 'Demo User' }
  ];

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      const user = demoUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      
      if (user) {
        // Lưu thông tin user (trong thực tế sẽ lưu token)
        // localStorage.setItem('user', JSON.stringify(user));
        alert('Đăng nhập thành công!');
        navigate('/'); // Chuyển về trang chủ
      } else {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      }
      
      setIsLoading(false);
    }, 1000);
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

          <div>
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

          {/* Demo info */}
          <div className="demo-info">
            <p className="demo-text">
              <strong>Demo:</strong> email: demo@example.com, mật khẩu: 123456
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