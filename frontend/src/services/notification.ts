import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { apiUrl } from '../config';

// Types for notifications
export enum NotificationType {
  NEW_BOOKING = 'NEW_BOOKING',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SERVICE_CHARGE_PAYMENT = 'SERVICE_CHARGE_PAYMENT',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  EXHIBITION_UPDATE = 'EXHIBITION_UPDATE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  EXHIBITOR_MESSAGE = 'EXHIBITOR_MESSAGE',
  EXHIBITOR_REGISTERED = 'EXHIBITOR_REGISTERED'
}

export enum NotificationPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Notification {
  _id: string;
  recipient: string;
  recipientType: 'admin' | 'exhibitor';
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  entityId?: string;
  entityType?: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

// Notification response interface
export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    unreadCount: number;
  };
}

// Class to manage notification socket connections and API calls
class NotificationService {
  private socket: Socket | null = null;
  private subscribedToNotifications = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: { [key: string]: Array<(data: any) => void> } = {};
  private unreadCount = 0;
  private isExhibitor = false;
  private lastToken = '';

  // Initialize the socket connection
  public init(token: string, isExhibitor: boolean = false) {
    // If already connected with the same token and type, don't reinitialize
    if (this.socket?.connected && 
        this.lastToken === token && 
        this.isExhibitor === isExhibitor) {
      return;
    }
    
    this.isExhibitor = isExhibitor;
    this.lastToken = token;
    
    // If already connected, disconnect first
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear any reconnection timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      // Make sure token is a string and not undefined
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token provided for socket connection');
      }

      // Fix: Only remove the trailing /api, not internal /api in domain
      let serverUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
      
      // Pre-process token to ensure it's in the right format
      // Remove 'Bearer ' prefix if present (common mistake)
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      
      // Connect to the socket server with simplified auth
      this.socket = io(serverUrl, {
        auth: { 
          token: cleanToken,
          type: isExhibitor ? 'exhibitor' : 'admin'
        },
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 20000,
        autoConnect: true,
        // Add transport options to help with connection issues
        transports: ['polling', 'websocket']
      });

