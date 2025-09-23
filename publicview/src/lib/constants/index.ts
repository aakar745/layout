import { FeatureItem, StatsItem, NavigationItem } from '@/lib/types';
import { 
  Calendar, 
  Users, 
  Building2, 
  CheckCircle, 
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export const SITE_CONFIG = {
  name: "Exhibition Management System",
  title: "Exhibition Management System - Book Your Stall",
  description: "Discover and book exhibition stalls across India. Modern exhibition management with real-time booking.",
  url: "https://yourdomain.com",
  ogImage: "/og-image.jpg",
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Exhibitions", href: "/exhibitions" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const HERO_STATS: StatsItem[] = [
  {
    label: "Active Exhibitions",
    value: "50+",
    icon: Calendar
  },
  {
    label: "Happy Exhibitors", 
    value: "1000+",
    icon: Users
  },
  {
    label: "Stalls Booked",
    value: "5000+", 
    icon: Building2
  },
  {
    label: "Success Rate",
    value: "98%",
    icon: TrendingUp
  }
];

export const FEATURES: FeatureItem[] = [
  {
    title: "Real-Time Booking",
    description: "Book your exhibition stalls instantly with our real-time booking system. See availability and confirm your space in seconds.",
    icon: Zap
  },
  {
    title: "Smart Layout Viewer", 
    description: "Interactive floor plans and 3D layouts help you choose the perfect stall location for maximum visibility and foot traffic.",
    icon: Building2
  },
  {
    title: "Secure Payments",
    description: "Multiple payment options with bank-level security. PhonePe integration ensures your transactions are safe and instant.",
    icon: Shield
  },
  {
    title: "Exhibitor Dashboard",
    description: "Manage all your bookings, invoices, and exhibition details from one centralized dashboard with real-time updates.",
    icon: Users
  },
  {
    title: "24/7 Support",
    description: "Get help whenever you need it with our round-the-clock customer support team. We're here to make your experience smooth.",
    icon: CheckCircle
  },
  {
    title: "Analytics & Insights",
    description: "Track your exhibition performance with detailed analytics, visitor insights, and ROI measurements.",
    icon: TrendingUp
  }
];

export const ABOUT_TIMELINE = [
  {
    year: "2020",
    title: "Company Founded",
    description: "Started with a vision to digitize exhibition management in India."
  },
  {
    year: "2021", 
    title: "First 100 Exhibitions",
    description: "Successfully managed our first 100 exhibitions across major cities."
  },
  {
    year: "2022",
    title: "Technology Upgrade", 
    description: "Launched real-time booking system and mobile-first platform."
  },
  {
    year: "2023",
    title: "1000+ Exhibitors",
    description: "Reached milestone of 1000+ satisfied exhibitors and partners."
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Introduced AI-powered stall recommendations and analytics."
  }
];
