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

  // Authentication middleware
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
      
      if (!token) {
        console.error('Authentication error: Token missing in socket connection');
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify the token
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
          isExhibitor: authType === 'exhibitor'
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
    
    if (!userId) {
      console.error('Socket connection without user ID');
      socket.disconnect();
      return;
    }
    
    console.log(`User connected: ${userId} (${isExhibitor ? 'Exhibitor' : 'Admin'})`);
    
    // Join user-specific room for targeted notifications
    const userRoom = `user-${userId}`;
    socket.join(userRoom);
    console.log(`User ${userId} joined room: ${userRoom}`);
    
    // Join role-based room
    const roleRoom = isExhibitor ? 'exhibitors' : 'admins';
    socket.join(roleRoom);
    console.log(`User ${userId} joined room: ${roleRoom}`);
    
    // Handle client listening for notifications
    socket.on('subscribe_notifications', () => {
      console.log(`User ${userId} subscribed to notifications`);
    });
    
    // Handle client stopping notification listening
    socket.on('unsubscribe_notifications', () => {
      console.log(`User ${userId} unsubscribed from notifications`);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${userId}:`, error);
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${userId}, reason: ${reason}`);
      socket.leave(userRoom);
      socket.leave(roleRoom);
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