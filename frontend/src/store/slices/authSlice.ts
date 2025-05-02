import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Check for stored token and user data
const storedToken = localStorage.getItem('token');
const storedUserData = localStorage.getItem('user');
let storedUser = null;
try {
  storedUser = storedUserData && storedUserData !== 'undefined' ? JSON.parse(storedUserData) : null;
} catch (error) {
  console.error('Failed to parse user data from localStorage', error);
  // Clear invalid data
  localStorage.removeItem('user');
}

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  user: storedUser,
  token: storedToken,
  loading: false,
  error: null,
};

// Async thunk to refresh the current user data
export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh user data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Store in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Refresh user data
      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 