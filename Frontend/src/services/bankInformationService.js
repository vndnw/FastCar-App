import apiClient from '../utils/apiClient';

// Bank API service
export const bankInformationService = {

    // Create bank info by admin
    createBankUserInfo: async (id, userInfo) => {
        return apiClient.post(`/bank-information?userId=${id}`, userInfo);
    },

    // Update bank info by admin
    updateBankUserInfo: async (id, userInfo) => {
        return apiClient.put(`/bank-information?userId=${id}`, userInfo);
    },

};

export default bankInformationService;
