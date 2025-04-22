import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Exhibitor from '../models/exhibitor.model';

// Extend the Request interface to include exhibitor property
declare global {
  namespace Express {
    interface Request {
      exhibitor?: {
        id: string;
        type: string;
      };
    }
  }
}

// Interface for decoded token payload
interface TokenPayload {
  id: string;
  type: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate exhibitor based on JWT token
 * Adds exhibitor info to req.exhibitor if token is valid
 */
export const authenticateExhibitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[EXHIBITOR AUTH] No valid authorization header');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('[EXHIBITOR AUTH] Token received:', token.substring(0, 15) + '...');
    
    const jwtSecret = process.env.EXHIBITOR_JWT_SECRET || 'exhibitorsecret';
    console.log('[EXHIBITOR AUTH] Using secret:', jwtSecret.substring(0, 5) + '...');

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
      
      console.log('[EXHIBITOR AUTH] Token decoded successfully:', decoded);
      
      // Check if token is for exhibitor type
      if (decoded.type !== 'exhibitor') {
        console.log('[EXHIBITOR AUTH] Invalid token type:', decoded.type);
        return res.status(401).json({ message: 'Invalid token type' });
      }

      // Check if exhibitor exists
      const exhibitor = await Exhibitor.findById(decoded.id);
      if (!exhibitor) {
        return res.status(401).json({ message: 'Exhibitor not found' });
      }

      // Check if exhibitor is active
      if (!exhibitor.isActive) {
        return res.status(401).json({ message: 'Exhibitor account is deactivated' });
      }
      
      // Add exhibitor info to request
      req.exhibitor = {
        id: decoded.id,
        type: decoded.type
      };
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
}; 