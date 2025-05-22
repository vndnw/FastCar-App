import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    DatePicker,
    TimePicker,
    Button,
    Select,
    Form,
    Space,
    Typography,
    Divider
} from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import './SearchBar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Text } = Typography;
const { Option } = Select;

// Dữ liệu địa điểm
const locations = [
    { value: 'ho-chi-minh', label: 'Hồ Chí Minh' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'binh-duong', label: 'Bình Dương' },
    { value: 'hai-phong', label: 'Hải Phong' },
    { value: 'can-tho', label: 'Cần Thơ' }
];

const SearchBar = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    // Detect scroll position để làm sticky
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const threshold = 150; // Khoảng cách scroll để kích hoạt sticky

            if (scrollTop > threshold && !isSticky) {
                setIsSticky(true);
            } else if (scrollTop <= threshold && isSticky) {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    const handleSearch = async (values) => {
        setLoading(true);
        console.log('Dữ liệu tìm kiếm:', values);

        // Giả lập API call
        setTimeout(() => {
            setLoading(false);
            // Có thể chuyển hướng hoặc hiển thị kết quả
        }, 1000);
    };

    // Disable các ngày trong quá khứ
    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <>
            <div className={`search-bar-container ${isSticky ? 'sticky' : ''}`}>
                <div className="search-bar-wrapper">
                    <Card className="search-bar-card" bodyStyle={{ padding: '16px' }}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSearch}
                            initialValues={{
                                location: 'ho-chi-minh',
                                pickupDate: dayjs().add(1, 'day'),
                                pickupTime: dayjs('14:00', 'HH:mm'),
                                returnDate: dayjs().add(3, 'day'),
                                returnTime: dayjs('18:00', 'HH:mm'),
                            }}
                        >
                            <Row gutter={[8, 4]} align="bottom">
                                {/* Địa điểm nhận xe */}
                                <Col xs={24} sm={24} md={6} lg={5}>
                                    <Form.Item
                                        name="location"
                                        label={<Text strong style={{ fontSize: '12px', color: '#666' }}>Địa điểm nhận xe</Text>}
                                        className="search-form-item"
                                    >
                                        <Select
                                            placeholder="Tìm và chọn địa điểm"
                                            size="middle"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {locations.map(location => (
                                                <Option key={location.value} value={location.value}>
                                                    {location.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* Ngày nhận xe */}
                                <Col xs={12} sm={12} md={4} lg={3}>
                                    <Form.Item
                                        name="pickupDate"
                                        label={<Text strong style={{ fontSize: '12px', color: '#666' }}>Ngày nhận xe</Text>}
                                        className="search-form-item"
                                    >
                                        <DatePicker
                                            locale={locale}
                                            format="DD/MM/YYYY"
                                            size="middle"
                                            disabledDate={disabledDate}
                                            placeholder="22/05/2025"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Giờ nhận xe */}
                                <Col xs={12} sm={12} md={3} lg={2}>
                                    <Form.Item
                                        name="pickupTime"
                                        label={<Text strong style={{ fontSize: '12px', color: '#666' }}>Giờ nhận xe</Text>}
                                        className="search-form-item"
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            size="middle"
                                            minuteStep={30}
                                            placeholder="14:00"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Ngày trả xe */}
                                <Col xs={12} sm={12} md={4} lg={3}>
                                    <Form.Item
                                        name="returnDate"
                                        label={<Text strong style={{ fontSize: '12px', color: '#666' }}>Ngày trả xe</Text>}
                                        className="search-form-item"
                                    >
                                        <DatePicker
                                            locale={locale}
                                            format="DD/MM/YYYY"
                                            size="middle"
                                            disabledDate={disabledDate}
                                            placeholder="24/05/2025"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Giờ trả xe */}
                                <Col xs={12} sm={12} md={3} lg={2}>
                                    <Form.Item
                                        name="returnTime"
                                        label={<Text strong style={{ fontSize: '12px', color: '#666' }}>Giờ trả xe</Text>}
                                        className="search-form-item"
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            size="middle"
                                            minuteStep={30}
                                            placeholder="18:00"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>

                                {/* Nút tìm kiếm */}
                                <Col xs={24} sm={24} md={5} lg={4}>
                                    <Form.Item style={{ marginBottom: 0 }} className="search-form-item">
                                        <Button
                                            type="primary"
                                            size="middle"
                                            htmlType="submit"
                                            loading={loading}
                                            className="search-button"
                                            block
                                        >
                                            TÌM XE
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SearchBar;