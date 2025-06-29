import apiClient from '../utils/apiClient';

// Document API service
export const documentService = {
    // Get all documents with pagination
    getDocuments: async (page = 0, size = 10, sort = 'createAt,desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        return apiClient.get(`/document?${params}`);
    },

    // Get document by ID
    getDocumentById: async (id) => {
        return apiClient.get(`/document/${id}`);
    },


    // Get all documents by user ID (without pagination)
    getAllDocumentsByUserId: async (userId) => {
        return apiClient.get(`/document/all/user/${userId}`);
    },



    // Update document status
    updateDocumentStatus: async (id, status) => {
        const params = new URLSearchParams({
            status: status
        });

        return apiClient.put(`/document/${id}/status?${params}`);
    },



    // Delete document
    deleteDocument: async (id) => {
        return apiClient.delete(`/document/${id}`);
    },

};

export default documentService;
