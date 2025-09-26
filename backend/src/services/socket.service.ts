import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let io: SocketIOServer | null = null;

interface DecodedToken {
  id?: string;
  userId?: string;
  isExhibitor?: boolean;
  exp: number;
}

/**
 * Initialize the Socket.IO server
 * @param server HTTP server instance
 */
export const initializeSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow all origins in development
        console.log('Socket connection attempt from origin:', origin);
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
    allowEIO3: true, // Support older clients
    connectTimeout: 20000,
    pingTimeout: 30000,
    pingInterval: 25000
  });

  // Authentication middleware - supports public read-only access
  io.use((socket, next) => {
    try {
      // Log complete handshake data for debugging
      console.log('Socket connection handshake:', {
        id: socket.id,
        handshakeAuth: socket.handshake.auth ? JSON.stringify(socket.handshake.auth) : 'none',
        headers: socket.handshake.headers ? JSON.stringify(socket.handshake.headers) : 'none',
        query: socket.handshake.query
      });
      
      // Check different possible token locations
      const token = socket.handshake.auth?.token || 
                   socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
                   socket.handshake.query?.token;
      const authType = socket.handshake.auth?.type || 'admin';
      
      console.log('Socket connection attempt:', { 
        authType,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      });
      
      // Allow public connections for read-only access
      if (!token) {
        if (authType === 'public') {
          console.log('Public socket connection allowed for read-only access');
          socket.data.user = {
            id: 'public',
            isPublic: true,
            isExhibitor: false
          };
          return next();
        } else {
          console.error('Authentication error: Token missing in socket connection');
          return next(new Error('Authentication error: Token missing'));
        }
      }

      // Verify the token for authenticated users
      const adminSecret = process.env.JWT_SECRET || 'defaultsecret';
      const exhibitorSecret = process.env.EXHIBITOR_JWT_SECRET || 'exhibitorsecret';
      
      const secretToUse = authType === 'exhibitor' ? exhibitorSecret : adminSecret;
      console.log('Using secret for type:', authType);
      
      try {
        // Verify token with appropriate secret based on auth type
        const decoded = jwt.verify(token, secretToUse) as DecodedToken;
        console.log('Token decoded successfully:', { 
          userId: decoded.id || decoded.userId,
          expiresAt: new Date(decoded.exp * 1000).toISOString()
        });
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.error('Socket token expired for user:', decoded.id || decoded.userId);
          return next(new Error('Authentication error: Token expired'));
        }
        
        // Get the user ID (handle both id and userId fields)
        const actualUserId = decoded.id || decoded.userId;
        if (!actualUserId) {
          console.error('Token does not contain a valid user ID');
          return next(new Error('Authentication error: Token missing user ID'));
        }
        
        // Add user data to socket
        socket.data.user = {
          id: actualUserId,
          isExhibitor: authType === 'exhibitor',
          isPublic: false
        };
        
        console.log(`Socket authenticated for ${authType} user:`, actualUserId);
        return next();
      } catch (err: any) {
        console.error('Socket token verification failed:', err.message);
        return next(new Error('Authentication error: Invalid token'));
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
      return next(new Error('Authentication error'));
    }
  });

  // Handle connection
  io.on('connection', (socket) => {
    const userId = socket.data.user?.id;
    const isExhibitor = socket.data.user?.isExhibitor;
    const isPublic = socket.data.user?.isPublic;
    
    if (!userId) {
      console.error('Socket connection without user ID');
      socket.disconnect();
      return;
    }
    
    const userType = isPublic ? 'Public' : (isExhibitor ? 'Exhibitor' : 'Admin');
    console.log(`User connected: ${userId} (${userType})`);
    
    // Only authenticated users get user-specific rooms
    if (!isPublic) {
      // Join user-specific room for targeted notifications
      const userRoom = `user-${userId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined room: ${userRoom}`);
      
      // Join role-based room
      const roleRoom = isExhibitor ? 'exhibitors' : 'admins';
      socket.join(roleRoom);
      console.log(`User ${userId} joined room: ${roleRoom}`);
    }
    
    // Handle exhibition room joining (available for all users including public)
    socket.on('joinExhibition', (exhibitionId) => {
      if (!exhibitionId) {
        console.error('Exhibition ID missing for joinExhibition');
        return;
      }
      const exhibitionRoom = `exhibition-${exhibitionId}`;
      socket.join(exhibitionRoom);
      console.log(`User ${userId} (${userType}) joined exhibition room: ${exhibitionRoom}`);
    });

    // Handle exhibition room leaving
    socket.on('leaveExhibition', (exhibitionId) => {
      if (!exhibitionId) {
        console.error('Exhibition ID missing for leaveExhibition');
        return;
      }
      const exhibitionRoom = `exhibition-${exhibitionId}`;
      socket.leave(exhibitionRoom);
      console.log(`User ${userId} (${userType}) left exhibition room: ${exhibitionRoom}`);
    });
    
    // Handle client listening for notifications (authenticated users only)
    if (!isPublic) {
      socket.on('subscribe_notifications', () => {
        console.log(`User ${userId} subscribed to notifications`);
      });
      
      socket.on('unsubscribe_notifications', () => {
        console.log(`User ${userId} unsubscribed from notifications`);
      });
    }
    
    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${userId}:`, error);
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${userId} (${userType}), reason: ${reason}`);
      
      // Clean up rooms (only if not public)
      if (!isPublic) {
        const userRoom = `user-${userId}`;
        const roleRoom = isExhibitor ? 'exhibitors' : 'admins';
        socket.leave(userRoom);
        socket.leave(roleRoom);
      }
    });
  });

  console.log('Socket.IO server initialized with advanced options');
  return io;
};

