import api from './api';

export interface Settings {
  _id: string;
  siteName: string;
  adminEmail: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  logo?: string;
  footerText?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

class SettingsService {
  async getSettings(): Promise<Settings> {
    const response = await api.get('/settings');
    return response.data;
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    const response = await api.put('/settings', settings);
    return response.data;
  }

  async uploadLogo(file: File): Promise<{ path: string; thumbnail?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/settings/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
}

export default new SettingsService(); 