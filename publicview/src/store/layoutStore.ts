import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  Layout, 
  Stall, 
  CanvasState, 
  StallBookingData, 
  StallFilters, 
  LayoutViewConfig,
  LayoutStats,
  StallUpdate 
} from '@/lib/types/layout';

interface LayoutState {
  // Layout data
  layout: Layout | null;
  loading: boolean;
  error: string | null;
  
  // Canvas state
  canvas: CanvasState;
  viewConfig: LayoutViewConfig;
  
  // Stall selection and booking
  selectedStalls: Stall[];
  bookingData: Partial<StallBookingData>;
  isBookingModalOpen: boolean;
  bookingLoading: boolean;
  bookingError: string | null;
  
  // Filters and search
  filters: StallFilters;
  searchTerm: string;
  
  // Statistics
  stats: LayoutStats | null;
  
  // Real-time updates
  isConnected: boolean;
  lastUpdate: string | null;

  // Actions
  setLayout: (layout: Layout) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Canvas actions
  updateCanvasState: (updates: Partial<CanvasState>) => void;
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  resetCanvas: () => void;
  
  // Stall selection actions
  selectStall: (stallId: string) => void;
  deselectStall: (stallId: string) => void;
  toggleStallSelection: (stallId: string) => void;
  clearSelection: () => void;
  selectMultipleStalls: (stallIds: string[]) => void;
  setHoveredStall: (stallId: string | null) => void;
  
  // Booking actions
  openBookingModal: () => void;
  closeBookingModal: () => void;
  updateBookingData: (data: Partial<StallBookingData>) => void;
  setBookingLoading: (loading: boolean) => void;
  setBookingError: (error: string | null) => void;
  resetBooking: () => void;
  
  // Filter actions
  updateFilters: (filters: Partial<StallFilters>) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
  
  // View config actions
  updateViewConfig: (config: Partial<LayoutViewConfig>) => void;
  
  // Real-time actions
  setConnectionStatus: (connected: boolean) => void;
  applyStallUpdate: (update: StallUpdate) => void;
  applyLayoutUpdate: (update: { type: string; stall?: Partial<Stall>; [key: string]: unknown }) => void;
  
  // Export actions
  exportCanvasAsImage: () => Promise<void>;
  
  // Computed values
  getFilteredStalls: () => Stall[];
  getSelectedStallsTotal: () => number;
  canSelectStall: (stallId: string) => boolean;
}

const initialCanvas: CanvasState = {
  scale: 1,
  position: { x: 0, y: 0 },
  selectedStalls: [],
  hoveredStall: null,
  isSelecting: false,
};

const initialFilters: StallFilters = {
  status: 'all',
  priceRange: { min: 0, max: Infinity },
};

const initialViewConfig: LayoutViewConfig = {
  showGrid: false,              // PERFORMANCE: Exhibition space grid disabled by default (saves 200+ line renders)
  showHallGrids: false,          // Hall internal grids enabled (useful and lightweight)
  showStallNumbers: true,
  showDimensions: false,        // Stall dimensions (off by default for performance, user can enable)
  showFixtures: true,           // Layout structures (stages, pillars, displays, etc.)
  colorScheme: 'default',
};

