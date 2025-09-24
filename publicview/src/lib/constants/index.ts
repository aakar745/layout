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
  name: "Aakar Booking",
  title: "Aakar Booking - Book Your Exhibition Stall",
  description: "Discover and book exhibition stalls across India. Modern exhibition management with real-time booking.",
  url: "https://aakarbooking.com",
  ogImage: "/og-image.jpg",
  adminUrl: "https://admin.aakarbooking.com",
  apiUrl: "https://api.aakarbooking.com",
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Exhibitions", href: "/exhibitions" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const HERO_STATS: StatsItem[] = [
  {
    label: "Years Experience",
    value: "25+",
    icon: Calendar
  },
  {
    label: "Trade Exhibitions", 
    value: "50+",
    icon: Building2
  },
  {
    label: "Exhibitors Served",
    value: "10000+", 
    icon: Users
  },
  {
    label: "Trade Visitors",
    value: "1000000+",
    icon: TrendingUp
  }
];

export const FEATURES: FeatureItem[] = [
  {
    title: "Industry-Focused Events",
    description: "Specialized exhibitions across beauty, technology, gifting, healthcare, and more. We create targeted platforms for specific industries.",
    icon: Zap
  },
  {
    title: "Premium Venues", 
    description: "Partnership with India's top exhibition centers including Science City, Pragati Maidan, and major convention centers nationwide.",
    icon: Building2
  },
  {
    title: "End-to-End Management",
    description: "Complete event management from planning to execution. Marketing, logistics, visitor management - we handle it all.",
    icon: Shield
  },
  {
    title: "Digital Integration",
    description: "Modern digital solutions including online booking, smart layouts, payment integration, and exhibitor management systems.",
    icon: Users
  },
  {
    title: "Proven Track Record",
    description: "25+ years of successful event management with thousands of satisfied exhibitors and consistent growth across India.",
    icon: CheckCircle
  },
  {
    title: "Business Growth",
    description: "Our exhibitions drive real business results with targeted audiences, quality leads, and networking opportunities for exhibitors.",
    icon: TrendingUp
  }
];

