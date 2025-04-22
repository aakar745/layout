import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log all incoming API requests for debugging
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log basic request information
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  
  // Log headers if needed for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[HEADERS] ${JSON.stringify(req.headers, null, 2)}`);
  }
  
  // Log request body for debugging
  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log passwords
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.confirmPassword) sanitizedBody.confirmPassword = '[REDACTED]';
    
    console.log(`[BODY] ${JSON.stringify(sanitizedBody, null, 2)}`);
  }
  
  // Custom response logging to track responses
  const originalSend = res.send;
  res.send = function(body: any): Response {
    console.log(`[RESPONSE] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    
    // Call the original send method and return its result
    return originalSend.call(this, body);
  };
  
  next();
}; 