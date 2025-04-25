import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExhibitorAuthState {
  isAuthenticated: boolean;
  exhibitor: any | null;
  token: string | null;
  showLoginModal: boolean;
  showForgotPasswordModal: boolean;
  loginContext: string | null;
}

// Check for stored token and exhibitor data
const storedToken = localStorage.getItem('exhibitor_token');
const storedExhibitor = localStorage.getItem('exhibitor') ? JSON.parse(localStorage.getItem('exhibitor')!) : null;

const initialState: ExhibitorAuthState = {
  isAuthenticated: !!storedToken,
  exhibitor: storedExhibitor,
  token: storedToken,
  showLoginModal: false,
  showForgotPasswordModal: false,
  loginContext: null,
};

const exhibitorAuthSlice = createSlice({
  name: 'exhibitorAuth',
  initialState,
  reducers: {
    setExhibitorCredentials: (state, action: PayloadAction<{ exhibitor: any; token: string }>) => {
      state.exhibitor = action.payload.exhibitor;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Store in localStorage
      localStorage.setItem('exhibitor_token', action.payload.token);
      localStorage.setItem('exhibitor', JSON.stringify(action.payload.exhibitor));
    },
    exhibitorLogout: (state) => {
      state.exhibitor = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem('exhibitor_token');
      localStorage.removeItem('exhibitor');
    },
    showLoginModal: (state, action: PayloadAction<string | undefined>) => {
      state.showLoginModal = true;
      state.showForgotPasswordModal = false;
      state.loginContext = action.payload || null;
    },
    hideLoginModal: (state) => {
      state.showLoginModal = false;
      state.loginContext = null;
    },
    showForgotPasswordModal: (state) => {
      state.showForgotPasswordModal = true;
      state.showLoginModal = false;
    },
    hideForgotPasswordModal: (state) => {
      state.showForgotPasswordModal = false;
    },
  },
});

export const { 
  setExhibitorCredentials, 
  exhibitorLogout, 
  showLoginModal, 
  hideLoginModal,
  showForgotPasswordModal,
  hideForgotPasswordModal 
} = exhibitorAuthSlice.actions;
export default exhibitorAuthSlice.reducer;
