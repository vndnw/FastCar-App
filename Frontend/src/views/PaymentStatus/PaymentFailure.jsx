import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Card } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './PaymentStatus.css'; // Import tệp CSS dùng chung

export const PaymentFailure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Lấy thông tin lỗi từ URL (VNPAY thường dùng vnp_ResponseCode)
    const errorCode = searchParams.get('vnp_ResponseCode');
    const transactionRef = searchParams.get('vnp_TxnRef');

    const getErrorMessage = (code) => {
        // Bạn có thể mở rộng danh sách này dựa trên tài liệu của VNPAY
        switch (code) {
            case '24':
                return 'Giao dịch không thành công do: Khách hàng hủy giao dịch.';
            case '11':
                return 'Giao dịch không thành công do: Giao dịch thất bại tại VNPAY. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
            default:
                return 'Giao dịch không thành công. Vui lòng liên hệ bộ phận hỗ trợ.';
        }
    };

    return (
        <div className="payment-status-container">
            <Result
                status="error"
                icon={<CloseCircleOutlined />}
                title="Thanh toán thất bại"
                subTitle="Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán."
                extra={[
                    <Button type="primary" key="retry" onClick={() => navigate('/')}>
                        Thử lại với xe khác
                    </Button>,
                    <Button key="contact" onClick={() => navigate('/contact-support')}>
                        Liên hệ hỗ trợ
                    </Button>,
                ]}
            >
                <Card title="Thông tin lỗi" variant={false} style={{ maxWidth: 600, margin: '0 auto' }}>
                    <p><strong>Mã đơn hàng:</strong> {transactionRef || 'Không có'}</p>
                    <p><strong>Lý do:</strong> {getErrorMessage(errorCode)} (Mã lỗi: {errorCode || 'N/A'})</p>
                </Card>
            </Result>
        </div>
    );
};

export default PaymentFailure;

