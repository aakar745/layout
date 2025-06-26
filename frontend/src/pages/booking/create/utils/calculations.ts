import { Stall, Exhibition } from '../../../../services/exhibition';

export interface Tax {
  name: string;
  rate: number;
  amount: number;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface AmountCalculation {
  baseAmount: number;
  selectedDiscount?: Discount;
  discountAmount: number;
  amountAfterDiscount: number;
  taxes: Tax[];
  totalTaxAmount: number;
  totalAmount: number;
}

/**
 * Calculates the base amount for a stall
 * Base amount = Rate per square meter × Width × Height
 */
export const calculateBaseAmount = (stall: Stall): number => {
  return Math.round(stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height * 100) / 100;
};

/**
 * Calculates discount amount based on the type and value
 * Supports two types of discounts:
 * 1. Percentage: Applied as a percentage of the base amount
 * 2. Fixed: Distributed proportionally across selected stalls
 */
export const calculateDiscountAmount = (
  baseAmount: number,
  totalBaseAmount: number,
  discount: { type: 'percentage' | 'fixed'; value: number; isActive: boolean }
): number => {
  if (!discount?.isActive) return 0;

  let amount = 0;
  if (discount.type === 'percentage') {
    amount = baseAmount * (Math.max(0, Math.min(100, discount.value)) / 100);
  } else {
    // For fixed discount, calculate proportional amount but ensure it doesn't exceed base amount
    const proportionalAmount = (baseAmount / totalBaseAmount) * discount.value;
    amount = Math.min(proportionalAmount, baseAmount);
  }
  return Math.round(amount * 100) / 100;
};

/**
 * Calculate all amounts based on current state
 */
export const calculateAmounts = (
  selectedStalls: Stall[],
  selectedExhibition: Exhibition | null,
  selectedDiscountId: string | undefined
): AmountCalculation => {
  const baseAmount = selectedStalls.reduce(
    (sum, stall) => sum + calculateBaseAmount(stall),
    0
  );

  const selectedDiscount = selectedExhibition?.discountConfig?.find(
    d => `${d.name}-${d.value}-${d.type}` === selectedDiscountId && d.isActive
  );

  const discountAmount = selectedDiscount
    ? (selectedDiscount.type === 'percentage'
      ? Math.round((baseAmount * selectedDiscount.value / 100) * 100) / 100
      : Math.min(selectedDiscount.value, baseAmount))
    : 0;

  const amountAfterDiscount = Math.round((baseAmount - discountAmount) * 100) / 100;

  const taxes = selectedExhibition?.taxConfig
    ?.filter(tax => tax.isActive)
    .map(tax => ({
      name: tax.name,
      rate: tax.rate,
      amount: Math.round((amountAfterDiscount * tax.rate / 100) * 100) / 100
    })) || [];

  const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
  const totalAmount = Math.round((amountAfterDiscount + totalTaxAmount) * 100) / 100;

  return {
    baseAmount,
    selectedDiscount,
    discountAmount,
    amountAfterDiscount,
    taxes,
    totalTaxAmount,
    totalAmount
  };
};

/**
 * Calculate basic amenities quantities based on total area
 */
export const calculateBasicAmenitiesQuantities = (
  basicAmenities: any[],
  totalStallArea: number
): any[] => {
  return basicAmenities.map((amenity: any) => {
    // Calculate quantity based on square meters and perSqm rate
    // e.g., 1 table per 9 sqm with total area of 27 sqm = 3 tables
    const calculatedQuantity = Math.floor(totalStallArea / amenity.perSqm) * amenity.quantity;
    
    return {
      ...amenity,
      calculatedQuantity: calculatedQuantity > 0 ? calculatedQuantity : 0,
      key: amenity._id || amenity.id
    };
  });
}; 