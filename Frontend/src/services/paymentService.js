import apiClient from '../utils/apiClient';

export const paymentService = {

    paymentCallBack: async (params) => {
        return apiClient.post(`/payment/callback?${params}` );
    },
    // Thêm các phương thức khác nếu cần thiết
    // Ví dụ: tạo đơn hàng, lấy thông tin thanh toán, v.v.
    createPayment: async (paymentData) => {
        return apiClient.post('/payment', paymentData);
    },
    // Lấy thông tin thanh toán theo ID
    getPaymentById: async (id) => {
        return apiClient.get(`/payment/${id}`);
    },
    // Cập nhật thông tin thanh toán
    updatePayment: async (id, paymentData) => {
        return apiClient.put(`/payment/${id}`, paymentData);
    },
    // Xóa thông tin thanh toán
    deletePayment: async (id) => {
        return apiClient.delete(`/payment/${id}`);
    },
    // Lấy danh sách thanh toán với phân trang
    getPayments: async(page = 0, size = 10, sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/payment?${params}`);
    },
    // Lấy danh sách thanh toán theo trạng thái
    getPaymentsByStatus: async (status, page = 0, size = 10
    , sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            status: status,
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/payment/status?${params}`);
    },
    // Lấy danh sách thanh toán theo người dùng
    getPaymentsByUser: async (userId, page = 0, size = 10, sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            userId: userId,
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/payment/user?${params}`);
    },
    // Lấy danh sách thanh toán theo phương thức thanh toán
    getPaymentsByMethod: async (method, page = 0, size = 10
        , sort = 'createdAt,desc') => {
        const params = new URLSearchParams({
            method: method,
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });
        return apiClient.get(`/payment/method?${params}`);
    },
}

export default paymentService;