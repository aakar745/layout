import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import exhibitorService, { ExhibitorProfile, PaginatedExhibitorResponse } from '../../services/exhibitor';

// Define exhibitor interface (using ExhibitorProfile from service)
export interface Exhibitor extends ExhibitorProfile {}

/**
 * Query parameters for fetching exhibitors
 */
export interface ExhibitorQueryParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
  isActive?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'companyName' | 'status' | 'contactPerson' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface ExhibitorState {
  exhibitors: Exhibitor[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  filters: {
    status: string | null;
    isActive: boolean | null;
    search: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

const initialState: ExhibitorState = {
  exhibitors: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
  filters: {
    status: null,
    isActive: null,
    search: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Async thunk for fetching exhibitors with pagination
export const fetchExhibitors = createAsyncThunk(
  'exhibitors/fetchAll',
  async (params: ExhibitorQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await exhibitorService.getExhibitors(params);
      return response.data as PaginatedExhibitorResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch exhibitors'
      );
    }
  }
);

const exhibitorSlice = createSlice({
  name: 'exhibitor',
  initialState,
  reducers: {
    // Clear exhibitors list
    clearExhibitors: (state) => {
      state.exhibitors = [];
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
    },
    // Reset error state
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExhibitors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExhibitors.fulfilled,
        (state, action: PayloadAction<PaginatedExhibitorResponse>) => {
          state.exhibitors = action.payload.data;
          state.pagination = action.payload.pagination;
          state.filters = action.payload.filters;
          state.loading = false;
        }
      )
      .addCase(fetchExhibitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearExhibitors, clearError } = exhibitorSlice.actions;

export default exhibitorSlice.reducer;
