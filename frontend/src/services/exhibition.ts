import api from './api';

export interface Exhibition {
  _id?: string;
  id: string;

  // Basic Information
  // Core details about the exhibition including name, description,
  // venue, dates, status, and configuration
  name: string;
  description?: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'completed';
  isActive: boolean;
  invoicePrefix?: string;
  dimensions: {
    width: number;
    height: number;
  };
  stallRates?: Array<{
    stallTypeId: string;
    rate: number;
  }>;
  // Tax and Discount Configuration
  taxConfig?: Array<{
    name: string;
    rate: number;
    isActive: boolean;
  }>;
  discountConfig?: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;
  publicDiscountConfig?: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;
  halls?: Hall[];
  stalls?: Stall[];
  createdAt: string;
  updatedAt: string;

  // Stats for dashboard and UI
  hallCount?: number;
  stallCount?: number;
  bookedStallCount?: number;
  
  // Creator info
  createdBy?: string;
  createdByName?: string;
  
  // Assigned users for access control
  assignedUsers?: string[];
  
  // Company Details
  companyName?: string;
  companyContactNo?: string;
  companyEmail?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyPAN?: string;
  companyGST?: string;
  companySAC?: string;
  companyCIN?: string;
  termsAndConditions?: string;
  piInstructions?: string;

  // Bank Details
  bankName?: string;
  bankBranch?: string;
  bankIFSC?: string;
  bankAccountName?: string;
  bankAccount?: string;

  // Header settings
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerLogo?: string;
  sponsorLogos?: string[];

  // Footer settings
  footerText?: string;
  footerLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  footerLinks?: Array<{
    label: string;
    url: string;
  }>;

  // Amenities settings
  amenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    rate: number;
  }>;
  
  // Basic amenities are included with stall booking - calculated based on stall size
  basicAmenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    perSqm: number; // How many square meters per 1 unit (e.g., 1 table per 9 sqm)
    quantity: number; // The default quantity to provide per calculation
  }>;
  
  specialRequirements?: string;
}

export interface Hall {
  _id?: string;
  id?: string;
  name: string;
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  exhibitionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stall {
  id?: string;
  _id?: string;
  number: string;
  hallId?: string;
  stallTypeId: string | {
    _id: string;
    name: string;
    description?: string;
  };
  stallType?: {
    name: string;
    description: string | null;
  };
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  ratePerSqm: number;
  status: 'available' | 'booked' | 'reserved';
}

export interface Fixture {
  id?: string;
  _id?: string;
  name: string;
  exhibitionId?: string;
  type: string; // 'sofa', 'chair', 'table', 'exit', 'entrance', etc.
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  rotation: number;
  zIndex: number;
  icon?: string;
  color?: string;
  isActive: boolean;
  showName?: boolean; // Whether to display the fixture name on the layout
  borderColor?: string | null; // Border color for the fixture
  borderRadius?: number; // Border radius in pixels
  createdAt?: string;
  updatedAt?: string;
}

const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred';
  throw new Error(message);
};

