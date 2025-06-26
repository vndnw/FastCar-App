import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

const PaymentCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Lấy mã trạng thái và các tham số khác từ URL
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

        // Lấy toàn bộ chuỗi query để chuyển tiếp qua trang kết quả
        const queryString = searchParams.toString();

        // Kiểm tra kết quả trả về
        // VNPAY thường trả về '00' cho thành công. 
        // Ta sẽ kiểm tra theo '00' là chuẩn nhất, nhưng vẫn có thể thêm trường hợp '0' như bạn mô tả.
        if (vnp_ResponseCode === '00' || vnp_ResponseCode === '0') {
            // THÀNH CÔNG: Chuyển hướng đến trang thành công, mang theo toàn bộ tham số
            navigate(`/payment-success?${queryString}`);
        } else {
            // THẤT BẠI: Chuyển hướng đến trang thất bại, mang theo toàn bộ tham số
            navigate(`/payment-failure?${queryString}`);
        }

    }, [searchParams, navigate]);

    // Trong khi xử lý, hiển thị một màn hình chờ
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
        </div>
    );
};

export default PaymentCallback;