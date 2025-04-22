import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingsService, { Settings } from '../../services/settings';

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.getSettings();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (updatedSettings: Partial<Settings>, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateSettings(updatedSettings);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const uploadLogo = createAsyncThunk(
  'settings/uploadLogo',
  async (file: File, { dispatch, rejectWithValue }) => {
    try {
      const response = await settingsService.uploadLogo(file);
      
      // Update settings with the new logo path
      if (response.path) {
        await dispatch(updateSettings({ logo: response.path }));
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload logo');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload logo (just handle loading and error states)
      .addCase(uploadLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLogo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default settingsSlice.reducer; 