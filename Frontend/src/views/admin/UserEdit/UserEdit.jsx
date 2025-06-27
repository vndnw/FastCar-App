import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    Button,
    Form,
    Input,
    DatePicker,
    InputNumber,
    Select,
    message,
    Spin,
    Breadcrumb,
    Typography,
    Divider,
    Space
} from "antd";
import {
    ArrowLeftOutlined,
    UserOutlined,
    SaveOutlined,
    BankOutlined
} from "@ant-design/icons";
import { userService } from "../../../services/userService";
import { roleService } from "../../../services/roleService";
import { bankInformationService } from "../../../services/bankInformationService";
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function UserEdit() {
    const { userId } = useParams();
    const navigate = useNavigate(); const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingBank, setSavingBank] = useState(false);
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [form] = Form.useForm();    // Fetch user details
    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const result = await userService.getUserById(userId);

            if (result.status === 200) {
                const userData = result.data;
                setUser(userData);

                // Parse address if only full address is provided
                let addressData = {
                    address: userData.address?.address || '',
                    street: userData.address?.street || '',
                    ward: userData.address?.ward || '',
                    district: userData.address?.district || '',
                    city: userData.address?.city || '',
                    latitude: userData.address?.latitude || 0,
                    longitude: userData.address?.longitude || 0,
                };

                // If individual address fields are empty but full address exists, parse it
                if (addressData.address &&
                    !addressData.street &&
                    !addressData.ward &&
                    !addressData.district &&
                    !addressData.city) {

                    const addressParts = addressData.address.split(',').map(part => part.trim());
                    if (addressParts.length >= 4) {
                        addressData.street = addressParts[0] || '';
                        addressData.ward = addressParts[1] || '';
                        addressData.district = addressParts[2] || '';
                        addressData.city = addressParts[3] || '';
                    }
                }

                // Populate form with user data
                form.setFieldsValue({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    profilePicture: userData.profilePicture,
                    dateOfBirth: userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
                    roles: userData.roles || ['user'],
                    address: addressData,
                    bankInformation: {
                        bankName: userData.bankInformation?.bankName || '',
                        accountNumber: userData.bankInformation?.accountNumber || '',
                        accountHolderName: userData.bankInformation?.accountHolderName || '',
                    }
                });
            } else {
                const errorMessage = result.data?.message || 'Failed to fetch user details';
                message.error(errorMessage);
                navigate('/admin/users');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user details';
            message.error(errorMessage);
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };// Fetch available roles
    const fetchRoles = async () => {
        try {
            setLoadingRoles(true);
            const result = await roleService.getRoles();

            if (result.status === 200) {
                const rolesData = result.data;
                // Transform roles data to options format for Select component
                const roleOptions = rolesData.map(roleItem => ({
                    value: roleItem.role,
                    label: roleItem.role.charAt(0).toUpperCase() + roleItem.role.slice(1)
                }));
                setRoles(roleOptions);
            } else {
                console.error('Failed to fetch roles:', result.message);
                const errorMessage = result.data?.message || 'Failed to load user roles. Please try again later.';
                message.error(errorMessage);
                setRoles([]);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unable to load user roles. Please check your connection and try again.';
            message.error(errorMessage);
            setRoles([]);
        } finally {
            setLoadingRoles(false);
        }
    }; useEffect(() => {
        if (userId) {
            fetchUserDetails();
            fetchRoles();
        }
    }, [userId]);

    // Auto-generate address from individual fields
    const handleAddressFieldChange = () => {
        // Use setTimeout to ensure form values are updated
        setTimeout(() => {
            const addressFields = form.getFieldsValue(['address']).address;
            const street = addressFields?.street || '';
            const ward = addressFields?.ward || '';
            const district = addressFields?.district || '';
            const city = addressFields?.city || '';

            // Generate full address in required format
            const fullAddress = [street, ward, district, city]
                .filter(field => field.trim()) // Remove empty fields
                .join(', ');

            // Update the address field
            form.setFieldValue(['address', 'address'], fullAddress);
        }, 0);
    };

    const handleGoBack = () => {
        navigate('/admin/users');
    };

    const handleViewUserDetail = () => {
        navigate(`/admin/users/${userId}`);
    };
    const handleUpdateUser = async (values) => {
        try {
            setSaving(true);

            // Prepare data for API
            const updateData = {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone || '',
                profilePicture: values.profilePicture,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
                roles: values.roles || ['user'],
                address: {
                    address: values.address?.address || '',
                    street: values.address?.street || '',
                    ward: values.address?.ward || '',
                    district: values.address?.district || '',
                    city: values.address?.city || '',
                    latitude: values.address?.latitude || 0,
                    longitude: values.address?.longitude || 0,
                }
            };

            const result = await userService.updateUser(userId, updateData);

            if (result.status === 200) {
                message.success('User updated successfully!');
                navigate(`/admin/users/${userId}`);
            } else {
                const errorMessage = result.data?.message || result.message || 'Failed to update user';
                message.error(errorMessage);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update user';
            message.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateBankInfo = async () => {
        try {
            setSavingBank(true);

            // Get bank information from form
            const bankInfo = form.getFieldsValue(['bankInformation']).bankInformation;

            // Prepare bank data for API
            const bankData = {
                bankName: bankInfo?.bankName || '',
                accountNumber: bankInfo?.accountNumber || '',
                accountHolderName: bankInfo?.accountHolderName || ''
            };

            try {
                // Try to update bank information first
                const result = await bankInformationService.updateBankUserInfo(userId, bankData);

                if (result.status === 200) {
                    message.success('Bank information updated successfully!');
                    // Refresh user data to get updated bank info
                    await fetchUserDetails();
                } else {
                    message.error(result.message || 'Failed to update bank information');
                }
            } catch (updateError) {
                // If update fails with 404, try to create bank information
                if (updateError.response?.status === 404 || updateError.status === 404) {
                    try {
                        const createResult = await bankInformationService.createBankUserInfo(userId, bankData);

                        if (createResult.status === 200 || createResult.status === 201) {
                            message.success('Bank information created successfully!');
                            // Refresh user data to get updated bank info
                            await fetchUserDetails();
                        } else {
                            message.error(createResult.message || 'Failed to create bank information');
                        }
                    } catch (createError) {
                        console.error('Error creating bank information:', createError);
                        message.error(createError.message || 'Failed to create bank information');
                    }
                } else {
                    // For other errors, show the original update error
                    console.error('Error updating bank information:', updateError);
                    message.error(updateError.message || 'Failed to update bank information');
                }
            }
        } catch (error) {
            console.error('Error handling bank information:', error);
            message.error(error.message || 'Failed to process bank information');
        } finally {
            setSavingBank(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <Card style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={handleGoBack}
                            >
                                Back to Users
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>
                                Edit User
                            </Title>
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            onClick={handleViewUserDetail}
                        >
                            View Details
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateUser}
                disabled={saving || savingBank}
            >
                <Row gutter={[24, 24]}>
                    {/* Personal Information */}
                    <Col xs={24} lg={12}>
                        <Card title="Personal Information">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="First Name"
                                        name="firstName"
                                        rules={[{ required: true, message: 'Please input first name!' }]}
                                    >
                                        <Input placeholder="Enter first name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Last Name"
                                        name="lastName"
                                        rules={[{ required: true, message: 'Please input last name!' }]}
                                    >
                                        <Input placeholder="Enter last name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please input email!' },
                                            { type: 'email', message: 'Please enter a valid email!' }
                                        ]}
                                    >
                                        <Input placeholder="Enter email" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Phone"
                                        name="phone"
                                    >
                                        <Input placeholder="Enter phone number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Profile Picture URL"
                                        name="profilePicture"
                                    >
                                        <Input placeholder="Enter profile picture URL" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="Select date of birth"
                                            format="DD/MM/YYYY"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>                            <Form.Item
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>User Roles</span>
                                        {roles.length === 0 && !loadingRoles && (
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={fetchRoles}
                                                style={{ padding: 0, height: 'auto' }}
                                            >
                                                Retry loading roles
                                            </Button>
                                        )}
                                    </div>
                                }
                                name="roles"
                                rules={[{ required: true, message: 'Please select at least one role!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={roles.length === 0 && !loadingRoles ? "No roles available. Click 'Retry loading roles' above." : "Select user roles"}
                                    loading={loadingRoles}
                                    options={roles}
                                    disabled={roles.length === 0 && !loadingRoles}
                                    notFoundContent={loadingRoles ? "Loading roles..." : "No roles available"}
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* Address Information */}
                    <Col xs={24} lg={12}>
                        <Card title="Address Information">
                            <Form.Item
                                label="Full Address"
                                name={['address', 'address']}
                                rules={[
                                    { required: true, message: 'Address is required!' },
                                    {
                                        pattern: /^.+,\s*.+,\s*.+,\s*.+$/,
                                        message: "Invalid address format. Expected format: 'Street, Ward, District, City'"
                                    }
                                ]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Address will be auto-generated from fields below"
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5', color: '#000' }}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Street"
                                        name={['address', 'street']}
                                        rules={[{ required: true, message: 'Street is required!' }]}
                                    >
                                        <Input
                                            placeholder="Enter street"
                                            onChange={handleAddressFieldChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Ward"
                                        name={['address', 'ward']}
                                        rules={[{ required: true, message: 'Ward is required!' }]}
                                    >
                                        <Input
                                            placeholder="Enter ward"
                                            onChange={handleAddressFieldChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="District"
                                        name={['address', 'district']}
                                        rules={[{ required: true, message: 'District is required!' }]}
                                    >
                                        <Input
                                            placeholder="Enter district"
                                            onChange={handleAddressFieldChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="City"
                                        name={['address', 'city']}
                                        rules={[{ required: true, message: 'City is required!' }]}
                                    >
                                        <Input
                                            placeholder="Enter city"
                                            onChange={handleAddressFieldChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        {/* Action Buttons */}
                        <div style={{
                            padding: '16px 0',
                        }}>
                            <Row justify="end">
                                <Space>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={saving}
                                        icon={<SaveOutlined />}
                                        size="large"
                                    >
                                        Save User Info
                                    </Button>
                                </Space>
                            </Row>
                        </div>
                    </Col>

                    {/* Bank Information */}
                    <Col xs={24}>
                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>
                                        <BankOutlined style={{ marginRight: '8px' }} />
                                        Bank Information (Optional)
                                    </span>
                                    <Button
                                        type="primary"
                                        ghost
                                        loading={savingBank}
                                        icon={<SaveOutlined />}
                                        onClick={handleUpdateBankInfo}
                                        size="small"
                                    >
                                        Save Bank Info
                                    </Button>
                                </div>
                            }
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Bank Name"
                                        name={['bankInformation', 'bankName']}
                                    >
                                        <Input placeholder="Enter bank name" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Account Number"
                                        name={['bankInformation', 'accountNumber']}
                                    >
                                        <Input placeholder="Enter account number" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Account Holder Name"
                                        name={['bankInformation', 'accountHolderName']}
                                    >
                                        <Input placeholder="Enter account holder name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>


            </Form>
        </div>
    );
}

export default UserEdit;
