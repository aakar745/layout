import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import exhibitionService, { Exhibition, Hall, Stall, Fixture } from '../../services/exhibition';

interface ExhibitionState {
  exhibitions: Exhibition[];
  currentExhibition: Exhibition | null;
  halls: Hall[];
  stalls: Stall[];
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
}

const initialState: ExhibitionState = {
  exhibitions: [],
  currentExhibition: null,
  halls: [],
  stalls: [],
  fixtures: [],
  loading: false,
  error: null,
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
  async ({ exhibitionId, hallId }: { exhibitionId: string; hallId?: string }, { rejectWithValue }) => {
    try {
      if (!exhibitionId) {
        throw new Error('Exhibition ID is required');
      }
      const response = await exhibitionService.getStalls(exhibitionId, hallId);
      return response.data;
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
        // Process stalls with proper type handling
        const processedStalls = action.payload.map(stall => ({
          ...stall,
          id: stall._id || stall.id,
          _id: stall._id || stall.id,
          // Ensure stallTypeId is preserved
          stallTypeId: typeof stall.stallTypeId === 'string' ? stall.stallTypeId : stall.stallTypeId?._id,
          // Keep the stall type information
          stallType: stall.stallType || {
            name: 'N/A',
            description: null
          }
        }));

        // Simply replace stalls for the selected hall
        if (action.meta.arg.hallId) {
          state.stalls = processedStalls;
        } else {
          // If no hallId specified (fetching all stalls), replace everything
          state.stalls = processedStalls;
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