import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import exhibitorService from '../../services/exhibitor';

// Define exhibitor interface
export interface Exhibitor {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
  isActive: boolean;
}

interface ExhibitorState {
  exhibitors: Exhibitor[];
  loading: boolean;
  error: string | null;
}

const initialState: ExhibitorState = {
  exhibitors: [],
  loading: false,
  error: null,
};

// Async thunk for fetching exhibitors
export const fetchExhibitors = createAsyncThunk(
  'exhibitors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exhibitorService.getExhibitors();
      return response.data;
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExhibitors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExhibitors.fulfilled,
        (state, action: PayloadAction<Exhibitor[]>) => {
          state.exhibitors = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchExhibitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exhibitorSlice.reducer;
