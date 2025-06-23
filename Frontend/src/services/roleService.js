import apiClient from '../utils/apiClient';

// Role API service
export const roleService = {
    // Get all roles
    getRoles: async () => {
        return apiClient.get('/role');
    },

    // Get role by ID
    getRoleById: async (roleId) => {
        return apiClient.get(`/role/${roleId}`);
    },

    // Create new role
    createRole: async (roleData) => {
        return apiClient.post('/role', roleData);
    },

    // Update role
    updateRole: async (roleId, roleData) => {
        return apiClient.put(`/role/${roleId}`, roleData);
    },

    // Delete role
    deleteRole: async (roleId) => {
        return apiClient.delete(`/role/${roleId}`);
    },

    // Get role permissions
    getRolePermissions: async (roleId) => {
        return apiClient.get(`/role/${roleId}/permissions`);
    },

    // Update role permissions
    updateRolePermissions: async (roleId, permissions) => {
        return apiClient.put(`/role/${roleId}/permissions`, { permissions });
    },

    // Get all available permissions
    getAvailablePermissions: async () => {
        return apiClient.get('/role/permissions');
    }
};

export default roleService;
