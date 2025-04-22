# Admin Panel Frontend

A modern admin panel built with React, Vite, Redux Toolkit, and Ant Design.

## Features

- 🚀 Built with Vite for lightning-fast development
- 🎨 Beautiful UI with Ant Design components
- 📊 State management with Redux Toolkit
- 🛣️ Routing with React Router
- 🔐 Authentication system
- 👥 Role management
- 📅 Exhibition management
- 🎟️ Stall booking system
  - Multiple stall selection
  - Discount management
  - Tax calculations
  - Status tracking
  - Invoice generation
- ⚙️ Settings management
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── assets/         # Static assets and global styles
├── components/     # Reusable components
├── layouts/        # Layout components
├── pages/         # Page components
│   ├── auth/      # Authentication pages
│   ├── booking/   # Booking system pages
│   │   ├── [id]/     # Booking details
│   │   ├── create/   # Create booking
│   │   ├── list/     # Booking list
│   │   └── manage/   # Booking management
│   ├── dashboard/ # Dashboard pages
│   ├── exhibition/# Exhibition management
│   ├── roles/     # Role management pages
│   └── settings/  # Settings pages
├── services/      # API services
├── store/         # Redux store and slices
│   └── slices/    # Redux slices for state management
└── utils/         # Utility functions
```

## Default Login Credentials

- Username: admin
- Password: admin123

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 