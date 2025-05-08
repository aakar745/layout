export interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  invoicePrefix?: string;
  companyName?: string;
  companyAddress?: string;
  companyContactNo?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyGST?: string;
  companyPAN?: string;
  companySAC?: string;
  companyCIN?: string;
  termsAndConditions?: string;
  piInstructions?: string;
  bankName?: string;
  bankAccount?: string;
  bankIFSC?: string;
  bankBranch?: string;
  bankAccountName?: string;
  headerLogo?: string | null;
}

export interface Stall {
  _id: string;
  number: string;
  dimensions: {
    width: number;
    height: number;
  };
  ratePerSqm: number;
}

export interface Tax {
  name: string;
  rate: number;
  amount: number;
}

export interface Discount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface StallCalculation {
  stallId: string;
  number: string;
  baseAmount: number;
  discount: Discount | null;
  amountAfterDiscount: number;
}

export interface BookingCalculations {
  stalls: StallCalculation[];
  totalBaseAmount: number;
  totalDiscountAmount: number;
  totalAmountAfterDiscount: number;
  taxes: Tax[];
  totalTaxAmount: number;
  totalAmount: number;
}

export interface PaymentDetails {
  method: string;
  transactionId: string;
  paidAt: string;
}

export interface Booking {
  _id: string;
  exhibitionId: Exhibition;
  stallIds: Stall[];
  userId?: string;
  exhibitorId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerGSTIN?: string;
  customerAddress?: string;
  companyName: string;
  amount: number;
  calculations: BookingCalculations;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  bookingId: Booking;
  invoiceNumber: string;
  status: 'pending' | 'paid' | 'refunded';
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
} 