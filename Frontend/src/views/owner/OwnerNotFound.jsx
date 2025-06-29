import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function OwnerNotFound() {
    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist in the Owner Panel."
            extra={
                <Button type="primary" onClick={() => navigate('/owner/dashboard')}>
                    Back to Dashboard
                </Button>
            }
        />
    );
}

export default OwnerNotFound;
