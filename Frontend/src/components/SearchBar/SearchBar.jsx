
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    DatePicker,
    TimePicker,
    Button,
    Select,
    Form,
    Typography,
} from 'antd';
import './SearchBar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Text } = Typography;
const { Option } = Select;

const locations = [
    { value: 'ho-chi-minh', label: 'Hồ Chí Minh' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'binh-duong', label: 'Bình Dương' }
];

const SearchBar = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const threshold = 150;
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

        // Tạo URL params từ form values
        const searchParams = new URLSearchParams();

        if (values.location) {
            searchParams.set('location', values.location);
        }

        if (values.pickupDate) {
            searchParams.set('pickupDate', values.pickupDate.format('YYYY-MM-DD'));
        }

        if (values.pickupTime) {
            searchParams.set('pickupTime', values.pickupTime.format('HH:mm'));
        }

        if (values.returnDate) {
            searchParams.set('returnDate', values.returnDate.format('YYYY-MM-DD'));
        }

        if (values.returnTime) {
            searchParams.set('returnTime', values.returnTime.format('HH:mm'));
        }

        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
            // Navigate to car listing page with search parameters
            navigate(`/car-listing?${searchParams.toString()}`);
        }, 1000);
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <div className={`search-bar-container ${isSticky ? 'sticky' : ''}`}>
            <div className="search-bar-wrapper">
                <Card className="search-bar-card" styles={{ body: { padding: '16px 24px' } }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSearch}
                        initialValues={{
                            location: 'ho-chi-minh',
                            pickupDate: dayjs().add(1, 'day'),
                            pickupTime: dayjs('21:00', 'HH:mm'),
                            returnDate: dayjs().add(3, 'day'),
                            returnTime: dayjs('04:00', 'HH:mm'),
                        }}
                    >
                        <Row gutter={16} align="middle" className="search-row">
                            <Col flex="200px" className="search-col">
                                <div className="search-field">
                                    <Text className="field-label">Địa điểm nhận xe</Text>
                                    <Form.Item name="location" className="field-item">
                                        <Select
                                            placeholder="Chọn địa điểm"
                                            size="large"
                                            showSearch
                                            variant={false}
                                            className="field-select"
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
                                </div>
                            </Col>

                            <Col flex="auto" className="search-col">
                                <div className="search-field">
                                    <Text className="field-label">Ngày nhận xe</Text>
                                    <Form.Item name="pickupDate" className="field-item">
                                        <DatePicker
                                            locale={locale}
                                            format="DD/MM/YYYY"
                                            size="large"
                                            variant={false}
                                            disabledDate={disabledDate}
                                            placeholder="31/05/2025"
                                            className="field-input"
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col flex="auto" className="search-col">
                                <div className="search-field">
                                    <Text className="field-label">Giờ nhận xe</Text>
                                    <Form.Item name="pickupTime" className="field-item">
                                        <TimePicker
                                            format="HH:mm"
                                            size="large"
                                            variant={false}
                                            minuteStep={30}
                                            placeholder="21:00"
                                            className="field-input"
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col flex="auto" className="search-col">
                                <div className="search-field">
                                    <Text className="field-label">Ngày trả xe</Text>
                                    <Form.Item name="returnDate" className="field-item">
                                        <DatePicker
                                            locale={locale}
                                            format="DD/MM/YYYY"
                                            size="large"
                                            variant={false}
                                            disabledDate={disabledDate}
                                            placeholder="02/06/2025"
                                            className="field-input"
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col flex="auto" className="search-col">
                                <div className="search-field">
                                    <Text className="field-label">Giờ trả xe</Text>
                                    <Form.Item name="returnTime" className="field-item">
                                        <TimePicker
                                            format="HH:mm"
                                            size="large"
                                            variant={false}
                                            minuteStep={30}
                                            placeholder="04:00"
                                            className="field-input"
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col flex="auto" className="search-col">
                                <Form.Item className="button-item">
                                    <Button
                                        type="primary"
                                        size="large"
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
        </div >
    );
};

export default SearchBar;