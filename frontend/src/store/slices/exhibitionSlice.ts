import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import exhibitionService, { Exhibition, Hall, Stall, Fixture } from '../../services/exhibition';

interface ExhibitionState {
  exhibitions: Exhibition[];
  activeExhibitions: Exhibition[];
  currentExhibition: Exhibition | null;
  halls: Hall[];
  stalls: Stall[];
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
  stallsPagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
  };
}

const initialState: ExhibitionState = {
  exhibitions: [],
  activeExhibitions: [],
  currentExhibition: null,
  halls: [],
  stalls: [],
  fixtures: [],
  loading: false,
  error: null,
  stallsPagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
    startIndex: 0,
    endIndex: 0,
  },
};

// Async thunks
export const fetchExhibitions = createAsyncThunk(
  'exhibition/fetchExhibitions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exhibitionService.getExhibitions();
      // Normalize the data to include both _id and id
      const normalizedData = response.data.map(exhibition => ({
        ...exhibition,
        id: exhibition._id || exhibition.id // Use existing id as fallback
      })).filter(exhibition => exhibition.id); // Ensure we only return exhibitions with valid IDs
      return normalizedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveExhibitions = createAsyncThunk(
  'exhibition/fetchActiveExhibitions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exhibitionService.getActiveExhibitions();
      // Normalize the data to include both _id and id
      const normalizedData = response.data.map(exhibition => ({
        ...exhibition,
        id: exhibition._id || exhibition.id // Use existing id as fallback
      })).filter(exhibition => exhibition.id); // Ensure we only return exhibitions with valid IDs
      return normalizedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllExhibitionsForAssignment = createAsyncThunk(
  'exhibition/fetchAllExhibitionsForAssignment',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exhibitionService.getAllExhibitionsForAssignment();
      // Normalize the data to include both _id and id
      const normalizedData = response.data.map(exhibition => ({
        ...exhibition,
        id: exhibition._id || exhibition.id // Use existing id as fallback
      })).filter(exhibition => exhibition.id); // Ensure we only return exhibitions with valid IDs
      return normalizedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExhibition = createAsyncThunk(
  'exhibition/fetchExhibition',
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.getExhibition(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createExhibition = createAsyncThunk(
  'exhibition/createExhibition',
  async (data: Partial<Exhibition>, { rejectWithValue }) => {
    try {
      const response = await exhibitionService.createExhibition(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExhibition = createAsyncThunk(
  'exhibition/updateExhibition',
  async ({ id, data }: { id: string; data: Partial<Exhibition> }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.updateExhibition(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHalls = createAsyncThunk(
  'exhibition/fetchHalls',
  async (exhibitionId: string, { rejectWithValue }) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.getHalls(exhibitionId);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Return empty array if halls endpoint doesn't exist yet
        return [];
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStalls = createAsyncThunk(
  'exhibition/fetchStalls',
  async ({ 
    exhibitionId, 
    hallId, 
    page = 1, 
    limit = 1000,
    search, 
    status, 
    sortBy = 'number', 
    sortOrder = 'asc',
    minPrice,
    maxPrice
  }: { 
    exhibitionId: string; 
    hallId?: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: number;
    maxPrice?: number;
  }, { rejectWithValue, getState }) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.getStalls(exhibitionId, hallId, {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice
      });
      
      // Return both the response data and the hallId for proper state management
      return {
        ...response.data,
        hallId
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExhibition = createAsyncThunk(
  'exhibition/deleteExhibition',
  async (id: string, { rejectWithValue }) => {
    try {
      await exhibitionService.deleteExhibition(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFixtures = createAsyncThunk(
  'exhibition/fetchFixtures',
  async ({ exhibitionId, type }: { exhibitionId: string; type?: string }, { rejectWithValue }) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.getFixtures(exhibitionId, type);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFixture = createAsyncThunk(
  'exhibition/createFixture',
  async ({ exhibitionId, data }: { exhibitionId: string; data: Partial<Fixture> }, { rejectWithValue }) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.createFixture(exhibitionId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFixture = createAsyncThunk(
  'exhibition/updateFixture',
  async ({ exhibitionId, id, data }: { exhibitionId: string; id: string; data: Partial<Fixture> }, { rejectWithValue }) => {
    try {
      if (!exhibitionId || !id) {
        throw new Error('Exhibition ID and Fixture ID are required');
      }
      const response = await exhibitionService.updateFixture(exhibitionId, id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFixture = createAsyncThunk(
  'exhibition/deleteFixture',
  async ({ exhibitionId, id }: { exhibitionId: string; id: string }, { rejectWithValue }) => {
    try {
      if (!exhibitionId || !id) {
        throw new Error('Exhibition ID and Fixture ID are required');
      }
      await exhibitionService.deleteFixture(exhibitionId, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const exhibitionSlice = createSlice({
  name: 'exhibition',
  initialState,
  reducers: {
    clearCurrentExhibition: (state) => {
      state.currentExhibition = null;
      state.halls = [];
      state.stalls = [];
      state.fixtures = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStalls: (state) => {
      state.stalls = [];
      state.stallsPagination = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        pageSize: 10,
        hasNextPage: false,
        hasPrevPage: false,
        startIndex: 0,
        endIndex: 0,
      };
    },
    clearFixtures: (state) => {
      state.fixtures = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch exhibitions
      .addCase(fetchExhibitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExhibitions.fulfilled, (state, action) => {
        state.loading = false;
        state.exhibitions = action.payload;
      })
      .addCase(fetchExhibitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch active exhibitions
      .addCase(fetchActiveExhibitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveExhibitions.fulfilled, (state, action) => {
        state.loading = false;
        state.activeExhibitions = action.payload;
      })
      .addCase(fetchActiveExhibitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch all exhibitions for assignment
      .addCase(fetchAllExhibitionsForAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExhibitionsForAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.exhibitions = action.payload;
      })
      .addCase(fetchAllExhibitionsForAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single exhibition
      .addCase(fetchExhibition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExhibition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExhibition = action.payload;
      })
      .addCase(fetchExhibition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create exhibition
      .addCase(createExhibition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExhibition.fulfilled, (state, action) => {
        state.loading = false;
        state.exhibitions.push(action.payload);
      })
      .addCase(createExhibition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update exhibition
      .addCase(updateExhibition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExhibition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExhibition = action.payload;
        const index = state.exhibitions.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.exhibitions[index] = action.payload;
        }
      })
      .addCase(updateExhibition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch halls
      .addCase(fetchHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = action.payload;
      })
      .addCase(fetchHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stalls
      .addCase(fetchStalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStalls.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle both old format (array) and new format (object with stalls and pagination)
        const payload = action.payload as any;
        const isNewFormat = payload && typeof payload === 'object' && 'stalls' in payload;
        const stallsData = isNewFormat ? payload.stalls : payload;
        const paginationData = isNewFormat ? payload.pagination : null;
        const hallId = payload.hallId;
        
        // Process stalls with proper type handling
        const processedStalls = (Array.isArray(stallsData) ? stallsData : []).map((stall: any) => ({
          ...stall,
          id: stall._id || stall.id,
          _id: stall._id || stall.id,
          // Ensure hallId is a string for proper comparison
          hallId: typeof stall.hallId === 'string' ? stall.hallId : stall.hallId?.toString() || stall.hallId,
          // Ensure stallTypeId is preserved
          stallTypeId: typeof stall.stallTypeId === 'string' ? stall.stallTypeId : stall.stallTypeId?._id,
          // Keep the stall type information
          stallType: stall.stallType || {
            name: 'N/A',
            description: null
          }
        }));

        if (hallId) {
          // If fetching for a specific hall, merge with existing stalls from other halls
          const existingStallsFromOtherHalls = state.stalls.filter(stall => {
            const stallHallId = typeof stall.hallId === 'string' ? stall.hallId : String(stall.hallId || '');
            return stallHallId !== hallId;
          });
          
          // Combine stalls: existing stalls from other halls + new stalls from current hall
          state.stalls = [...existingStallsFromOtherHalls, ...processedStalls];
        } else {
          // If fetching all stalls (no specific hall), replace entirely
          state.stalls = processedStalls;
        }
        
        // Update pagination if available
        if (paginationData) {
          state.stallsPagination = paginationData;
        }
      })
      .addCase(fetchStalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete exhibition
      .addCase(deleteExhibition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExhibition.fulfilled, (state, action) => {
        state.loading = false;
        state.exhibitions = state.exhibitions.filter(
          exhibition => (exhibition._id || exhibition.id) !== action.payload
        );
      })
      .addCase(deleteExhibition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch fixtures
      .addCase(fetchFixtures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFixtures.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize fixture data to ensure consistent IDs
        state.fixtures = action.payload.map(fixture => ({
          ...fixture,
          id: fixture._id || fixture.id,
          _id: fixture._id || fixture.id
        }));
      })
      .addCase(fetchFixtures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create fixture
      .addCase(createFixture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFixture.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize the new fixture to ensure consistent IDs
        const normalizedFixture = {
          ...action.payload,
          id: action.payload._id || action.payload.id,
          _id: action.payload._id || action.payload.id
        };
        state.fixtures.push(normalizedFixture);
      })
      .addCase(createFixture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update fixture
      .addCase(updateFixture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFixture.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize the updated fixture to ensure consistent IDs
        const normalizedFixture = {
          ...action.payload,
          id: action.payload._id || action.payload.id,
          _id: action.payload._id || action.payload.id
        };
        
        // Find using either id or _id
        const index = state.fixtures.findIndex(f => 
          (f.id === normalizedFixture.id) || (f._id === normalizedFixture._id)
        );
        
        if (index !== -1) {
          state.fixtures[index] = normalizedFixture;
        }
      })
      .addCase(updateFixture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete fixture
      .addCase(deleteFixture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFixture.fulfilled, (state, action) => {
        state.loading = false;
        state.fixtures = state.fixtures.filter(f => 
          f.id !== action.payload && f._id !== action.payload
        );
      })
      .addCase(deleteFixture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentExhibition, clearError, clearStalls, clearFixtures } = exhibitionSlice.actions;
export default exhibitionSlice.reducer; 