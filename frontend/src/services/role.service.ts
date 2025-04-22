import api from './api';

/**
 * Role interface
 */
export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

/**
 * Get all roles
 */
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get('/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Get a role by ID
 */
export const getRoleById = async (roleId: string): Promise<Role> => {
  try {
    const response = await api.get(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
}; 