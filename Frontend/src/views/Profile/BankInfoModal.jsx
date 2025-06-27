// BankInfoModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const BankInfoModal = ({ visible, onClose, isUpdate }) => {
    const [form] = Form.useForm();
    const { user, addUserBankInfo, updateUserBankInfo } = useAuth();
    const [loading, setLoading] = useState(false);

    // Điền dữ liệu vào form nếu là chế độ cập nhật
    useEffect(() => {
        if (user?.bankInformation && visible) {
            form.setFieldsValue(user.bankInformation);
        } else {
            form.resetFields();
        }
    }, [user, visible, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            if (isUpdate) {
                await updateUserBankInfo(values);
                message.success('Cập nhật thông tin ngân hàng thành công!');
            } else {
                await addUserBankInfo(values);
                message.success('Thêm thông tin ngân hàng thành công!');
            }
            onClose(); // Đóng modal sau khi thành công
        } catch (err) {
            message.error(err.response?.data?.message || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={isUpdate ? "Cập nhật thông tin ngân hàng" : "Thêm thông tin ngân hàng"}
            visible={visible}
            onCancel={onClose}
            footer={null} // Tự tạo footer riêng
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="bankName" label="Tên ngân hàng" rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="accountNumber" label="Số tài khoản" rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="accountHolderName" label="Tên chủ tài khoản" rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isUpdate ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BankInfoModal;