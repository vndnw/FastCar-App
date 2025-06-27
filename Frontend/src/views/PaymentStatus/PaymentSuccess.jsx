import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Card, Descriptions, Spin } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './PaymentStatus.css'; // Import tệp CSS dùng chung

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [transactionDetails, setTransactionDetails] = useState(null);

    useEffect(() => {
        // Lấy các tham số từ URL mà VNPAY trả về
        const details = {
            amount: searchParams.get('vnp_Amount'),
            bankCode: searchParams.get('vnp_BankCode'),
            transactionNo: searchParams.get('vnp_TransactionNo'),
            txnRef: searchParams.get('vnp_TxnRef'),
            payDate: searchParams.get('vnp_PayDate'),
        };
        setTransactionDetails(details);
    }, [searchParams]);

    // Hàm định dạng ngày giờ từ VNPAY (YYYYMMDDHHMMSS -> HH:mm:ss DD/MM/YYYY)
    const formatPayDate = (dateString) => {
        if (!dateString || dateString.length !== 14) return 'N/A';
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const hour = dateString.substring(8, 10);
        const minute = dateString.substring(10, 12);
        const second = dateString.substring(12, 14);
        return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
    };

    if (!transactionDetails) {
        return <Spin size="large" className="centered-spin" />;
    }

    return (
        <div className="payment-status-container" >
            <Result
                status="success"
                icon={<CheckCircleOutlined />}
                title="Thanh toán thành công!"
                subTitle="Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Chuyến đi của bạn đã được xác nhận."
                extra={[
                    <Button type="primary" key="home" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>,
                    <Button key="bookings" onClick={() => navigate('/my-bookings')}>
                        Xem lịch sử đặt xe
                    </Button>,
                ]}
            >
                <Card title="Chi tiết giao dịch" variant={false} style={{ maxWidth: 600, margin: '0 auto', textAlign: 'left' }}>
                    <Descriptions column={1} variant>
                        <Descriptions.Item label="Mã giao dịch">{transactionDetails.txnRef}</Descriptions.Item>
                        <Descriptions.Item label="Số tiền">
                            {(parseInt(transactionDetails.amount, 10) / 100).toLocaleString('vi-VN')} VNĐ
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngân hàng">{transactionDetails.bankCode}</Descriptions.Item>
                        <Descriptions.Item label="Mã GD tại VNPAY">{transactionDetails.transactionNo}</Descriptions.Item>
                        <Descriptions.Item label="Thời gian thanh toán">{formatPayDate(transactionDetails.payDate)}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Result>
        </div>
    );
};

export default PaymentSuccess;
