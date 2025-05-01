import api from './api';

/**
 * User interface
 */
export interface User {
  _id: string;
  username: string;
  name?: string;
  email: string;
  role: any; // Role or role ID
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User creation data interface
 */
export interface CreateUserData {
  username: string;
  name?: string;
  email: string;
  password: string;
  role: string; // Role ID
  isActive?: boolean;
}

/**
 * Get all users (admin panel users)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user
 */
export const updateUser = async (userId: string, userData: Partial<CreateUserData>): Promise<User> => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Helper to get role name safely regardless of format
 */
export const getRoleName = (role: any): string => {
  if (typeof role === 'string') {
    return role;
  }
  return role?.name || 'Unknown';
};

/**
 * Helper to get role ID safely
 */
export const getRoleId = (role: any): string => {
  if (typeof role === 'string') {
    return role;
  }
  return role?._id || '';
}; 