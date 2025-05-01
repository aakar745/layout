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
 * Role creation data interface
 */
export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
  isActive?: boolean;
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

/**
 * Create a new role
 */
export const createRole = async (roleData: CreateRoleData): Promise<Role> => {
  try {
    const response = await api.post('/roles', roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Update a role
 */
export const updateRole = async (roleId: string, roleData: Partial<CreateRoleData>): Promise<Role> => {
  try {
    const response = await api.put(`/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

/**
 * Delete a role
 */
export const deleteRole = async (roleId: string): Promise<void> => {
  try {
    await api.delete(`/roles/${roleId}`);
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}; 