export const useLayoutStore = create<LayoutState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    layout: null,
    loading: false,
    error: null,
    canvas: initialCanvas,
    viewConfig: initialViewConfig,
    selectedStalls: [],
    bookingData: {},
    isBookingModalOpen: false,
    bookingLoading: false,
    bookingError: null,
    filters: initialFilters,
    searchTerm: '',
    stats: null,
    isConnected: false,
    lastUpdate: null,

    // Layout actions
    setLayout: (layout) => {
      set({ layout });
      
      // Calculate stats when layout is set
      if (layout && layout.halls && Array.isArray(layout.halls)) {
        const allStalls = layout.halls.flatMap(hall => hall.stalls || []);
        const stats: LayoutStats = {
          totalStalls: allStalls.length,
          availableStalls: allStalls.filter(s => s.status === 'available').length,
          bookedStalls: allStalls.filter(s => s.status === 'booked').length,
          reservedStalls: allStalls.filter(s => s.status === 'reserved').length,
          unavailableStalls: allStalls.filter(s => s.status === 'unavailable').length,
          totalRevenue: allStalls.filter(s => s.status === 'booked').reduce((sum, s) => sum + s.price, 0),
          averagePrice: allStalls.length > 0 ? allStalls.reduce((sum, s) => sum + s.price, 0) / allStalls.length : 0,
          occupancyRate: allStalls.length > 0 ? (allStalls.filter(s => s.status === 'booked').length / allStalls.length) * 100 : 0,
        };
        set({ stats });
      }
    },
    
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Canvas actions
    updateCanvasState: (updates) => 
      set(state => ({ canvas: { ...state.canvas, ...updates } })),
    
    setScale: (scale) => 
      set(state => ({ canvas: { ...state.canvas, scale } })),
    
    setPosition: (position) => 
      set(state => ({ canvas: { ...state.canvas, position } })),
    
    resetCanvas: () => set({ canvas: initialCanvas }),

    // Stall selection actions
    selectStall: (stallId) => {
      const { layout, canSelectStall } = get();
      if (!layout || !layout.halls || !canSelectStall(stallId)) return;
      
      const stall = layout.halls
        .flatMap(hall => hall.stalls || [])
        .find(s => (s._id || s.id) === stallId);
      
      if (stall) {
        set(state => ({
          selectedStalls: [...state.selectedStalls, stall],
          canvas: {
            ...state.canvas,
            selectedStalls: [...state.canvas.selectedStalls, stallId]
          }
        }));
      }
    },

    deselectStall: (stallId) => 
      set(state => ({
        selectedStalls: state.selectedStalls.filter(s => (s._id || s.id) !== stallId),
        canvas: {
          ...state.canvas,
          selectedStalls: state.canvas.selectedStalls.filter(id => id !== stallId)
        }
      })),

    toggleStallSelection: (stallId) => {
      const { canvas, selectStall, deselectStall } = get();
      if (canvas.selectedStalls.includes(stallId)) {
        deselectStall(stallId);
      } else {
        selectStall(stallId);
      }
    },

    clearSelection: () => 
      set(state => ({
        selectedStalls: [],
        canvas: { ...state.canvas, selectedStalls: [] }
      })),

    selectMultipleStalls: (stallIds) => {
      const { layout } = get();
      if (!layout || !layout.halls) return;
      
      const stalls = layout.halls
        .flatMap(hall => hall.stalls || [])
        .filter(s => stallIds.includes(s._id || s.id || '') && s.status === 'available');
      
      set(state => ({
        selectedStalls: [...state.selectedStalls, ...stalls],
        canvas: {
          ...state.canvas,
          selectedStalls: [...state.canvas.selectedStalls, ...stallIds]
        }
      }));
    },

    setHoveredStall: (stallId) => 
      set(state => ({ canvas: { ...state.canvas, hoveredStall: stallId } })),

    // Booking actions
    openBookingModal: () => set({ isBookingModalOpen: true }),
    closeBookingModal: () => set({ isBookingModalOpen: false, bookingError: null }),
    
    updateBookingData: (data) => 
      set(state => ({ bookingData: { ...state.bookingData, ...data } })),
    
    setBookingLoading: (bookingLoading) => set({ bookingLoading }),
    setBookingError: (bookingError) => set({ bookingError }),
    
    resetBooking: () => set({
      bookingData: {},
      isBookingModalOpen: false,
      bookingLoading: false,
      bookingError: null,
      selectedStalls: [],
      canvas: { ...get().canvas, selectedStalls: [] }
    }),

    // Filter actions
    updateFilters: (filterUpdates) => 
      set(state => ({ filters: { ...state.filters, ...filterUpdates } })),
    
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    resetFilters: () => set({ filters: initialFilters, searchTerm: '' }),

    // View config actions
    updateViewConfig: (configUpdates) => 
      set(state => ({ viewConfig: { ...state.viewConfig, ...configUpdates } })),

    // Real-time actions
    setConnectionStatus: (isConnected) => set({ isConnected }),
    
    applyStallUpdate: (update) => {
      set(state => {
        if (!state.layout || !state.layout.halls) return state;
        
        const updatedLayout = {
          ...state.layout,
          halls: state.layout.halls.map(hall => ({
            ...hall,
            stalls: (hall.stalls || []).map(stall => 
              stall._id === update.stallId
                ? { 
                    ...stall, 
                    status: update.status,
                    bookingInfo: update.exhibitorName ? {
                      exhibitorName: update.exhibitorName,
                      companyName: update.companyName,
                      bookingDate: update.timestamp
                    } : undefined
                  }
                : stall
            )
          }))
        };
        
        return {
          ...state,
          layout: updatedLayout,
          lastUpdate: update.timestamp
        };
      });
    },

    applyLayoutUpdate: (update) => {
      set(state => {
        if (!state.layout || !state.layout.halls) return state;
        
        console.log('Applying layout update:', update);
        
        if (update.type === 'stall_updated' && update.stall) {
          // Handle stall property updates (number, dimensions, position, etc.)
          const updatedLayout = {
            ...state.layout,
            halls: state.layout.halls.map(hall => ({
              ...hall,
              stalls: (hall.stalls || []).map(stall => 
                stall._id === update.stall?._id
                  ? { 
                      ...stall, 
                      ...(update.stall || {}), // Apply all updated properties
                      id: stall.id || stall._id, // Preserve id consistency
                      _id: stall._id // Preserve _id
                    }
                  : stall
              )
            }))
          };
          
        return {
          layout: updatedLayout,
          lastUpdate: typeof update.timestamp === 'string' ? update.timestamp : null
        };
        } 
        else if (update.type === 'stall_deleted') {
          // Handle stall deletion
          const updatedLayout = {
            ...state.layout,
            halls: state.layout.halls.map(hall => ({
              ...hall,
              stalls: (hall.stalls || []).filter(stall => 
                stall._id !== update.stallId
              )
            }))
          };
          
          // Also remove from selected stalls if it was selected
          const filteredSelectedStalls = state.selectedStalls.filter(stall => 
            stall._id !== update.stallId
          );
          const filteredCanvasSelectedStalls = state.canvas.selectedStalls.filter(id => 
            id !== update.stallId
          );
          
          return {
            layout: updatedLayout,
            selectedStalls: filteredSelectedStalls,
            canvas: {
              ...state.canvas,
              selectedStalls: filteredCanvasSelectedStalls
            },
            lastUpdate: typeof update.timestamp === 'string' ? update.timestamp : null
          };
        }
        
        // For other update types, just update the timestamp
        return {
          lastUpdate: typeof update.timestamp === 'string' ? update.timestamp : null
        };
      });
    },

    // Computed values
    getFilteredStalls: () => {
      const { layout, filters, searchTerm } = get();
      if (!layout || !layout.halls || !Array.isArray(layout.halls)) return [];
      
      let stalls = layout.halls.flatMap(hall => hall.stalls || []);
      
      // Apply status filter
      if (filters.status !== 'all') {
        stalls = stalls.filter(stall => stall.status === filters.status);
      }
      
      // Apply price range filter
      stalls = stalls.filter(stall => 
        stall.price >= filters.priceRange.min && 
        stall.price <= filters.priceRange.max
      );
      
      // Apply category filter
      if (filters.category) {
        stalls = stalls.filter(stall => stall.category === filters.category);
      }
      
      // Apply amenities filter
      if (filters.hasAmenities && filters.hasAmenities.length > 0) {
        stalls = stalls.filter(stall => 
          stall.amenities && 
          filters.hasAmenities!.every(amenity => stall.amenities!.includes(amenity))
        );
      }
      
      // Apply size filter
      if (filters.minSize) {
        stalls = stalls.filter(stall => 
          (stall.dimensions.width * stall.dimensions.height) >= filters.minSize!
        );
      }
      
      // Apply search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        stalls = stalls.filter(stall =>
          stall.stallNumber.toLowerCase().includes(term) ||
          stall.category?.toLowerCase().includes(term) ||
          stall.amenities?.some(amenity => amenity.toLowerCase().includes(term))
        );
      }
      
      return stalls;
    },

    getSelectedStallsTotal: () => {
      const { selectedStalls } = get();
      return selectedStalls.reduce((total, stall) => total + stall.price, 0);
    },

    canSelectStall: (stallId) => {
      const { layout, canvas } = get();
      if (!layout || !layout.halls) return false;
      
      const stall = layout.halls
        .flatMap(hall => hall.stalls || [])
        .find(s => (s._id || s.id) === stallId);
      
      return stall?.status === 'available' && !canvas.selectedStalls.includes(stallId);
    },

    // Export canvas as image
    exportCanvasAsImage: async () => {
      // This will be called from LayoutHeader, implementation will be provided by LayoutCanvas
      const canvasExportFn = (window as any).__layoutCanvasExport;
      if (canvasExportFn) {
        await canvasExportFn();
      } else {
        console.warn('Canvas export function not available. Make sure LayoutCanvas is loaded.');
      }
    },
  }))
);

// Selectors for performance optimization
export const useLayout = () => useLayoutStore(state => state.layout);
export const useLayoutLoading = () => useLayoutStore(state => state.loading);
export const useCanvasState = () => useLayoutStore(state => state.canvas);
export const useSelectedStalls = () => useLayoutStore(state => state.selectedStalls);
export const useLayoutStats = () => useLayoutStore(state => state.stats);
export const useBookingModal = () => useLayoutStore(state => ({
  isOpen: state.isBookingModalOpen,
  loading: state.bookingLoading,
  error: state.bookingError,
  data: state.bookingData
}));
