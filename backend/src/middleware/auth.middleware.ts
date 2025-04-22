import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { IRole } from '../models/role.model';

interface TokenPayload {
  userId?: string;
  id?: string;
  type?: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      skipDefaultAuth?: boolean;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  // Skip authentication for exhibitor auth public routes or if skipDefaultAuth flag is set
  if (req.skipDefaultAuth || 
      (req.originalUrl.startsWith('/api/exhibitor/auth') && 
       (req.originalUrl.endsWith('/register') || 
        req.originalUrl.endsWith('/login') ||
        req.originalUrl.includes('/reset-password') ||
        req.originalUrl.endsWith('/forgot-password')))) {
    return next();
  }

  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      // Check if this is an exhibitor token before validation
      try {
        const payload = jwt.decode(token) as TokenPayload;
        if (payload && payload.type === 'exhibitor') {
          // Skip admin auth for exhibitor tokens
          return next();
        }
      } catch (e) {
        // Continue with normal verification if payload check fails
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      
      const userIdFromToken = decoded.userId || decoded.id;
      
      if (!userIdFromToken) {
        return res.status(401).json({ message: 'Invalid token format' });
      }
      
      const user = await User.findById(userIdFromToken).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?._id).populate('role');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const userRole = user.role as unknown as IRole;
      const hasPermission = permissions.some(permission => 
        userRole.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Not authorized to perform this action' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 