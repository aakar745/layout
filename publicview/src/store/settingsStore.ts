import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SiteSettings, fetchSiteSettings, checkLogoExists } from '@/lib/api/settings';

interface SettingsState {
  // State
  settings: SiteSettings | null;
  logoExists: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Track if we've completed initial load
  error: string | null;
  lastFetched: number | null;
  cacheVersion?: string; // Version tracking for cache invalidation
  
  // Actions
  fetchSettings: () => Promise<void>;
  checkLogo: () => Promise<void>;
  clearError: () => void;
  
  // Getters
  getSiteName: () => string;
  getFooterText: () => string;
  getLogoUrl: () => string | undefined;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Version key to force cache invalidation after API URL fixes
const CACHE_VERSION = '1.1';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: null,
      logoExists: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      lastFetched: null,
      cacheVersion: undefined,
      
      // Fetch site settings from API
      fetchSettings: async () => {
        const state = get();
        
        // Check if we have recent cached data and matching version
        if (
          state.settings && 
          state.lastFetched && 
          state.cacheVersion === CACHE_VERSION &&
          Date.now() - state.lastFetched < CACHE_DURATION
        ) {
          console.log('Using cached site settings');
          return;
        }
        
        // Log cache invalidation reason
        if (state.cacheVersion !== CACHE_VERSION) {
          console.log('🔄 Cache version mismatch, forcing refresh:', {
            stored: state.cacheVersion,
            current: CACHE_VERSION
          });
        }
        
        try {
          set({ isLoading: true, error: null });
          
          const settings = await fetchSiteSettings();
          
          set({ 
            settings,
            isLoading: false,
            isInitialized: true,
            error: null,
            lastFetched: Date.now(),
            cacheVersion: CACHE_VERSION
          });
          
          console.log('Site settings fetched:', settings);
          
          // Also check if logo exists
          get().checkLogo();
          
        } catch (error: unknown) {
          console.error('Error fetching site settings:', error);
          set({ 
            isLoading: false,
            isInitialized: true,
            error: error instanceof Error ? error.message : 'Failed to fetch site settings'
          });
        }
      },
      
      // Check if logo file exists
      checkLogo: async () => {
        try {
          const logoExists = await checkLogoExists();
          set({ logoExists });
          console.log('Logo exists:', logoExists);
        } catch (error) {
          console.error('Error checking logo:', error);
          set({ logoExists: false });
        }
      },
      
      // Clear error state
      clearError: () => set({ error: null }),
      
      // Getter for site name with fallback (matches backend default)
      getSiteName: () => {
        const state = get();
        return state.settings?.siteName || 'Exhibition Management System';
      },
      
      // Getter for footer text with fallback
      getFooterText: () => {
        const state = get();
        return state.settings?.footerText || '';
      },
      
      // Getter for logo URL
      getLogoUrl: () => {
        const state = get();
        return state.logoExists ? state.settings?.logoUrl : undefined;
      },
    }),
    {
      name: 'site-settings-storage',
      // Only persist essential data, not loading states
      partialize: (state) => ({
        settings: state.settings,
        logoExists: state.logoExists,
        isInitialized: state.isInitialized,
        lastFetched: state.lastFetched,
        cacheVersion: state.cacheVersion,
      }),
    }
  )
);

// Initialize settings on first load (client-side only)
if (typeof window !== 'undefined') {
  // Immediately fetch settings once hydration is complete
  const store = useSettingsStore.getState();
  
  // If not already initialized from cache, fetch immediately
  if (!store.isInitialized) {
    store.fetchSettings();
  }
}
