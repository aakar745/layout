'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { LayoutUpdate, StallUpdate } from '@/lib/types/layout';

class LayoutSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Fix: Only remove the trailing /api, not internal /api in domain
      const socketUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
      
      // Check for exhibitor authentication
      const exhibitorToken = localStorage.getItem('exhibitor_token');
      
      // Configure authentication based on user state
      const authConfig: any = {
        type: 'public' // Default to public access
      };
      
      // If user is authenticated as exhibitor, use exhibitor auth
      if (exhibitorToken) {
        authConfig.type = 'exhibitor';
        authConfig.token = exhibitorToken;
      }
      
      console.log('Socket connecting with auth:', { 
        type: authConfig.type, 
        hasToken: !!authConfig.token 
      });
      
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        forceNew: false,
        autoConnect: true,
        auth: authConfig
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected to layout service');
      this.reconnectAttempts = 0;
      this.emit('connection-established');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('connection-lost');
      
      if (reason === 'io server disconnect') {
        // Server disconnected, attempt to reconnect
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection-error', error);
      this.scheduleReconnect();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      this.emit('reconnected');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket failed to reconnect after maximum attempts');
      this.emit('reconnect-failed');
    });

    // Layout-specific events
    this.socket.on('stallStatusChanged', (data: StallUpdate) => {
      this.emit('stall-update', data);
    });

    this.socket.on('layoutUpdate', (data: LayoutUpdate) => {
      this.emit('layout-update', data);
    });

    this.socket.on('stallBooked', (data: StallUpdate) => {
      this.emit('stall-booked', data);
    });

    this.socket.on('stallReleased', (data: StallUpdate) => {
      this.emit('stall-released', data);
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket.connect();
      }
    }, delay);
  }

  public joinExhibition(exhibitionId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinExhibition', exhibitionId);
      console.log(`Joined exhibition room: ${exhibitionId}`);
    } else {
      console.warn('Socket not connected, cannot join exhibition');
    }
  }

  public leaveExhibition(exhibitionId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leaveExhibition', exhibitionId);
      console.log(`Left exhibition room: ${exhibitionId}`);
    }
  }

  public subscribeToStallUpdates(exhibitionId: string, callback: (update: StallUpdate) => void) {
    this.on('stall-update', callback);
    this.joinExhibition(exhibitionId);
  }

  public unsubscribeFromStallUpdates(exhibitionId: string, callback: (update: StallUpdate) => void) {
    this.off('stall-update', callback);
    this.leaveExhibition(exhibitionId);
  }

  public subscribeToLayoutUpdates(exhibitionId: string, callback: (update: any) => void) {
    this.on('layout-update', callback);
    this.joinExhibition(exhibitionId);
  }

  public unsubscribeFromLayoutUpdates(exhibitionId: string, callback: (update: any) => void) {
    this.off('layout-update', callback);
    this.leaveExhibition(exhibitionId);
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  public getConnectionState() {
    return {
      connected: this.isConnected(),
      id: this.socket?.id,
      transport: this.socket?.io.engine?.transport?.name,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  public updateAuthentication() {
    // Reconnect with updated authentication
    console.log('Updating socket authentication...');
    if (this.socket) {
      this.socket.disconnect();
    }
    // Reconnect with new auth state
    this.connect();
  }
}

// Singleton instance
let layoutSocketManager: LayoutSocketManager | null = null;

export function getLayoutSocket(): LayoutSocketManager | null {
  if (typeof window === 'undefined') {
    return null; // Return null on server side
  }
  
  if (!layoutSocketManager) {
    layoutSocketManager = new LayoutSocketManager();
  }
  return layoutSocketManager;
}

// React hook for using layout socket
export function useLayoutSocket(exhibitionId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  
  // Only initialize on client side
  const socket = typeof window !== 'undefined' ? getLayoutSocket() : null;
  
  // Subscribe to connection events and update state
  useEffect(() => {
    if (!socket) return;
    
    // Initial connection status
    setIsConnected(socket.isConnected());
    
    const handleConnectionEstablished = () => {
      console.log('Socket connection established - updating state');
      setIsConnected(true);
    };
    
    const handleConnectionLost = () => {
      console.log('Socket connection lost - updating state');
      setIsConnected(false);
    };
    
    const handleConnectionError = () => {
      console.log('Socket connection error - updating state');
      setIsConnected(false);
    };
    
    const handleReconnected = () => {
      console.log('Socket reconnected - updating state');
      setIsConnected(true);
    };
    
    // Subscribe to connection events
    socket.on('connection-established', handleConnectionEstablished);
    socket.on('connection-lost', handleConnectionLost);
    socket.on('connection-error', handleConnectionError);
    socket.on('reconnected', handleReconnected);
    
    // Cleanup
    return () => {
      socket.off('connection-established', handleConnectionEstablished);
      socket.off('connection-lost', handleConnectionLost);
      socket.off('connection-error', handleConnectionError);
      socket.off('reconnected', handleReconnected);
    };
  }, [socket]);
  
  const subscribeToUpdates = (callback: (update: StallUpdate) => void) => {
    if (socket && exhibitionId) {
      socket.subscribeToStallUpdates(exhibitionId, callback);
    }
  };

  const unsubscribeFromUpdates = (callback: (update: StallUpdate) => void) => {
    if (socket && exhibitionId) {
      socket.unsubscribeFromStallUpdates(exhibitionId, callback);
    }
  };

  const subscribeToLayoutUpdates = (callback: (update: any) => void) => {
    if (socket && exhibitionId) {
      socket.subscribeToLayoutUpdates(exhibitionId, callback);
    }
  };

  const unsubscribeFromLayoutUpdates = (callback: (update: any) => void) => {
    if (socket && exhibitionId) {
      socket.unsubscribeFromLayoutUpdates(exhibitionId, callback);
    }
  };

  const joinExhibition = () => {
    if (socket && exhibitionId) {
      socket.joinExhibition(exhibitionId);
    }
  };

  const leaveExhibition = () => {
    if (socket && exhibitionId) {
      socket.leaveExhibition(exhibitionId);
    }
  };

  return {
    socket,
    subscribeToUpdates,
    unsubscribeFromUpdates,
    subscribeToLayoutUpdates,
    unsubscribeFromLayoutUpdates,
    joinExhibition,
    leaveExhibition,
    isConnected,
    connectionState: socket?.getConnectionState() || { connected: false, reconnectAttempts: 0 },
  };
}
