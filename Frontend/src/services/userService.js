import apiClient from '../utils/apiClient';

// User API service
export const userService = {    // Get all users with pagination
    getUsers: async (page = 0, size = 10, sort = 'email,asc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/user?${params}`);
    },
    // Get user by ID
    getUserById: async (id) => {
        return apiClient.get(`/user/${id}?id=${id}`);
    },

    // Create new user
    createUser: async (userData) => {
        return apiClient.post('/user', userData);
    },
    // Update user
    updateUser: async (id, userData) => {
        return apiClient.put(`/user/${id}?id=${id}`, userData);
    },

    // Update user info by admin
    updateUserInfo: async (id, userInfo) => {
        return apiClient.put(`/user/${id}/update-info-user`, userInfo);
    },

    // Create bank info by admin
    createBankUserInfo: async (id, userInfo) => {
        return apiClient.post(`/user/${id}/bank-information`, userInfo);
    },

    // Update bank info by admin
    updateBankUserInfo: async (id, userInfo) => {
        return apiClient.put(`/user/${id}/bank-information`, userInfo);
    },

    // Delete user
    deleteUser: async (id) => {
        return apiClient.delete(`/user/${id}?id=${id}`);
    },

    // Update user status (activate/deactivate)
    updateUserStatus: async (id, active) => {
        return apiClient.patch(`/user/${id}/status?id=${id}`, { active });
    },

    // Activate user by email (specific endpoint)
    activateUser: async (email) => {
        return apiClient.patch(`/user/${email}/activate`);
    },

    // Deactivate user by email (specific endpoint)
    deactivateUser: async (email) => {
        return apiClient.patch(`/user/${email}/deactivate`);
    },

    // Search users
    searchUsers: async (query, page = 0, size = 10) => {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/user/search?${params}`);
    },

    // Get users by role
    getUsersByRole: async (role, page = 0, size = 10) => {
        const params = new URLSearchParams({
            role: role,
            page: page.toString(),
            size: size.toString()
        });

        return apiClient.get(`/user/role?${params}`);
    },

    getCurrentUser: async () => {
        return apiClient.get('/user/me');
    }
};

export default userService;
