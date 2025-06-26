import apiClient from '../utils/apiClient';

// Admin service
export const adminService = {
    // Get dashboard statistics
    getDashboard: async () => {
        return apiClient.get('/admin/dashboard');
    },

    // Get cars pending approval
    getCarsPendingApproval: async () => {
        return apiClient.get('/admin/car-pending-approval?page=0&size=9999');
    },

    // Get new users in last 7 days
    getNewUsersInLast7Days: async () => {
        return apiClient.get('/admin/new-users-in-last-7-days?page=0&size=9999');
    },


    // Approve car
    approveCar: async (carId) => {
        return apiClient.patch(`/car/${carId}/update-status/AVAILABLE`);
    },

    // Reject car
    rejectCar: async (carId) => {
        return apiClient.patch(`/car/${carId}/update-status/UNAVAILABLE`);
    },

};

export default adminService;