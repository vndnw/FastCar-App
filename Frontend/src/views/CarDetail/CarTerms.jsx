// CarTerms.jsx – Component điều khoản
import React from 'react';
import './CarTerms.css';

const CarTerms = ({ car }) => {
    return (
        <div className="car-terms">
            <h3>Điều khoản</h3>
            <div className="terms-content">
                <p><strong>Quy định khác:</strong></p>
                <ul>
                    <li>Sử dụng xe đúng mục đích.</li>
                    <li>Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</li>
                    <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                    <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</li>
                    <li>Không chở hàng quốc cấm dễ cháy nổ.</li>
                    <li>Không chở hoa quả, thực phẩm nặng mùi trong xe.</li>
                    <li>Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc đóng phí vệ sinh xe.</li>
                    <li>Xe được giới hạn di chuyển tối đa 400km cho 24h, và tần suất là 250km, 300km, 350 km cho 6h, 8h, 12h.</li>
                </ul>
                <p>Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời!</p>
            </div>
        </div>
    );
};

export default CarTerms;
