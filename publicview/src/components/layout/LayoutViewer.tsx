'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { Layout } from '@/lib/types/layout';
import { useLayoutStore } from '@/store/layoutStore';
import { useLayoutSocket } from '@/lib/socket/layoutSocket';
import LayoutHeader from './LayoutHeader';
import LayoutCanvas from './canvas/LayoutCanvas';
import LayoutSelectionBar from './LayoutSelectionBar';
import LayoutControls from './LayoutControls';
import LayoutBreadcrumb from './LayoutBreadcrumb';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutViewerProps {
  exhibition: ExhibitionWithStats;
  layout: Layout;
  error: string | null;
}

export default function LayoutViewer({ 
  exhibition, 
  layout: initialLayout, 
  error 
}: LayoutViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(error);
  
  // Refs to prevent infinite loops and store stable references
  const lastConnectionStatus = useRef<boolean>(false);
  const socketHandlerRef = useRef<((update: any) => void) | null>(null);
  
  const {
    setLayout,
    setError,
    setConnectionStatus,
    applyStallUpdate,
    applyLayoutUpdate,
    isConnected,
    stats,
    selectedStalls
  } = useLayoutStore();
  
  const { 
    subscribeToUpdates, 
    unsubscribeFromUpdates,
    subscribeToLayoutUpdates,
    unsubscribeFromLayoutUpdates,
    isConnected: socketConnected 
  } = useLayoutSocket(exhibition._id);

  // Store socket functions in refs to prevent useEffect re-runs
  const subscribeRef = useRef(subscribeToUpdates);
  const unsubscribeRef = useRef(unsubscribeFromUpdates);
  const subscribeLayoutRef = useRef(subscribeToLayoutUpdates);
  const unsubscribeLayoutRef = useRef(unsubscribeFromLayoutUpdates);

  // Update refs when functions change
  subscribeRef.current = subscribeToUpdates;
  unsubscribeRef.current = unsubscribeFromUpdates;
  subscribeLayoutRef.current = subscribeToLayoutUpdates;
  unsubscribeLayoutRef.current = unsubscribeFromLayoutUpdates;

  // Stable update handlers
  const handleStallUpdate = useCallback((update: any) => {
    console.log('Received stall update:', update);
    applyStallUpdate(update);
  }, []); // Removed applyStallUpdate from deps - Zustand actions are stable

  const handleLayoutUpdate = useCallback((update: any) => {
    console.log('Received layout update:', update);
    applyLayoutUpdate(update);
  }, []); // Removed applyLayoutUpdate from deps - Zustand actions are stable

  // Initialize layout data (runs once)
  useEffect(() => {
    if (initialLayout) {
      setLayout(initialLayout);
      setIsLoaded(true);
    }
    if (error) {
      setError(error);
    }
  }, [initialLayout, error, setLayout, setError]);

  // Update connection status when socket connection changes
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    
    if (lastConnectionStatus.current !== socketConnected) {
      lastConnectionStatus.current = socketConnected;
      setConnectionStatus(socketConnected);
      console.log('Socket connection status updated:', socketConnected);
    }
  }, [socketConnected, setConnectionStatus]);

  // Setup socket subscription for real-time stall updates
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    
    if (socketConnected && exhibition._id) {
      console.log('Setting up stall update subscription for exhibition:', exhibition._id);
      
      // Clean up previous handler
      if (socketHandlerRef.current) {
        unsubscribeRef.current(socketHandlerRef.current);
      }
      
      // Set new handler
      socketHandlerRef.current = handleStallUpdate;
      subscribeRef.current(handleStallUpdate);
      
      return () => {
        console.log('Cleaning up stall update subscription');
        if (socketHandlerRef.current) {
          unsubscribeRef.current(socketHandlerRef.current);
          socketHandlerRef.current = null;
        }
      };
    }
  }, [socketConnected, exhibition._id, handleStallUpdate]);

  // Setup socket subscription for real-time layout updates
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    
    if (socketConnected && exhibition._id) {
      console.log('Setting up layout update subscription for exhibition:', exhibition._id);
      
      // Subscribe to layout updates
      subscribeLayoutRef.current(handleLayoutUpdate);
      
      return () => {
        console.log('Cleaning up layout update subscription');
        unsubscribeLayoutRef.current(handleLayoutUpdate);
      };
    }
  }, [socketConnected, exhibition._id, handleLayoutUpdate]);

  // Error state
  if (loadError && !initialLayout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Layout
          </h1>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading interactive layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8 lg:py-10">
        {/* Breadcrumb */}
        <LayoutBreadcrumb exhibition={exhibition} />

        {/* Header with exhibition info and stats */}
        <LayoutHeader 
          exhibition={exhibition} 
          stats={stats} 
          isConnected={isConnected}
        />

        {/* Selection Bar - Only appears when stalls are selected with proper spacing */}
        <div className={selectedStalls.length > 0 ? "mt-6 sm:mt-8 lg:mt-10" : ""}>
          <LayoutSelectionBar exhibition={exhibition} />
        </div>

        {/* Main layout interface - Full width canvas with conditional spacing */}
        <div className={selectedStalls.length > 0 ? "mt-6 sm:mt-8 lg:mt-10" : "mt-6 sm:mt-8 lg:mt-10"}>
          <div className="bg-white rounded-md shadow-lg overflow-hidden">
            {/* Controls */}
            <LayoutControls />
            
            {/* Interactive Canvas - Now takes full width */}
            <div className="relative">
              <LayoutCanvas />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
