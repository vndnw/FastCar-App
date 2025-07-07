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
        return apiClient.patch(`/user/${email}/in-activate`);
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

    // Advanced search users with structured parameters
    advancedSearchUsers: async (searchParams, page = 0, size = 10, sort = ['email,asc']) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: Array.isArray(sort) ? sort.join(',') : sort
        });

        // Add search parameters to URL params
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return apiClient.get(`/user/search?${params}`);
    },

    bookCar: async (userId, payload, token) => {
        return apiClient.post(`/user/${userId}/book-car`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Create car for user
    createCarByUser: async (userId, carData, files) => {
        const formData = new FormData();

        // Add car data as JSON string to FormData with name "carData"
        formData.append('carData', new Blob([JSON.stringify(carData)], {
            type: 'application/json'
        }));

        // Add files to FormData with name "files"
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }

        return apiClient.post(`/user/${userId}/create-car`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getUserCars: async (userId) => {
        // apiClient sẽ tự động đính kèm token xác thực
        return apiClient.get(`/user/${userId}/list-car`); // Giả sử đây là endpoint của bạn
    },

    getCCCD: async (userId) => {
        return apiClient.get(`/user/${userId}/cccd`);
    },

    getLicense: async (userId) => {
        return apiClient.get(`/user/${userId}/license`);
    },

    // Update avatar for user
    updateAvatar: async (newFormData) => {
        const formData = new FormData();
        formData.append('avatar', newFormData);

        return apiClient.patch(`/user/me/update-avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
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

    addCCCD: async (userId, documentRequest, imageFront, imageBack) => {
        const formData = new FormData();
        formData.append('documentRequest', new Blob([JSON.stringify(documentRequest)], {
            type: 'application/json'
        }));
        formData.append('imageFront', imageFront);
        formData.append('imageBack', imageBack);

        return apiClient.post(`/user/${userId}/add-cccd`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateCCCD: async (userId, documentRequest, imageFront, imageBack) => {
        const formData = new FormData();
        formData.append('documentRequest', new Blob([JSON.stringify(documentRequest)], {
            type: 'application/json'
        }));

        // Only append images if they are not null
        if (imageFront) {
            formData.append('imageFront', imageFront);
        }
        if (imageBack) {
            formData.append('imageBack', imageBack);
        }

        return apiClient.put(`/user/${userId}/update-cccd`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    addLicense: async (userId, documentRequest, imageFront, imageBack) => {
        const formData = new FormData();
        formData.append('documentRequest', new Blob([JSON.stringify(documentRequest)], {
            type: 'application/json'
        }));
        formData.append('imageFront', imageFront);
        formData.append('imageBack', imageBack);

        return apiClient.post(`/user/${userId}/add-license`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateLicense: async (userId, documentRequest, imageFront, imageBack) => {
        const formData = new FormData();
        formData.append('documentRequest', new Blob([JSON.stringify(documentRequest)], {
            type: 'application/json'
        }));

        // Only append images if they are not null
        if (imageFront) {
            formData.append('imageFront', imageFront);
        }
        if (imageBack) {
            formData.append('imageBack', imageBack);
        }

        return apiClient.put(`/user/${userId}/update-license`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getCurrentUser: async () => {
        return apiClient.get('/user/me');
    }
};

export default userService;
