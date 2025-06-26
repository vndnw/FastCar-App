import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import tokenManager from '../utils/tokenManager';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

// 2. Tạo Booking Provider Component
// Component này sẽ bao bọc các phần của ứng dụng cần truy cập vào booking context.
export const BookingProvider = ({ children }) => {
  // State để xử lý trạng thái loading và lỗi trong quá trình đặt xe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy thông tin user và token từ AuthContext để sử dụng trong lời gọi API
  // Điều này giúp chúng ta không cần truyền user và token vào hàm bookCar mỗi lần gọi.
  const { user, token } = useAuth();

  /**
   * Hàm để thực hiện việc đặt xe.
   * @param {object} payload - Dữ liệu cần thiết để đặt xe (ví dụ: carId, startDate, endDate).
   * @returns {Promise<{success: boolean, data?: any, error?: string}>} - Một object chứa kết quả của việc đặt xe.
   */
  const bookCar = async (payload) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa.
    if (!user || !token) {
      const errorMessage = 'Bạn cần đăng nhập để thực hiện chức năng này.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi đến service để thực hiện lời gọi API, truyền vào userId, payload, và token.
      // Giả sử đối tượng user có thuộc tính 'id'.
      const res = await userService.bookCar(user.id, payload, token);

      setLoading(false);
      // Trả về kết quả thành công và dữ liệu cho component đã gọi hàm này.
      return { success: true, data: res.data };
    } catch (err) {
      setLoading(false);
      // Xử lý lỗi từ API
      const errorMessage = err.response?.data?.message || 'Không thể đặt xe!';
      setError(errorMessage);
      // Trả về kết quả thất bại và thông báo lỗi.
      return { success: false, error: errorMessage };
    }
  };

  // Giá trị sẽ được cung cấp cho các component consumer.
  const value = {
    loading,
    error,
    bookCar,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// 3. Tạo custom hook để sử dụng booking context một cách tiện lợi
// Giúp giảm thiểu việc phải import useContext và BookingContext trong mỗi component.
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    // Đảm bảo hook này được sử dụng bên trong một BookingProvider.
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// 4. Export context (tùy chọn, nhưng là một thói quen tốt)
export default BookingContext;
