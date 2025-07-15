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
    Modal,
    Input,
} from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
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
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [timeModalVisible, setTimeModalVisible] = useState(false);
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

        setTimeout(() => {
            setLoading(false);
            navigate(`/car-listing?${searchParams.toString()}`);
        }, 1000);
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const handleLocationModalOk = () => {
        setLocationModalVisible(false);
    };

    const handleTimeModalOk = () => {
        setTimeModalVisible(false);
    };

    const formatTimeRange = () => {
        const pickupTime = form.getFieldValue('pickupTime');
        const pickupDate = form.getFieldValue('pickupDate');
        const returnTime = form.getFieldValue('returnTime');
        const returnDate = form.getFieldValue('returnDate');

        if (pickupTime && pickupDate && returnTime && returnDate) {
            return `${pickupTime.format('HH:mm')}, ${pickupDate.format('DD/MM/YYYY')} đến ${returnTime.format('HH:mm')}, ${returnDate.format('DD/MM/YYYY')}`;
        }
        return 'Chọn thời gian thuê';
    };

    const getLocationLabel = () => {
        const selectedLocation = form.getFieldValue('location');
        return selectedLocation
            ? locations.find(l => l.value === selectedLocation)?.label
            : 'Chọn địa điểm tìm xe';
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
                            pickupTime: dayjs('23:00', 'HH:mm'),
                            returnDate: dayjs().add(3, 'day'),
                            returnTime: dayjs('03:00', 'HH:mm'),
                        }}
                    >
                        {/* Giao diện cho mobile */}
                        <div className="mobile-summary">
                            <div className="summary-item">
                                <div className="summary-box" onClick={() => setLocationModalVisible(true)}>
                                    <EnvironmentOutlined className="summary-icon" />
                                    <span className="summary-text">{getLocationLabel()}</span>
                                </div>
                            </div>
                            <div className="summary-item">
                                <div className="summary-box" onClick={() => setTimeModalVisible(true)}>
                                    <CalendarOutlined className="summary-icon" />
                                    <span className="summary-text">{formatTimeRange()}</span>
                                </div>
                            </div>
                            <Form.Item className="button-item">
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    className="search-button mobile-search-button"
                                    block
                                >
                                    TÌM XE
                                </Button>
                            </Form.Item>
                        </div>

                        {/* Giao diện đầy đủ cho desktop */}
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
                                    <Form.Item
                                        name="returnDate"
                                        className="field-item"
                                        rules={[{
                                            validator: (_, returnDate) => {
                                                const pickupDate = form.getFieldValue('pickupDate');
                                                if (!pickupDate || !returnDate) return Promise.resolve();
                                                if (returnDate.isBefore(pickupDate, 'day')) {
                                                    return Promise.reject(new Error('Ngày trả phải lớn hơn hoặc bằng ngày nhận'));
                                                }
                                                return Promise.resolve();
                                            },
                                        }]}
                                    >
                                        <DatePicker
                                            locale={locale}
                                            format="DD/MM/YYYY"
                                            size="large"
                                            variant={false}
                                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                                            placeholder="Chọn ngày"
                                            className="field-input"
                                        />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col flex="auto" className="search-col">
                                <div className="search-field">
                                    <Text className="field-label">Giờ trả xe</Text>
                                    <Form.Item
                                        name="returnTime"
                                        className="field-item"
                                        rules={[{
                                            validator: (_, returnTime) => {
                                                const pickupDate = form.getFieldValue('pickupDate');
                                                const returnDate = form.getFieldValue('returnDate');
                                                const pickupTime = form.getFieldValue('pickupTime');

                                                if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
                                                    return Promise.resolve();
                                                }

                                                if (returnDate.isSame(pickupDate, 'day')) {
                                                    const pickupMinutes = pickupTime.hour() * 60 + pickupTime.minute();
                                                    const returnMinutes = returnTime.hour() * 60 + returnTime.minute();
                                                    if (returnMinutes <= pickupMinutes) {
                                                        return Promise.reject(new Error('Giờ trả phải lớn hơn giờ nhận nếu cùng ngày'));
                                                    }
                                                }

                                                return Promise.resolve();
                                            },
                                        }]}
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            size="large"
                                            variant={false}
                                            minuteStep={30}
                                            placeholder="Giờ trả"
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

                {/* Modal cho việc chọn địa điểm trên mobile */}
                <Modal
                    title="Chọn địa điểm"
                    open={locationModalVisible}
                    onOk={handleLocationModalOk}
                    onCancel={() => setLocationModalVisible(false)}
                    footer={null}
                    className="mobile-modal"
                >
                    <Form.Item name="location">
                        <Select
                            placeholder="Chọn địa điểm"
                            size="large"
                            className="modal-select"
                            onChange={handleLocationModalOk}
                        >
                            {locations.map(location => (
                                <Option key={location.value} value={location.value}>
                                    {location.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Modal>

                {/* Modal cho việc chọn thời gian trên mobile */}
                <Modal
                    title="Thời gian thuê"
                    open={timeModalVisible}
                    onOk={handleTimeModalOk}
                    onCancel={() => setTimeModalVisible(false)}
                    footer={null}
                    className="mobile-modal"
                >
                    <div className="time-modal-content">
                        <Form.Item label="Ngày nhận xe" name="pickupDate">
                            <DatePicker
                                locale={locale}
                                format="DD/MM/YYYY"
                                size="large"
                                disabledDate={disabledDate}
                                className="modal-input"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Giờ nhận xe" name="pickupTime">
                            <TimePicker
                                format="HH:mm"
                                size="large"
                                minuteStep={30}
                                className="modal-input"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Ngày trả xe" name="returnDate">
                            <DatePicker
                                locale={locale}
                                format="DD/MM/YYYY"
                                size="large"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                className="modal-input"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Giờ trả xe" name="returnTime">
                            <TimePicker
                                format="HH:mm"
                                size="large"
                                minuteStep={30}
                                className="modal-input"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            size="large"
                            onClick={handleTimeModalOk}
                            className="modal-confirm-button"
                            block
                        >
                            Xác nhận
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default SearchBar;