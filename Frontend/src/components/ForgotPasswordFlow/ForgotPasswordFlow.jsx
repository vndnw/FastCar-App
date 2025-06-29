// src/components/Login/ForgotPasswordFlow.jsx

import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Alert } from 'antd';
import { authService } from '../../services/authService';
import './ForgotPasswordFlow.css'; // Import your styles here

const ForgotPasswordFlow = ({ visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đổi mật khẩu
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        setCurrentStep(1);
        setEmail('');
        setError('');
        onClose();
    };

    // Xử lý bước 1: Gửi yêu cầu OTP
    const handleRequestOtp = async (values) => {
        console.log('Requesting OTP for:', values);
        setLoading(true);
        setError('');
        try {
            await authService.forgotPassword(values.email);
            message.success(`Mã OTP đã được gửi đến email: ${values.email}`);
            setEmail(values.email);
            setCurrentStep(2); // Chuyển sang bước 2
            form.resetFields();
        } catch (err) {
            setError(err.response?.data?.message || 'Email không tồn tại hoặc đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý bước 2: Xác thực OTP
    const handleVerifyOtp = async (values) => {
        setLoading(true);
        setError('');
        try {
            await authService.verifyPasswordOtp(email, values.otp);
            message.success('Xác thực OTP thành công!');
            setCurrentStep(3); // Chuyển sang bước 3
            form.resetFields();
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý bước 3: Đổi mật khẩu mới
    const handleResetPassword = async (values) => {
        setLoading(true);
        setError('');
        try {
            await authService.resetPassword(email, values.newPassword);
            message.success('Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.');
            handleClose(); // Đóng modal sau khi hoàn tất
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Form form={form} onFinish={handleRequestOtp} layout="vertical">
                        <Form.Item label="Email đã đăng ký" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                            <Input placeholder="Nhập email của bạn" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>Gửi mã OTP</Button>
                        </Form.Item>
                    </Form>
                );
            case 2:
                return (
                    <Form form={form} onFinish={handleVerifyOtp} layout="vertical">
                        <p>Chúng tôi đã gửi một mã OTP đến <strong>{email}</strong>. Vui lòng kiểm tra và nhập mã vào bên dưới.</p>
                        <Form.Item label="Mã OTP" name="otp" rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}>
                            <Input.OTP length={6} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>Xác nhận</Button>
                        </Form.Item>
                    </Form>
                );
            case 3:
                return (
                    <Form form={form} onFinish={handleResetPassword} layout="vertical">
                        <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]} hasFeedback>
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" dependencies={['newPassword']} hasFeedback rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) { return Promise.resolve(); } return Promise.reject(new Error('Hai mật khẩu không khớp!')); }, })]}>
                            <Input.Password placeholder="Nhập lại mật khẩu mới" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>Đặt lại mật khẩu</Button>
                        </Form.Item>
                    </Form>
                );
            default:
                return null;
        }
    };

    const titles = ["Quên mật khẩu", "Xác thực OTP", "Tạo mật khẩu mới"];

    return (
        <Modal
            title={titles[currentStep - 1]}
            open={visible}
            onCancel={handleClose}
            footer={null}
            centered
            destroyOnClose // Reset state của Form khi modal đóng
        >
            <Spin spinning={loading}>
                {error && <Alert message={error} type="error" style={{ marginBottom: 24 }} />}
                {renderStepContent()}
            </Spin>
        </Modal>
    );
};

export default ForgotPasswordFlow;