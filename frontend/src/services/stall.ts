import api from './api';

export interface StallType {
  _id?: string;
  name: string;
  description: string;
  features: Array<{ feature: string }>;
  status: 'active' | 'inactive';
}

const stallService = {
  getStallTypes: async () => {
    return api.get<StallType[]>('/stall-types');
  },

  createStallType: async (data: Partial<StallType>) => {
    return api.post<StallType>('/stall-types', data);
  },

  updateStallType: async (id: string, data: Partial<StallType>) => {
    return api.put<StallType>(`/stall-types/${id}`, data);
  },

  deleteStallType: async (id: string) => {
    return api.delete(`/stall-types/${id}`);
  }
};

export default stallService; 