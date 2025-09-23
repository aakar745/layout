export interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerLogo?: string;
  sponsorLogos?: string[];
  status: 'draft' | 'published' | 'completed';
  isActive: boolean;
}

// Re-export from exhibitions types
export * from './exhibitions';

export interface NavigationItem {
  name: string;
  href: string;
  icon?: any;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: any;
}

export interface StatsItem {
  label: string;
  value: string;
  icon: any;
}

export interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
}