const exhibitionService = {
  // Exhibition endpoints
  getExhibitions: async () => {
    try {
      const response = await api.get<Exhibition[]>('/exhibitions');
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getActiveExhibitions: async () => {
    try {
      const response = await api.get<Exhibition[]>('/exhibitions/active');
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllExhibitionsForAssignment: async () => {
    try {
      const response = await api.get<Exhibition[]>('/exhibitions/all-for-assignment');
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getExhibition: async (id: string) => {
    try {
      const response = await api.get<Exhibition>(`/exhibitions/${id}`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createExhibition: async (data: Partial<Exhibition>) => {
    try {
      const response = await api.post<Exhibition>('/exhibitions', data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateExhibition: async (id: string, data: Partial<Exhibition>) => {
    try {
      const response = await api.put<Exhibition>(`/exhibitions/${id}`, data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteExhibition: async (id: string) => {
    try {
      const response = await api.delete(`/exhibitions/${id}`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Hall endpoints
  getHalls: async (exhibitionId: string) => {
    try {
      const response = await api.get<Hall[]>(`/exhibitions/${exhibitionId}/halls`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createHall: async (exhibitionId: string, data: Partial<Hall>) => {
    try {
      // Remove MongoDB-specific fields before sending
      const { _id, id, createdAt, updatedAt, ...cleanData } = data;

      console.log('Creating hall with data:', { exhibitionId, data: cleanData });
      const response = await api.post<Hall>(`/exhibitions/${exhibitionId}/halls`, cleanData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating hall:', error);
      throw error; // Pass through the error to maintain the status code
    }
  },

  updateHall: async (exhibitionId: string, hallId: string, data: Partial<Hall>) => {
    try {
      // Remove MongoDB-specific fields before sending
      const { _id, id, createdAt, updatedAt, ...cleanData } = data;
      
      console.log('Updating hall with data:', { exhibitionId, hallId, data: cleanData });
      const response = await api.put<Hall>(`/exhibitions/${exhibitionId}/halls/${hallId}`, cleanData);
      console.log('Hall updated:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating hall:', error);
      return handleApiError(error);
    }
  },

  deleteHall: async (exhibitionId: string, hallId: string) => {
    try {
      if (!exhibitionId || !hallId) {
        throw new Error('Exhibition ID and Hall ID are required');
      }
      
      console.log('Deleting hall:', { exhibitionId, hallId });
      const response = await api.delete(`/exhibitions/${exhibitionId}/halls/${hallId}`);
      
      if (!response.data) {
        throw new Error('No response received from server');
      }
      
      return response;
    } catch (error: any) {
      console.error('Error deleting hall:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete halls.');
      } else if (error.response?.status === 404) {
        throw new Error('Hall not found.');
      }
      throw error;
    }
  },

  // Layout management
  saveLayout: async (exhibitionId: string, halls: Hall[]) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      // Save halls to local storage
      return { data: { halls } };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getLayout: async (exhibitionId: string) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await api.get<{ halls: Hall[] }>(
        `/exhibitions/${exhibitionId}/layout`
      );
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Stall endpoints
  getStalls: async (exhibitionId: string, hallId?: string) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await api.get<Stall[]>(`/exhibitions/${exhibitionId}/stalls`, { 
        params: { hallId } 
      });
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createStall: async (exhibitionId: string, data: Partial<Stall>) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await api.post<Stall>(`/exhibitions/${exhibitionId}/stalls`, data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateStall: async (exhibitionId: string, stallId: string, data: Partial<Stall>) => {
    try {
      if (!exhibitionId || !stallId) {
        throw new Error('Exhibition ID and Stall ID are required');
      }
      console.log('Updating stall:', { exhibitionId, stallId, data });
      const response = await api.put<Stall>(`/exhibitions/${exhibitionId}/stalls/${stallId}`, data);
      console.log('Stall update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating stall:', error);
      return handleApiError(error);
    }
  },

  deleteStall: async (exhibitionId: string, stallId: string) => {
    try {
      if (!exhibitionId || !stallId) {
        throw new Error('Exhibition ID and Stall ID are required');
      }
      const response = await api.delete(`/exhibitions/${exhibitionId}/stalls/${stallId}`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Fixture endpoints
  getFixtures: async (exhibitionId: string, type?: string) => {
    try {
      const url = `/exhibitions/${exhibitionId}/fixtures`;
      const params = type ? { type } : undefined;
      const response = await api.get<Fixture[]>(url, { params });
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getFixture: async (exhibitionId: string, id: string) => {
    try {
      const response = await api.get<Fixture>(`/exhibitions/${exhibitionId}/fixtures/${id}`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createFixture: async (exhibitionId: string, data: Partial<Fixture>) => {
    try {
      const response = await api.post<Fixture>(`/exhibitions/${exhibitionId}/fixtures`, data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateFixture: async (exhibitionId: string, id: string, data: Partial<Fixture>) => {
    try {
      const response = await api.put<Fixture>(`/exhibitions/${exhibitionId}/fixtures/${id}`, data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteFixture: async (exhibitionId: string, id: string) => {
    try {
      const response = await api.delete(`/exhibitions/${exhibitionId}/fixtures/${id}`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // User assignment endpoints
  assignUsersToExhibition: async (exhibitionId: string, userIds: string[]) => {
    try {
      const response = await api.post(`/exhibitions/${exhibitionId}/assign-users`, { userIds });
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  unassignUserFromExhibition: async (exhibitionId: string, userId: string) => {
    try {
      const response = await api.delete(`/exhibitions/${exhibitionId}/unassign-user/${userId}`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAssignedUsers: async (exhibitionId: string) => {
    try {
      const response = await api.get(`/exhibitions/${exhibitionId}/assigned-users`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default exhibitionService; 