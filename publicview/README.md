# Exhibition Management - Public View

A modern, high-performance Next.js 15 application for the public-facing pages of the Exhibition Management platform. Built with the latest web technologies for optimal SEO and user experience.

## 🚀 Features

- **Next.js 15** with App Router for optimal performance
- **Shadcn/UI** components with Tailwind CSS for beautiful, accessible UI
- **TypeScript** for type safety and better developer experience
- **Responsive Design** that works perfectly on all devices
- **SEO Optimized** with proper meta tags and structured data
- **Performance Focused** with image optimization and code splitting

## 📁 Project Structure

```
publicview/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css        # Global styles and animations
│   │   ├── layout.tsx         # Root layout with Header/Footer
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── home/              # Home page specific components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FeaturedExhibitions.tsx
│   │   │   └── CTASection.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                # Shadcn/UI components
│   ├── lib/
│   │   ├── api/               # API utility functions
│   │   ├── constants/         # Site configuration and data
│   │   └── types/             # TypeScript type definitions
│   └── styles/                # Additional styles
├── public/                    # Static assets
└── package.json
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI (Radix UI + Tailwind)
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Pages Included

### ✅ Home Page
- **Hero Section**: Eye-catching landing with stats and CTAs
- **About Section**: Company mission, values, and timeline
- **Featured Exhibitions**: Showcase of upcoming events
- **Features Section**: Platform capabilities and benefits  
- **CTA Section**: Final call-to-action with contact info

### 🔄 Coming Soon
- Exhibitions listing and details pages
- About Us static page
- Contact Us page
- Exhibitor login/registration pages

## 🎨 Design Principles

- **Mobile-First**: Responsive design that starts with mobile
- **Performance**: Optimized for Core Web Vitals
- **Accessibility**: WCAG 2.1 AA compliant components
- **SEO**: Proper meta tags, structured data, and semantic HTML
- **User Experience**: Smooth animations and intuitive navigation

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🌐 Deployment

This project is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting platform**

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL | `http://localhost:3000` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console verification | - |

## 🤝 Contributing

This is part of the larger Exhibition Management platform. For contributing guidelines, please refer to the main project documentation.

## 📄 License

This project is part of the Exhibition Management platform. All rights reserved.