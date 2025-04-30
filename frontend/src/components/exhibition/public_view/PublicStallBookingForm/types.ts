import { PublicExhibitor, PublicExhibition } from '../../../../services/publicExhibition';

export interface StallDetails {
  id: string;
  number: string;
  stallNumber?: string;
  price: number;
  ratePerSqm: number;
  dimensions: {
    width: number;
    height: number;
  };
  status: 'available' | 'booked' | 'reserved';
  hallId: string;
  hallName?: string;
  type?: string;
  typeName?: string;
  stallType?: {
    name: string;
    description?: string;
  };
}

export interface PublicStallBookingFormProps {
  visible: boolean;
  stallDetails: StallDetails[];
  selectedStallId?: string | null;
  selectedStallIds?: string[];
  loading: boolean;
  exhibition: PublicExhibition;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

export interface StepProps {
  form: any;
  stallDetails?: StallDetails[];
  selectedStallId?: string | null;
  selectedStallIds?: string[];
  exhibition?: PublicExhibition;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: { exhibitor: PublicExhibitor }) => void;
  searchLoading?: boolean;
  exhibitorOptions?: { value: string; label: React.ReactNode; exhibitor: PublicExhibitor }[];
  selectedStallsCount?: number;
  
  // New properties for simplified steps
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
  loading?: boolean;
  formValues?: any;
  selectedStalls?: string[];
}

export interface Step {
  title: string;
  icon: React.ReactNode;
  description?: string;
  content: React.ReactNode;
} 