/**
 * Get the Socket.IO server instance
 */
export const getSocketInstance = (): SocketIOServer | null => {
  return io;
};

/**
 * Emit an event to all connected clients
 * @param event Event name
 * @param data Event data
 */
export const emitToAll = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Emit an event to a specific user
 * @param userId User ID
 * @param event Event name
 * @param data Event data
 */
export const emitToUser = (userId: string | mongoose.Types.ObjectId, event: string, data: any) => {
  if (io) {
    const userRoom = `user-${userId}`;
    io.to(userRoom).emit(event, data);
  }
};

/**
 * Emit an event to all admin users
 * @param event Event name
 * @param data Event data
 */
export const emitToAdmins = (event: string, data: any) => {
  if (io) {
    io.to('admins').emit(event, data);
  }
};

/**
 * Emit an event to all exhibitor users
 * @param event Event name
 * @param data Event data
 */
export const emitToExhibitors = (event: string, data: any) => {
  if (io) {
    io.to('exhibitors').emit(event, data);
  }
};

/**
 * Emit user deactivation event to force logout
 * @param userId User ID that was deactivated
 */
export const emitUserDeactivated = (userId: string | mongoose.Types.ObjectId) => {
  if (io) {
    const userRoom = `user-${userId}`;
    console.log(`Emitting user deactivation to room: ${userRoom}`);
    io.to(userRoom).emit('user_deactivated', {
      message: 'Your account has been deactivated. You will be logged out.',
      userId: userId.toString(),
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Emit an event to all users viewing a specific exhibition
 * @param exhibitionId Exhibition ID
 * @param event Event name
 * @param data Event data
 */
export const emitToExhibition = (exhibitionId: string | mongoose.Types.ObjectId, event: string, data: any) => {
  if (io) {
    const exhibitionRoom = `exhibition-${exhibitionId}`;
    console.log(`Emitting ${event} to exhibition room: ${exhibitionRoom}`);
    io.to(exhibitionRoom).emit(event, data);
  }
};

/**
 * Emit an event to all users with a specific role
 * @param role Role name (admins/exhibitors)
 * @param event Event name
 * @param data Event data
 */
export const emitToRole = (role: 'admins' | 'exhibitors', event: string, data: any) => {
  if (io) {
    console.log(`Emitting ${event} to role room: ${role}`);
    io.to(role).emit(event, data);
  }
};

/**
 * Emit stall status change to all viewers of an exhibition
 * @param exhibitionId Exhibition ID
 * @param stallData Updated stall data
 */
export const emitStallStatusChanged = (exhibitionId: string | mongoose.Types.ObjectId, stallData: any) => {
  const updateData = {
    exhibitionId: exhibitionId.toString(),
    stallId: stallData._id.toString(),
    stallNumber: stallData.number,
    status: stallData.status,
    companyName: stallData.companyName,
    timestamp: new Date().toISOString()
  };
  
  emitToExhibition(exhibitionId, 'stallStatusChanged', updateData);
  console.log(`Stall status update emitted for exhibition ${exhibitionId}, stall ${stallData.number}`);
};

/**
 * Emit stall booking event to all viewers of an exhibition
 * @param exhibitionId Exhibition ID
 * @param stallData Booked stall data
 * @param bookingData Booking information
 */
export const emitStallBooked = (exhibitionId: string | mongoose.Types.ObjectId, stallData: any, bookingData?: any) => {
  const updateData = {
    exhibitionId: exhibitionId.toString(),
    stallId: stallData._id.toString(),
    stallNumber: stallData.number,
    status: 'booked',
    companyName: bookingData?.companyName || stallData.companyName,
    bookedBy: bookingData?.customerName || bookingData?.companyName,
    timestamp: new Date().toISOString()
  };
  
  emitToExhibition(exhibitionId, 'stallBooked', updateData);
  console.log(`Stall booking event emitted for exhibition ${exhibitionId}, stall ${stallData.number}`);
};

/**
 * Emit layout update event to all viewers of an exhibition
 * @param exhibitionId Exhibition ID
 * @param updateData Layout update information
 */
export const emitLayoutUpdate = (exhibitionId: string | mongoose.Types.ObjectId, updateData: any) => {
  const eventData = {
    exhibitionId: exhibitionId.toString(),
    updateType: updateData.type || 'general',
    timestamp: new Date().toISOString(),
    ...updateData
  };
  
  emitToExhibition(exhibitionId, 'layoutUpdate', eventData);
  console.log(`Layout update emitted for exhibition ${exhibitionId}`);
};

/**
 * Emit booking created event to admins for real-time updates
 * This is used for both admin and exhibitor bookings
 * @param exhibitionId Exhibition ID
 * @param bookingData Booking information
 * @param bookingSource Source of booking (admin/exhibitor)
 */
export const emitBookingCreated = (exhibitionId: string | mongoose.Types.ObjectId, bookingData: any, bookingSource: 'admin' | 'exhibitor') => {
  const eventData = {
    exhibitionId: exhibitionId.toString(),
    bookingId: bookingData._id?.toString() || bookingData.id?.toString(),
    customerName: bookingData.customerName,
    companyName: bookingData.companyName,
    stallCount: bookingData.stallIds?.length || 0,
    amount: bookingData.amount,
    status: bookingData.status,
    source: bookingSource,
    timestamp: new Date().toISOString()
  };
  
  // Emit to all admins (not exhibition-specific since admins might be managing multiple exhibitions)
  emitToRole('admins', 'bookingCreated', eventData);
  
  // Also emit to exhibition-specific room for anyone viewing that exhibition
  emitToExhibition(exhibitionId, 'bookingCreated', eventData);
  
  console.log(`Booking created event emitted for exhibition ${exhibitionId}, source: ${bookingSource}`);
};

/**
 * Emit booking status update event to admins and exhibitors
 * @param exhibitionId Exhibition ID  
 * @param bookingData Updated booking information
 */
export const emitBookingStatusUpdate = (exhibitionId: string | mongoose.Types.ObjectId, bookingData: any) => {
  const eventData = {
    exhibitionId: exhibitionId.toString(),
    bookingId: bookingData._id?.toString() || bookingData.id?.toString(),
    status: bookingData.status,
    customerName: bookingData.customerName,
    companyName: bookingData.companyName,
    timestamp: new Date().toISOString()
  };
  
  // Emit to all admins
  emitToRole('admins', 'bookingStatusUpdate', eventData);
  
  // Emit to exhibition room
  emitToExhibition(exhibitionId, 'bookingStatusUpdate', eventData);
  
  // If there's an exhibitor ID, also emit to that specific exhibitor
  if (bookingData.exhibitorId) {
    emitToUser(bookingData.exhibitorId, 'bookingStatusUpdate', eventData);
  }
  
  console.log(`Booking status update emitted for exhibition ${exhibitionId}, new status: ${bookingData.status}`);
}; 