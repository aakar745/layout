import api from './api';

/**
 * User interface aligned with backend model
 */
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  } | string;
  isActive: boolean;
  status: 'active' | 'inactive'; // Used for UI display
  department: string;
  avatar?: string;
  lastLogin?: string;
  createdAt?: string;
}

/**
 * User creation data interface
 */
export interface CreateUserData {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive?: boolean;
}

/**
 * Get all users (admin users only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    // Format response to match UI expectations
    return response.data.map((user: any) => ({
      ...user,
      id: user._id,
      name: user.name || user.username, // Fallback to username if name not provided
      status: user.isActive ? 'active' : 'inactive',
      department: user.department || 'General' // Default department
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return {
      ...response.data,
      id: response.data._id,
      name: response.data.name || response.data.username,
      status: response.data.isActive ? 'active' : 'inactive',
      department: response.data.department || 'General'
    };
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
    // Create the payload in the format expected by the backend
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      isActive: userData.isActive
    };
    
    const response = await api.post('/users', payload);
    
    // Map the response to our User interface
    return {
      ...response.data,
      id: response.data._id,
      name: userData.name || response.data.username,
      status: response.data.isActive ? 'active' : 'inactive',
      department: response.data.department || 'General'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user information
 */
export const updateUser = async (
  userId: string, 
  userData: Partial<User>
): Promise<User> => {
  // Convert status back to isActive if provided
  const apiData = { ...userData };
  if (userData.status) {
    apiData.isActive = userData.status === 'active';
    delete apiData.status;
  }

  try {
    const response = await api.put(`/users/${userId}`, apiData);
    return {
      ...response.data,
      id: response.data._id,
      name: response.data.name || response.data.username,
      status: response.data.isActive ? 'active' : 'inactive',
      department: response.data.department || 'General'
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
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