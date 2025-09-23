import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types matching backend exhibitor model
export interface Exhibitor {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  panNumber?: string;
  gstNumber?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  rejectionReason?: string;
  createdAt: string;
}

export interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  exhibitor: Exhibitor | null;
  token: string | null;
  
  // Modal state
  showLoginModal: boolean;
  showRegisterModal: boolean;
  showForgotPasswordModal: boolean;
  loginContext: string | null; // e.g., "stall-booking"
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCredentials: (exhibitor: Exhibitor, token: string) => void;
  logout: () => void;
  
  // Modal actions
  openLoginModal: (context?: string) => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility actions
  checkAuthStatus: () => boolean;
  isApproved: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      exhibitor: null,
      token: null,
      showLoginModal: false,
      showRegisterModal: false,
      showForgotPasswordModal: false,
      loginContext: null,
      isLoading: false,
      error: null,

      // Auth actions
      setCredentials: (exhibitor: Exhibitor, token: string) => {
        set({
          isAuthenticated: true,
          exhibitor,
          token,
          error: null,
        });
        
        // Store in localStorage for persistence
        localStorage.setItem('exhibitor_token', token);
        localStorage.setItem('exhibitor', JSON.stringify(exhibitor));
      },

      logout: () => {
        set({
          isAuthenticated: false,
          exhibitor: null,
          token: null,
          error: null,
        });
        
        // Clear localStorage
        localStorage.removeItem('exhibitor_token');
        localStorage.removeItem('exhibitor');
      },

      // Modal actions
      openLoginModal: (context?: string) => {
        set({
          showLoginModal: true,
          showRegisterModal: false,
          showForgotPasswordModal: false,
          loginContext: context || null,
          error: null,
        });
      },

      closeLoginModal: () => {
        set({
          showLoginModal: false,
          loginContext: null,
          error: null,
        });
      },

      openRegisterModal: () => {
        set({
          showRegisterModal: true,
          showLoginModal: false,
          showForgotPasswordModal: false,
          error: null,
        });
      },

      closeRegisterModal: () => {
        set({
          showRegisterModal: false,
          error: null,
        });
      },

      openForgotPasswordModal: () => {
        set({
          showForgotPasswordModal: true,
          showLoginModal: false,
          showRegisterModal: false,
          error: null,
        });
      },

      closeForgotPasswordModal: () => {
        set({
          showForgotPasswordModal: false,
          error: null,
        });
      },

      // UI actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility actions
      checkAuthStatus: () => {
        const state = get();
        return state.isAuthenticated && !!state.token && !!state.exhibitor;
      },

      isApproved: () => {
        const state = get();
        return state.exhibitor?.status === 'approved' && state.exhibitor?.isActive;
      },
    }),
    {
      name: 'exhibitor-auth', // localStorage key
      partialize: (state) => ({
        // Only persist auth data, not modal states
        isAuthenticated: state.isAuthenticated,
        exhibitor: state.exhibitor,
        token: state.token,
      }),
    }
  )
);

// Initialize auth state from localStorage on app start
export const initializeAuth = () => {
  const token = localStorage.getItem('exhibitor_token');
  const exhibitorData = localStorage.getItem('exhibitor');
  
  if (token && exhibitorData) {
    try {
      const exhibitor = JSON.parse(exhibitorData);
      useAuthStore.getState().setCredentials(exhibitor, token);
    } catch (error) {
      console.error('Failed to parse stored exhibitor data:', error);
      // Clear corrupted data
      localStorage.removeItem('exhibitor_token');
      localStorage.removeItem('exhibitor');
    }
  }
};
