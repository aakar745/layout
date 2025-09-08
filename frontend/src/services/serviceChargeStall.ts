import api from './api';
import { apiUrl } from '../config';

export interface ServiceChargeStall {
  _id: string;
  exhibitionId: string;
  stallNumber: string;
  exhibitorCompanyName: string;
  stallArea: number;
  dimensions?: {
    width: number;
    height: number;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceChargeStallRequest {
  stallNumber: string;
  exhibitorCompanyName: string;
  stallArea: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface UpdateServiceChargeStallRequest {
  stallNumber?: string;
  exhibitorCompanyName?: string;
  stallArea?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  isActive?: boolean;
}

export interface ImportServiceChargeStallRequest {
  stalls: {
    stallNumber: string;
    exhibitorCompanyName: string;
    stallArea: number;
    dimensions?: {
      width: number;
      height: number;
    };
  }[];
}

export interface ServiceChargeStallResponse {
  success: boolean;
  data: ServiceChargeStall[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ImportResult {
  imported: number;
  stalls: ServiceChargeStall[];
}

// Get all service charge stalls for an exhibition
export const getServiceChargeStalls = async (
  exhibitionId: string, 
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    active?: boolean;
  }
): Promise<ServiceChargeStallResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.active !== undefined) queryParams.append('active', params.active.toString());

  const response = await api.get<ServiceChargeStallResponse>(
    `/service-charge-stalls/${exhibitionId}?${queryParams}`
  );
  return response.data;
};

// Create a new service charge stall
export const createServiceChargeStall = async (
  exhibitionId: string,
  data: CreateServiceChargeStallRequest
): Promise<ServiceChargeStall> => {
  const response = await api.post<{ data: ServiceChargeStall }>(
    `/service-charge-stalls/${exhibitionId}`,
    data
  );
  return response.data.data;
};

// Update a service charge stall
export const updateServiceChargeStall = async (
  stallId: string,
  data: UpdateServiceChargeStallRequest
): Promise<ServiceChargeStall> => {
  const response = await api.put<{ data: ServiceChargeStall }>(
    `/service-charge-stalls/stall/${stallId}`,
    data
  );
  return response.data.data;
};

// Delete a service charge stall
export const deleteServiceChargeStall = async (stallId: string): Promise<void> => {
  await api.delete(`/service-charge-stalls/stall/${stallId}`);
};

// Import service charge stalls from Excel/CSV
export const importServiceChargeStalls = async (
  exhibitionId: string,
  data: ImportServiceChargeStallRequest
): Promise<ImportResult> => {
  // Use fetch directly to get better error handling for validation errors
  const response = await fetch(`${apiUrl}/service-charge-stalls/${exhibitionId}/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();

  if (!response.ok) {
    // Create a custom error with full error data for validation errors
    const error = new Error(responseData.message || 'Import failed') as any;
    error.validationData = responseData;
    error.status = response.status;
    throw error;
  }

  return responseData.data;
}; 