      // Setup connection event handlers
      this.socket.on('connect', this.handleConnect);
      this.socket.on('disconnect', this.handleDisconnect);
      this.socket.on('connect_error', this.handleConnectError);
      this.socket.on('error', this.handleError);
      this.socket.on('new_notification', this.handleNewNotification);
      this.socket.on('notification_update', this.handleNotificationUpdate);
      this.socket.on('user_deactivated', this.handleUserDeactivated);
      this.socket.on('service_charge_updated', this.handleServiceChargeUpdate);
    } catch (error) {
      console.error('Error initializing notification socket:', error);
      this.scheduleReconnect();
    }
  }

  // Handle successful connection
  private handleConnect = () => {
    // Use setTimeout to delay subscription slightly to avoid immediate disconnect
    setTimeout(() => {
      // Subscribe to notifications if needed
      if (this.subscribedToNotifications && this.socket) {
        this.socket.emit('subscribe_notifications');
      }
      
      // Fetch initial unread count
      this.fetchUnreadCount();
      
      // Emit connected event
      this.triggerEvent('connected', true);
    }, 500);
  };

  // Handle disconnection
  private handleDisconnect = (reason: string) => {
    // Emit disconnected event
    this.triggerEvent('disconnected', reason);
    
    // Only attempt to reconnect if it's a non-intentional disconnect
    // Don't reconnect if the client deliberately disconnected or if we're forcing a new connection
    if (reason !== 'io client disconnect' && reason !== 'transport close') {
      this.scheduleReconnect();
    }
  };

  // Handle connection errors
  private handleConnectError = (error: Error) => {
    console.error('Notification socket connection error:', error);
    this.scheduleReconnect();
  };

  // Handle errors
  private handleError = (error: Error) => {
    console.error('Notification socket error:', error);
    this.scheduleReconnect();
  };

  // Schedule reconnection after a delay
  private scheduleReconnect = () => {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        // Try to get a fresh token before reconnecting
        this.refreshAndReconnect();
        
        this.reconnectTimer = null;
      }, 5000);
    }
  };

  // Refresh auth token and reconnect
  private refreshAndReconnect = async () => {
    try {
      // Get the appropriate token based on user type
      const tokenKey = this.isExhibitor ? 'exhibitor_token' : 'token';
      const token = localStorage.getItem(tokenKey);
      
      if (token) {
        this.init(token, this.isExhibitor);
      } else {
        console.error(`No ${this.isExhibitor ? 'exhibitor' : 'admin'} token found for reconnection`);
      }
    } catch (error) {
      console.error('Error refreshing token for socket reconnection:', error);
    }
  };

  // Handle new notifications
  private handleNewNotification = (data: { notification: Notification, unreadCount: number }) => {
    this.unreadCount = data.unreadCount;
    
    // Trigger notification listeners
    this.triggerEvent('notification', data.notification);
    this.triggerEvent('unreadCount', this.unreadCount);
  };

  // Handle notification updates
  private handleNotificationUpdate = (data: { unreadCount: number, newNotifications?: Notification[] }) => {
    this.unreadCount = data.unreadCount;
    
    // Trigger unread count update event
    this.triggerEvent('unreadCount', this.unreadCount);
    
    // If there are new notifications, trigger notification events
    if (data.newNotifications && data.newNotifications.length > 0) {
      data.newNotifications.forEach(notification => {
        this.triggerEvent('notification', notification);
      });
    }
  };

  // Handle user deactivated event
  private handleUserDeactivated = (data: { message: string }) => {
    console.warn('User deactivated event received:', data.message);
    
    // Clear all tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('exhibitor_token');
    localStorage.removeItem('exhibitor');
    
    // Store the deactivation message for display on login page
    localStorage.setItem('loginMessage', data.message || 'Your account has been deactivated. Please contact the administrator.');
    
    // Disconnect socket
    this.disconnect();
    
    // Trigger logout event for any listeners
    this.triggerEvent('user_deactivated', data);
    
    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  // Handle service charge updates
  private handleServiceChargeUpdate = (data: any) => {
    console.log('🔄 [SOCKET] Service charge update received:', data);
    
    // Trigger service charge update event for any listeners
    this.triggerEvent('service_charge_updated', data);
  };

  // Subscribe to notifications
  public subscribeToNotifications() {
    this.subscribedToNotifications = true;
    if (this.socket && this.socket.connected) {
      this.socket.emit('subscribe_notifications');
    }
  }

  // Unsubscribe from notifications
  public unsubscribeFromNotifications() {
    this.subscribedToNotifications = false;
    if (this.socket && this.socket.connected) {
      this.socket.emit('unsubscribe_notifications');
    }
  }

  // Disconnect the socket
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Clear any reconnection timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.unreadCount = 0;
    this.subscribedToNotifications = false;
  }

  // Add event listener
  public addEventListener(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  public removeEventListener(event: string, callback: (data: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Trigger an event
  private triggerEvent(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in notification ${event} listener:`, error);
        }
      });
    }
  }

  // Get unread count
  public getUnreadCount() {
    return this.unreadCount;
  }

  // Fetch initial unread count
  public async fetchUnreadCount() {
    try {
      // Fix endpoint path - remove duplicate /api prefix
      const endpoint = this.isExhibitor ? 'notifications/exhibitor' : 'notifications/admin';
      const params = { limit: 1, page: 1, unreadOnly: true };
      
      // Get the appropriate token based on user type
      const tokenKey = this.isExhibitor ? 'exhibitor_token' : 'token';
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        console.error(`No ${this.isExhibitor ? 'exhibitor' : 'admin'} token available for notification requests`);
        return 0;
      }
      
      const response = await axios.get(endpoint, {
        baseURL: apiUrl,
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        this.unreadCount = response.data.data.unreadCount;
        this.triggerEvent('unreadCount', this.unreadCount);
        return this.unreadCount;
      }
      
      return 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Fetch notifications
  public async getNotifications(page = 1, limit = 10, unreadOnly = false): Promise<NotificationResponse> {
    try {
      // Fix endpoint path - remove duplicate /api prefix
      const endpoint = this.isExhibitor ? 'notifications/exhibitor' : 'notifications/admin';
      const params = { page, limit, unreadOnly };
      
      // Get the appropriate token based on user type
      const tokenKey = this.isExhibitor ? 'exhibitor_token' : 'token';
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        throw new Error(`No ${this.isExhibitor ? 'exhibitor' : 'admin'} token available for notification requests`);
      }
      
      const response = await axios.get(endpoint, {
        baseURL: apiUrl,
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return a valid response object on error to prevent UI breakage
      return {
        success: false,
        data: {
          notifications: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0
          },
          unreadCount: 0
        }
      };
    }
  }

  // Mark notification as read
  public async markAsRead(notificationId: string) {
    try {
      // Fix endpoint path - remove duplicate /api prefix
      const endpoint = this.isExhibitor 
        ? `notifications/exhibitor/mark-read/${notificationId}`
        : `notifications/admin/mark-read/${notificationId}`;
      
      // Get the appropriate token based on user type
      const tokenKey = this.isExhibitor ? 'exhibitor_token' : 'token';
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        throw new Error(`No ${this.isExhibitor ? 'exhibitor' : 'admin'} token available for notification requests`);
      }
      
      const response = await axios.put(endpoint, {}, {
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        this.unreadCount = response.data.data.unreadCount;
        this.triggerEvent('unreadCount', this.unreadCount);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  public async markAllAsRead() {
    try {
      // Fix endpoint path - remove duplicate /api prefix
      const endpoint = this.isExhibitor 
        ? 'notifications/exhibitor/mark-all-read'
        : 'notifications/admin/mark-all-read';
      
      // Get the appropriate token based on user type
      const tokenKey = this.isExhibitor ? 'exhibitor_token' : 'token';
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        throw new Error(`No ${this.isExhibitor ? 'exhibitor' : 'admin'} token available for notification requests`);
      }
      
      const response = await axios.put(endpoint, {}, {
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        this.unreadCount = 0;
        this.triggerEvent('unreadCount', this.unreadCount);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  public async deleteNotification(notificationId: string) {
    try {
      // Fix endpoint path - remove duplicate /api prefix
      const endpoint = this.isExhibitor 
        ? `notifications/exhibitor/${notificationId}`
        : `notifications/admin/${notificationId}`;
      
      const response = await axios.delete(endpoint, {
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(this.isExhibitor ? 'exhibitor_token' : 'token')}`
        }
      });
      
      if (response.data.success) {
        if (response.data.data.unreadCount !== undefined) {
          this.unreadCount = response.data.data.unreadCount;
          this.triggerEvent('unreadCount', this.unreadCount);
        }
        return response.data;
      }
      throw new Error('Failed to delete notification');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Delete all notifications
  public async deleteAllNotifications() {
    try {
      // Fix endpoint path - remove duplicate /api prefix
      const endpoint = this.isExhibitor 
        ? 'notifications/exhibitor/delete-all'
        : 'notifications/admin/delete-all';
      
      const response = await axios.delete(endpoint, {
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(this.isExhibitor ? 'exhibitor_token' : 'token')}`
        }
      });
      
      if (response.data.success) {
        this.unreadCount = 0;
        this.triggerEvent('unreadCount', this.unreadCount);
        return response.data;
      }
      throw new Error('Failed to delete all notifications');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService; 