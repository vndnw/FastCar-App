import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const AdminNotFound = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        navigate('/admin/dashboard');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: '#f0f2f5'
        }}>
            <Result
                status="404"
                title="404"
                subTitle="Trang quản trị bạn đang tìm kiếm không tồn tại."
                style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '48px 32px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    maxWidth: '500px',
                    width: '100%'
                }}
                extra={
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Button
                            type="primary"
                            onClick={handleGoToDashboard}
                            style={{
                                height: '36px',
                                padding: '0 20px',
                                fontSize: '14px',
                                borderRadius: '4px',
                                fontWeight: '500'
                            }}
                        >
                            Về Dashboard
                        </Button>
                        <Button
                            onClick={handleGoBack}
                            style={{
                                height: '36px',
                                padding: '0 20px',
                                fontSize: '14px',
                                borderRadius: '4px',
                                fontWeight: '500'
                            }}
                        >
                            Quay lại
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default AdminNotFound;