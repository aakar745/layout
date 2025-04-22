# Admin Panel Backend API

A RESTful API built with Node.js, Express, and MongoDB for the Admin Panel application.

## Features

- 🔐 Authentication with JWT
- 👥 Role-based access control
- 📝 CRUD operations for users and roles
- 📅 Exhibition management
- 🎟️ Stall booking system
  - Multiple stall bookings
  - Discount calculations
  - Tax management
  - Status tracking
  - Payment processing
- 🔒 Protected routes
- 🚀 TypeScript support
- 📝 API documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/admin_panel
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile

### Roles
- GET `/api/roles` - Get all roles
- POST `/api/roles` - Create new role (Admin only)
- GET `/api/roles/:id` - Get role by ID
- PUT `/api/roles/:id` - Update role (Admin only)
- DELETE `/api/roles/:id` - Delete role (Admin only)

### Exhibitions
- GET `/api/exhibitions` - Get all exhibitions
- POST `/api/exhibitions` - Create new exhibition (Admin only)
- GET `/api/exhibitions/:id` - Get exhibition by ID
- PUT `/api/exhibitions/:id` - Update exhibition (Admin only)
- DELETE `/api/exhibitions/:id` - Delete exhibition (Admin only)

### Bookings
- GET `/api/bookings` - Get all bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings/:id` - Get booking details
- PATCH `/api/bookings/:id/status` - Update booking status
- PATCH `/api/bookings/:id/payment` - Update payment status
- DELETE `/api/bookings/:id` - Delete booking (Admin only)
- GET `/api/bookings/exhibition/:exhibitionId` - Get exhibition bookings

## Project Structure

```
src/
├── config/         # Configuration files
│   ├── auth/      # Authentication controllers
│   ├── booking/   # Booking controllers
│   └── exhibition/# Exhibition controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
│   ├── booking/   # Booking related models
│   └── exhibition/# Exhibition related models
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Utility functions
└── server.ts       # Entry point
```

## Error Handling

The API uses a centralized error handling mechanism. All errors are caught in the error middleware and returned in a consistent format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Data Validation

### Booking Validation
- Exhibition existence and availability
- Stall availability
- Discount validation
- Tax calculations
- Status transitions

### Exhibition Validation
- Date ranges
- Stall configurations
- Pricing rules

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

# Exhibition Management System - Authentication Guide

## Authentication Architecture







This system uses a dual authentication mechanism for different user types:

### 1. Admin Authentication
- **Used by**: Admin users who manage the exhibition system
- **Implementation**: Standard JWT-based auth
- **Storage**: Tokens stored in localStorage
- **Main files**:
  - `src/controllers/auth.controller.ts` - Login, registration logic
  - `src/middleware/auth.middleware.ts` - Route protection middleware
  - `src/models/user.model.ts` - User model with token generation

### 2. Exhibitor Authentication
- **Used by**: Exhibitors who access their profiles and bookings
- **Implementation**: Separate JWT-based auth system
- **Storage**: Tokens stored in localStorage under different keys
- **Main files**:
  - `src/controllers/exhibitorAuth.controller.ts` - Exhibitor login, registration
  - `src/middleware/exhibitorAuth.middleware.ts` - Exhibitor route protection
  - `src/models/exhibitorUser.model.ts` - Exhibitor user model with token methods

### 3. "No-Auth" Endpoints
- **Purpose**: Direct bypass for exhibitor authentication issues
- **Implementation**: Manual token verification inside route handlers
- **Location**: Defined at the top of `src/server.ts`
- **Usage**: Used for critical exhibitor operations that were failing with middleware

## Token Flow

1. **Admin token generation**:
   - Secret: Uses `process.env.JWT_SECRET` or 'defaultsecret' as fallback
   - Contains: User ID, role information
   - Expiration: 1 day

2. **Exhibitor token generation**:
   - Secret: Uses `process.env.JWT_SECRET` or 'defaultsecret' as fallback
   - Contains: Exhibitor ID, role, type, company name
   - Expiration: 1 day

3. **Token verification**:
   - Admin routes: Verified with `auth.middleware.ts`
   - Exhibitor routes: Verified with `exhibitorAuth.middleware.ts`
   - No-auth endpoints: Manual verification in route handler

## Authentication Middleware Order

The middleware order in `server.ts` is critical:
1. Body parsing middleware (express.json, express.urlencoded)
2. No-auth endpoints (for exhibitor profile operations)
3. CORS configuration
4. Headers configuration
5. Other middleware
6. Standard route handlers

## Important Notes

- **Do not move** the express.json middleware below the route handlers
- The `JWT_SECRET` environment variable must be consistent
- Admin and exhibitor auth systems are completely separate
- Exhibitor model has two implementations (`Exhibitor` and `ExhibitorUser`)
- No-auth endpoints use custom authentication to support both models

## Security Considerations

- The system uses localStorage for tokens (not vulnerable to CSRF)
- If switching to cookie-based auth, add CSRF protection
- Consider implementing rate limiting for login endpoints
- Both auth systems use the same JWT secret (consider separate secrets) 