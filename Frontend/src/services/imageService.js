import apiClient from '../utils/apiClient';

// Image service
export const imageService = {
    // Upload car images - expects actual files, not URLs
    uploadCarImages: async (carId, files) => {
        const formData = new FormData();

        // Handle different input types
        if (files) {
            if (Array.isArray(files)) {
                // If files is an array of File objects
                files.forEach(file => {
                    if (file instanceof File) {
                        formData.append('file', file);
                    }
                });
            } else if (files instanceof FileList) {
                // If files is a FileList from input[type="file"]
                for (let i = 0; i < files.length; i++) {
                    formData.append('file', files[i]);
                }
            } else if (files instanceof File) {
                // If files is a single File object
                formData.append('file', files);
            }
        }

        return apiClient.post(`/image/upload/car/${carId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },


    // Delete car image
    deleteCarImage: async (carId, imageId) => {
        return apiClient.delete(`/image/${imageId}`);
    },

    // Delete all car images
    deleteAllCarImages: async (carId) => {
        return apiClient.delete(`/image/delete/car/${carId}`);
    },

    // Upload general image
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient.post('/image/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },


};

export default imageService;
