import api from './api';

export interface ExhibitionLetter {
  _id: string;
  exhibitionId: string;
  bookingId: string;
  exhibitorId: string;
  letterType: 'standPossession' | 'transport';
  
  // Letter Content
  subject: string;
  content: string;
  
  // Recipient Information
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  stallNumbers: string[];
  
  // Sending Information
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
  sentAt?: string;
  scheduledFor?: string;
  failureReason?: string;
  retryCount: number;
  
  // Sending Method
  sendingMethod: 'automatic' | 'manual';
  sentBy?: {
    _id: string;
    username: string;
  };
  
  // Email Details
  emailMessageId?: string;
  isTestMode?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface LetterStatistics {
  standPossession: {
    sent: number;
    pending: number;
    failed: number;
    scheduled: number;
  };
  transport: {
    sent: number;
    pending: number;
    failed: number;
    scheduled: number;
  };
  totalEligibleBookings: number;
}

export interface LetterPreview {
  subject: string;
  content: string;
  variables: Record<string, string>;
}

export interface SendLettersResult {
  sent: number;
  failed: number;
  total: number;
}

export interface UpcomingSchedule {
  exhibitionId: string;
  exhibitionName: string;
  letterType: 'standPossession' | 'transport';
  scheduledDate: string;
  daysUntilStart: number;
  status: 'due' | 'scheduled';
}

const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred';
  throw new Error(message);
};

const exhibitionLetterService = {
  /**
   * Send letters manually for an exhibition
   */
  sendLettersManually: async (exhibitionId: string, letterType: 'standPossession' | 'transport') => {
    try {
      const response = await api.post<{ message: string; result: SendLettersResult }>(
        `/exhibition-letters/${exhibitionId}/send`,
        { letterType }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get letters for an exhibition with pagination and filtering
   */
  getLetters: async (
    exhibitionId: string,
    options: {
      page?: number;
      limit?: number;
      letterType?: 'standPossession' | 'transport';
      status?: string;
      search?: string;
    } = {}
  ) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.letterType) params.append('letterType', options.letterType);
      if (options.status) params.append('status', options.status);
      if (options.search) params.append('search', options.search);

      const response = await api.get<{
        letters: ExhibitionLetter[];
        pagination: {
          current: number;
          pageSize: number;
          total: number;
          totalPages: number;
        };
      }>(`/exhibition-letters/${exhibitionId}?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get letter statistics for an exhibition
   */
  getStatistics: async (exhibitionId: string) => {
    try {
      const response = await api.get<LetterStatistics>(`/exhibition-letters/${exhibitionId}/statistics`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Preview letter content before sending
   */
  previewLetter: async (
    exhibitionId: string,
    bookingId: string,
    letterType: 'standPossession' | 'transport'
  ) => {
    try {
      const response = await api.get<LetterPreview>(
        `/exhibition-letters/${exhibitionId}/preview/${bookingId}?letterType=${letterType}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Resend a failed letter
   */
  resendLetter: async (letterId: string) => {
    try {
      const response = await api.post<{ message: string }>(`/exhibition-letters/letter/${letterId}/resend`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get upcoming letter schedules
   */
  getUpcomingSchedules: async () => {
    try {
      const response = await api.get<UpcomingSchedule[]>('/exhibition-letters/schedules/upcoming');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Delete a letter record
   */
  deleteLetter: async (letterId: string) => {
    try {
      const response = await api.delete<{ message: string }>(`/exhibition-letters/letter/${letterId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get letter details by ID
   */
  getLetterById: async (letterId: string) => {
    try {
      const response = await api.get<ExhibitionLetter>(`/exhibition-letters/letter/${letterId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Download letter as PDF
   */
  downloadLetterPDF: async (letterId: string) => {
    try {
      const response = await api.get(`/exhibition-letters/letter/${letterId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default exhibitionLetterService; 