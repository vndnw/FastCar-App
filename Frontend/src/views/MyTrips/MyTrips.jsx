import React from 'react';
import './MyTrips.css';

const MyTrips = () => {
    return (
        <div className="my-trips-container">
            <h1 className="my-trips-title">Chuyến của tôi</h1>
            <div className="my-trips-list">
                {/* Mẫu chuyến */}
                <div className="trip-item">
                    <div className="trip-info">
                        <h3>Tên xe: Toyota Camry</h3>
                        <p>Ngày thuê: 01/07/2025</p>
                        <p>Ngày trả: 05/07/2025</p>
                        <p>Địa điểm: Hồ Chí Minh</p>
                    </div>
                    <div className="trip-status">
                        <span className="status-label completed">Hoàn thành</span>
                    </div>
                </div>

                <div className="trip-item">
                    <div className="trip-info">
                        <h3>Tên xe: Honda CR-V</h3>
                        <p>Ngày thuê: 10/07/2025</p>
                        <p>Ngày trả: 15/07/2025</p>
                        <p>Địa điểm: Hà Nội</p>
                    </div>
                    <div className="trip-status">
                        <span className="status-label ongoing">Đang diễn ra</span>
                    </div>
                </div>

                {/* Thêm các chuyến khác nếu cần */}
            </div>
        </div>
    );
};

export default MyTrips;