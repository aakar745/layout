import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import http from 'http';
import connectDB from './config/db';
import { protectStatic } from './middleware/static.middleware';
import { requestLogger } from './middleware/requestLogger.middleware';
import jwt from 'jsonwebtoken';
import { errorHandler } from './middleware/error.middleware';
import { authenticateExhibitor } from './middleware/exhibitorAuth';
import { urlRewriteMiddleware } from './middleware/url-rewrite.middleware';
import { initializeSocket } from './services/socket.service';
import { initializeCleanupService } from './services/cleanup.service';
import { initializeLetterScheduler } from './services/letterScheduler.service';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import exhibitionRoutes from './routes/exhibition.routes';
import bookingRoutes from './routes/booking.routes';
import invoiceRoutes from './routes/invoice.routes';
import publicRoutes from './routes/public.routes';
import stallRoutes from './routes/stall.routes';
import stallTypeRoutes from './routes/stallType.routes';
import exhibitorRoutes from './routes/exhibitor.routes';
import exhibitorBookingRoutes from './routes/exhibitorBooking.routes';
import fixtureRoutes from './routes/fixture.routes';
import settingsRoutes from './routes/settings.routes';
import notificationRoutes from './routes/notification.routes';
import exhibitionLetterRoutes from './routes/exhibitionLetter.routes';
import activityRoutes from './routes/activity.routes';
import analyticsRoutes from './routes/analytics.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// IMPORTANT: Place body parsing middleware before any route handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'https://aakardata.in',
      'https://www.aakardata.in',
      'http://aakardata.in',
      'http://www.aakardata.in'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Add headers middleware for all environments
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://aakardata.in',
    'https://www.aakardata.in',
    'http://aakardata.in',
    'http://www.aakardata.in'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV !== 'production') {
    // In development, allow any origin
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(morgan('dev'));
app.use(requestLogger);

// Add URL rewrite middleware to translate slug URLs to IDs
app.use(urlRewriteMiddleware);

// Serve static files from uploads directory with authentication
app.use('/api/uploads', protectStatic, (req, res, next) => {
  console.log('Static file request:', {
    path: req.path,
    headers: req.headers,
    method: req.method
  });
  
  // Add CORS headers for static files
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://aakardata.in',
    'https://www.aakardata.in',
    'http://aakardata.in',
    'http://www.aakardata.in'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, '../uploads'), {
  fallthrough: false // Return 404 if file not found
}));

// Add public access to uploads for logos and images (no authentication required)
app.use('/api/public/uploads', (req, res, next) => {
  // Add CORS headers for public static files
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://aakardata.in',
    'https://www.aakardata.in',
    'http://aakardata.in',
    'http://www.aakardata.in'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, '../uploads'), {
  fallthrough: false // Return 404 if file not found
}));

// Serve temp files for WhatsApp (publicly accessible)
app.use('/temp', express.static(path.join(__dirname, '../temp'), {
  fallthrough: false
}));

// Handle static file errors
app.use('/api/uploads', (err: any, req: any, res: any, next: any) => {
  console.error('Static file error:', {
    error: err.message,
    code: err.code,
    path: req.path
  });
  
  if (err.code === 'ENOENT') {
    res.status(404).json({ message: 'File not found' });
  } else {
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Root route - REMOVING THIS TO ALLOW FRONTEND TO BE SERVED AT ROOT
// app.get('/', (req, res) => {
//   res.json({ message: 'Exhibition Management API is running' });
// });

// Move the status endpoint to a dedicated API route
app.get('/api/status', (req, res) => {
  res.json({ message: 'Exhibition Management API is running' });
});

// Simple diagnostic endpoint for token verification
app.get('/api/auth-diagnostic', (req, res) => {
  // Set CORS headers immediately for all responses
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({ 
      error: 'No Bearer token provided',
      authHeaderPresent: !!authHeader
    });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token received:', token.substring(0, 20) + '...');
  
  // Environment info
  const envJwtSecret = process.env.JWT_SECRET;
  console.log('JWT_SECRET from env:', envJwtSecret);
  
  // Try with different possible secrets
  const possibleSecrets = [
    envJwtSecret,
    'your_secret_key', // Common default
    'test',            // Common test value
    'secret',          // Common default
    'development',      // Common development value
    'defaultsecret',    // Used in your code
    'exhibitorsecret'   // Used in your code
  ];
  
  const results: Record<string, { success: boolean; decoded?: any; error?: string }> = {};
  
  for (const secret of possibleSecrets) {
    if (!secret) continue;
    
    try {
      const decoded = jwt.verify(token, secret);
      results[secret] = {
        success: true,
        decoded
      };
      console.log(`✅ Token verified successfully with secret: "${secret}"`);
    } catch (err: any) {
      results[secret] = {
        success: false,
        error: err.message
      };
      console.log(`❌ Token verification failed with secret: "${secret}"`);
    }
  }
  
  // Return all the results for analysis
  return res.status(200).json({
    message: 'Auth diagnostic results',
    envSecretPresent: !!envJwtSecret,
    results
  });
});

// Add a direct test route to the server
app.post('/api/exhibitor-register-test', async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, password } = req.body;

    // Log the request for debugging
    console.log('Test registration request:', { 
      companyName, contactPerson, email, phone, 
      hasPassword: !!password
    });

    res.status(200).json({ 
      message: 'Test route working',
      receivedData: { companyName, contactPerson, email, phone }
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: 'Server error in test route' });
  }
});

