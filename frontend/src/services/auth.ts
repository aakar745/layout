import api from './api';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    return await api.post('/auth/login', credentials);
  },
  
  getProfile: async () => {
    return await api.get('/auth/me');
  },
  
  changePassword: async (data: ChangePasswordData) => {
    return await api.post('/auth/change-password', data);
  }
};

export default authService; 