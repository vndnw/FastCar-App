import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService'; // Giả định bạn có một file carService
import { useAuth } from './AuthContext'; // Import useAuth để lấy thông tin user và token

// 1. Create Car Context
const CarContext = createContext();

// 2. Create Car Provider Component
export const CarProvider = ({ children }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, isAuthenticated } = useAuth();

    const createCar = async (carData) => {
        if (!isAuthenticated || !user) {
            return { success: false, error: 'Người dùng chưa được xác thực. Vui lòng đăng nhập lại.' };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await userService.createACar(user.id, carData);

            if (result.status === 201 || result.status === 200) {
                setCars(prevCars => [...prevCars, result.data]);
                return { success: true, data: result.data };
            } else {
                const errorMessage = result.data?.message || `Yêu cầu thất bại với mã trạng thái ${result.status}`;
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
        } catch (err) {
            console.error('LỖI KHI GỌI API TẠO XE (Chi tiết lỗi):', err);

            if (err.response) {
                const backendErrorMessage =
                    err.response.data?.message ||
                    err.response.data?.error ||
                    `Lỗi từ máy chủ: ${err.response.status}`;
                setError(backendErrorMessage);
                return { success: false, error: backendErrorMessage };

            } else if (err.request) {
                const networkError = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
                setError(networkError);
                return { success: false, error: networkError };

            } else {
                const setupError = err.message || 'Đã xảy ra lỗi khi gửi yêu cầu.';
                setError(setupError);
                return { success: false, error: setupError };
            }

        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy danh sách xe của user từ API
    const fetchUserCars = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await userService.getUserCars(userId);
            setCars(res.data || []);
            return { success: true, data: res.data };
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Không thể lấy danh sách xe!';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cars,
        loading,
        error,
        createCar,
        fetchUserCars,
    };

    return (
        <CarContext.Provider value={value}>
            {children}
        </CarContext.Provider>
    );
};

// Custom hook để sử dụng CarContext
export const useCar = () => {
    const context = useContext(CarContext);
    if (!context) {
        throw new Error('useCar must be used within a CarProvider');
    }
    return context;
};

export default CarContext;
