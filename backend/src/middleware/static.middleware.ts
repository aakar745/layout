import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protectStatic = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Allow public access to fixture icons
    if (req.path.includes('/fixtures/')) {
      console.log('Public access granted for fixture icon:', req.path);
      return next();
    }
    
    // Get token from query or header
    let token = req.query.token as string;

    // Check Authorization header if no query token
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    console.log('Static request:', {
      path: req.path,
      hasToken: !!token,
      authHeader: req.headers.authorization ? 'present' : 'absent'
    });

    if (!token) {
      console.log('No token provided for static file access');
      res.status(401).end('Unauthorized: No token provided');
      return;
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log('Token verified successfully for static file access');
      next();
    } catch (error) {
      console.log('Invalid token for static file access:', error);
      res.status(401).end('Unauthorized: Invalid token');
    }
  } catch (error) {
    console.error('Error in static middleware:', error);
    res.status(500).end('Server Error');
  }
}; 