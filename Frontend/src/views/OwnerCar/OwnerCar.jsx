import React from 'react';
import './OwnerCar.css';

const OwnerCar = () => {
    return (
        <div className="owner-car-wrapper">
            {/* Header Section */}
            <div className="owner-car-header">
                <h1 className="owner-car-title">Trở thành chủ xe</h1>
                <p className="owner-car-description">
                    Bạn có xe và muốn kiếm thêm thu nhập? Hãy tham gia nền tảng của chúng tôi để trở thành chủ xe và kết nối với hàng ngàn khách hàng tiềm năng.
                </p>
            </div>

            {/* Registration Section */}
            <div className="owner-car-registration">
                <h2 className="registration-title">Đăng ký xe của bạn</h2>
                <form className="registration-form">
                    <label htmlFor="car-name">Tên xe:</label>
                    <input type="text" id="car-name" name="car-name" placeholder="Nhập tên xe của bạn" />

                    <label htmlFor="car-details">Thông tin chi tiết:</label>
                    <textarea id="car-details" name="car-details" placeholder="Nhập thông tin chi tiết về xe của bạn"></textarea>

                    <label htmlFor="car-image">Hình ảnh xe:</label>
                    <input type="file" id="car-image" name="car-image" />

                    <button type="submit" className="registration-button">Đăng ký</button>
                </form>
            </div>

            {/* Car List Section */}
            <div className="owner-car-container">
                <h2 className="car-list-title">Danh sách xe của bạn</h2>
                <div className="owner-car-item">
                    <img src="https://example.com/car-image.jpg" alt="Car" className="owner-car-image" />
                    <div className="owner-car-info">
                        <h3>Tên xe</h3>
                        <p>Thông tin chi tiết về xe...</p>
                    </div>
                </div>
                {/* Thêm nhiều xe khác nếu cần */}
            </div>
        </div>
    );
};

export default OwnerCar;