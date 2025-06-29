import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { userService } from '../services/userService'; // Giả định bạn có một file carService
import carService from '../services/carService';
import { useAuth } from './AuthContext'; // Import useAuth để lấy thông tin user và token

// 1. Create Car Context
const CarContext = createContext();

// 2. Create Car Provider Component
export const CarProvider = ({ children }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, isAuthenticated } = useAuth();

    const createCar = async (carData, files) => {
        if (!isAuthenticated || !user) {
            return { success: false, error: 'Người dùng chưa được xác thực. Vui lòng đăng nhập lại.' };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await userService.createCarByUser(user.id, carData, files);

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
    const fetchUserCars = useCallback(async (userId) => {
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
    }, []);

    // Hàm xóa xe
    const deleteCar = async (carId) => {
        if (!isAuthenticated || !user) {
            return { success: false, error: 'Người dùng chưa được xác thực. Vui lòng đăng nhập lại.' };
        }

        try {
            const response = await carService.deleteCar(carId);
            if (response.status === 200 || response.status === 204) {
                // Cập nhật state local
                setCars(prevCars => prevCars.filter(car => car.id !== carId));
                return { success: true };
            } else {
                return { success: false, error: 'Xóa xe thất bại!' };
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi xóa xe!';
            return { success: false, error: errorMessage };
        }
    };

    // Hàm cập nhật trạng thái xe
    const updateCarStatus = async (carId, newStatus) => {
        if (!isAuthenticated || !user) {
            return { success: false, error: 'Người dùng chưa được xác thực. Vui lòng đăng nhập lại.' };
        }

        try {
            const response = await carService.updateCarStatus(carId, newStatus);
            if (response.status === 200) {
                // Cập nhật state local
                setCars(prevCars => 
                    prevCars.map(car => 
                        car.id === carId ? { ...car, status: newStatus } : car
                    )
                );
                return { success: true };
            } else {
                return { success: false, error: 'Cập nhật trạng thái xe thất bại!' };
            }
        } catch (error) {
            console.error('Error updating car status:', error);
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật trạng thái xe!';
            return { success: false, error: errorMessage };
        }
    };

    // Hàm cập nhật thông tin xe
    const updateCar = async (carId, carData) => {
        if (!isAuthenticated || !user) {
            return { success: false, error: 'Người dùng chưa được xác thực. Vui lòng đăng nhập lại.' };
        }

        try {
            const response = await carService.updateCar(carId, carData);
            if (response.status === 200) {
                // Cập nhật state local
                setCars(prevCars => 
                    prevCars.map(car => 
                        car.id === carId ? { ...car, ...response.data } : car
                    )
                );
                return { success: true, data: response.data };
            } else {
                return { success: false, error: 'Cập nhật xe thất bại!' };
            }
        } catch (error) {
            console.error('Error updating car:', error);
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật xe!';
            return { success: false, error: errorMessage };
        }
    };

    // Hàm lấy thông tin chi tiết xe
    const getCarById = async (carId) => {
        try {
            const response = await carService.getCarById(carId);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error getting car details:', error);
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin xe!';
            return { success: false, error: errorMessage };
        }
    };

    const value = useMemo(() => ({
        cars,
        loading,
        error,
        createCar,
        fetchUserCars,
        deleteCar,
        updateCarStatus,
        updateCar,
        getCarById,
    }), [cars, loading, error, createCar, fetchUserCars, deleteCar, updateCarStatus, updateCar, getCarById]);

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