// Routes
app.use('/api/exhibitors', exhibitorRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/exhibitions', exhibitionRoutes);
app.use('/api/stall-types', stallTypeRoutes);
app.use('/api', stallRoutes);
app.use('/api', fixtureRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/exhibitor-bookings', exhibitorBookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/exhibition-letters', exhibitionLetterRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/analytics', analyticsRoutes);

// Direct endpoint for exhibitor booking that doesn't rely on the global middleware order
app.post('/api/test-booking', authenticateExhibitor, async (req, res) => {
  try {
    console.log('[DEBUG] Test booking request body:', JSON.stringify(req.body, null, 2));
    console.log('[DEBUG] Selected stalls:', req.body.selectedStalls);
    console.log('[DEBUG] StallIds:', req.body.stallIds);
    console.log('[DEBUG] DiscountId:', req.body.discountId);
    
    // Ensure stallIds is populated if it's not in the request
    if (!req.body.stallIds && req.body.selectedStalls) {
      req.body.stallIds = req.body.selectedStalls;
      console.log('[DEBUG] Setting stallIds from selectedStalls:', req.body.stallIds);
    }
    
    // Handle discount data correctly - if we have a discountId, use it to look up the discount
    if (req.body.discountId && !req.body.discount) {
      console.log('[DEBUG] Setting discount object from discountId:', req.body.discountId);
      req.body.discount = {
        name: req.body.discountId
      };
    }
    
    // Get the exhibition for creating the invoice after booking
    const exhibitionId = req.body.exhibitionId;
    let userId: string | undefined;
    
    if (exhibitionId) {
      try {
        const Exhibition = require('./models/exhibition.model').default;
        const exhibition = await Exhibition.findById(exhibitionId);
        if (exhibition) {
          userId = exhibition.createdBy;
          console.log('[DEBUG] Found exhibition:', exhibition._id, 'with userId:', userId);
        }
      } catch (err) {
        console.error('[ERROR] Error fetching exhibition:', err);
      }
    }
    
    // Set up a listener to create invoice after successful booking
    const originalEnd = res.end;
    const originalJson = res.json;
    let responseBody: any;
    
    // Override json to capture the response before sending
    res.json = function(body: any) {
      responseBody = body;
      return originalJson.call(this, body);
    };
    
    // Override end to create invoice after response is sent
    res.end = function(chunk?: any, encoding?: any, cb?: any) {
      // Call original end first to ensure response is sent
      const result = originalEnd.call(this, chunk, encoding, cb);
      
      // Create invoice after response if booking was successful
      if (responseBody && responseBody._id && userId) {
        setTimeout(async () => {
          try {
            const Invoice = require('./models/invoice.model').default;
            const booking = responseBody;
            
            // Check if invoice already exists
            const existingInvoice = await Invoice.findOne({ bookingId: booking._id });
            if (existingInvoice) {
              console.log('[DEBUG] Invoice already exists for booking:', booking._id);
              return;
            }
            
            await Invoice.create({
              bookingId: booking._id,
              userId: userId,
              status: 'pending',
              amount: booking.amount,
              items: booking.calculations.stalls.map((stall: any) => ({
                description: `Stall ${stall.number} Booking`,
                amount: stall.baseAmount,
                discount: stall.discount,
                taxes: booking.calculations.taxes.map((tax: any) => ({
                  name: tax.name,
                  rate: tax.rate,
                  amount: (stall.amountAfterDiscount * tax.rate) / 100
                }))
              })),
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            });
            
            console.log('[DEBUG] Invoice created successfully for booking:', booking._id);
          } catch (err) {
            console.error('[ERROR] Failed to create invoice:', err);
          }
        }, 100); // Small delay to ensure response finishes first
      }
      
      return result;
    };
    
    const { createExhibitorBooking } = require('./controllers/exhibitorBooking.controller');
    await createExhibitorBooking(req, res);
  } catch (error) {
    console.error('[ERROR] Test booking route error:', error);
    res.status(500).json({ message: 'Server error in test booking route', error: String(error) });
  }
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection with cleanup service initialization
connectDB().then(() => {
  console.log('Connected to MongoDB');
  
  // Initialize cleanup service for temporary files
  initializeCleanupService();
  
  // Initialize letter scheduler service
  initializeLetterScheduler();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Anything that doesn't match the above routes, send back the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  }); 