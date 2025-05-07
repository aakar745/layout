import React from 'react';
import { formatCurrency } from '../../utils/format';
import './invoice.css';

interface Stall {
  _id: string;
  number: string;
  dimensions: {
    width: number;
    height: number;
  };
  ratePerSqm: number;
}

interface StallWithType extends Stall {
  stallTypeId?: { 
    name: string;
    _id: string;
  };
}

interface Tax {
  name: string;
  rate: number;
  amount: number;
}

interface Exhibition {
  companyName: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  bankBranch: string;
  bankIFSC: string;
  companyCIN: string;
  companyPAN: string;
  companySAC: string;
  companyGST: string;
  companyEmail: string;
  companyWebsite: string;
  companyAddress: string;
  piInstructions?: string;
  termsAndConditions?: string;
  venue?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface BookingExtended {
  exhibitionId: Exhibition;
  companyName: string;
  customerPhone: string;
  customerGSTIN: string;
  customerAddress?: string;
  invoiceNumber: string;
  stallIds: Stall[];
  createdAt: string;
  calculations: {
    totalBaseAmount: number;
    totalDiscountAmount: number;
    totalAmountAfterDiscount: number;
    totalAmount: number;
    stalls: Array<{
      discount?: {
        name?: string;
        type?: 'percentage' | 'fixed';
        value: number;
        amount?: number;
      };
    }>;
    taxes: Tax[];
  };
}

interface InvoiceTemplateProps {
  booking: BookingExtended;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ booking }) => {
  const formatExhibitionName = () => {
    const startDate = new Date(booking.exhibitionId.startDate || '');
    const endDate = new Date(booking.exhibitionId.endDate || '');
    
    // Group dates by month
    const datesByMonth: { [key: string]: string[] } = {};
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!datesByMonth[monthYear]) {
        datesByMonth[monthYear] = [];
      }
      datesByMonth[monthYear].push(currentDate.getDate().toString().padStart(2, '0'));
      
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Format each month group
    const formattedDateGroups = Object.entries(datesByMonth).map(([monthYear, dates]) => {
      return `${dates.join(', ')} ${monthYear}`;
    });
    
    return `${booking.exhibitionId.name || 'ABSE'} (${formattedDateGroups.join(' & ')})`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  // Calculate stall data
  const stallData = booking.stallIds.map((stall: Stall, index: number) => {
    const typedStall = stall as StallWithType;
    const area = stall.dimensions.width * stall.dimensions.height;
    const amount = area * stall.ratePerSqm;
    
    return {
      key: stall._id,
      sn: index + 1,
      stallNo: stall.number,
      stallType: typedStall.stallTypeId?.name || 'Standard',
      dimensions: `${stall.dimensions.width}x${stall.dimensions.height}m`,
      area: area.toFixed(0),
      rate: stall.ratePerSqm.toFixed(0),
      amount: amount
    };
  });

  // Recalculate totals based on current stall dimensions
  const recalculatedTotalBaseAmount = stallData.reduce((sum, stall) => sum + stall.amount, 0);
  
  const calculations = booking.calculations;
  const hasDiscount = calculations.stalls[0]?.discount !== undefined && calculations.stalls[0]?.discount !== null;
  const discountInfo = hasDiscount ? calculations.stalls[0]?.discount : null;
  const discountType = discountInfo?.type || 'percentage';
  const discountValue = discountInfo?.value || 0;
  
  // Recalculate discount and after-discount amount based on discount type
  let recalculatedDiscountAmount = 0;
  if (hasDiscount && discountValue > 0) {
    if (discountType === 'percentage') {
      // For percentage discount
      recalculatedDiscountAmount = Math.round((recalculatedTotalBaseAmount * discountValue / 100) * 100) / 100;
    } else if (discountType === 'fixed') {
      // For fixed discount - use the original discount value or the total discount amount
      recalculatedDiscountAmount = Math.min(discountValue, recalculatedTotalBaseAmount);
    }
  }
  const recalculatedAmountAfterDiscount = recalculatedTotalBaseAmount - recalculatedDiscountAmount;
  
  const gstTax = calculations.taxes.find((tax: Tax) => tax.name.includes('GST'));
  const gstPercentage = gstTax ? gstTax.rate : 18;
  
  // Recalculate GST and total
  const recalculatedGstAmount = Math.round((recalculatedAmountAfterDiscount * gstPercentage / 100) * 100) / 100;
  const recalculatedTotalAmount = recalculatedAmountAfterDiscount + recalculatedGstAmount;
  
  // Use recalculated values for display
  const totalBaseAmount = recalculatedTotalBaseAmount;
  const discountAmount = recalculatedDiscountAmount;
  const amountAfterDiscount = recalculatedAmountAfterDiscount;
  const gstAmount = recalculatedGstAmount;
  const totalAmount = recalculatedTotalAmount;

  return (
    <div className="invoice-container">
      <div className="proforma-invoice">
        <div className="header-section">
          <div className="logo-cell">Logo</div>
          <div className="title-company">
            <div className="title-cell">PROFORMA INVOICE</div>
            <div className="company-cell">{booking.exhibitionId.companyName}</div>
          </div>
        </div>

        <div className="bill-to-section">
          <div className="bill-to-cell">Bill To</div>
          <div className="bill-to-info">
            <div className="info-row">
              <div className="label-cell">Company Name</div>
              <div className="value-cell">{booking.companyName}</div>
              <div className="date-label-cell">Date</div>
              <div className="date-value-cell">{formatDateTime(booking.createdAt).date}</div>
            </div>
            <div className="info-row">
              <div className="label-cell">Phone No.</div>
              <div className="value-cell">{booking.customerPhone}</div>
              <div className="date-label-cell">Time</div>
              <div className="date-value-cell">{formatDateTime(booking.createdAt).time}</div>
            </div>
            <div className="info-row">
              <div className="label-cell">GST No.</div>
              <div className="value-cell">{booking.customerGSTIN}</div>
              <div className="date-label-cell">Invoice No</div>
              <div className="date-value-cell">{booking.invoiceNumber}</div>
            </div>
            <div className="info-row">
              <div className="label-cell">Address</div>
              <div className="value-cell">{booking.customerAddress}</div>
            </div>
          </div>
        </div>

        <div className="expo-venue-section">
          <div className="expo-column">
            <div className="heading">Expo Name</div>
            <div className="content">{formatExhibitionName()}</div>
          </div>
          <div className="venue-column">
            <div className="heading">Venue</div>
            <div className="content">{booking.exhibitionId.venue}</div>
          </div>
        </div>

        <div className="section-header stall-summary-header">Stall Summary</div>

        <div className="stall-table">
          <div className="stall-header">
            <div className="stall-header-cell">S/N</div>
            <div className="stall-header-cell">Stall No.</div>
            <div className="stall-header-cell">Stall Type</div>
            <div className="stall-header-cell">Dimensions</div>
            <div className="stall-header-cell">Area (sqm)</div>
            <div className="stall-header-cell">Rate (per sqm)</div>
            <div className="stall-header-cell">Amount</div>
          </div>
          {stallData.map(stall => (
            <div key={stall.key} className="stall-row">
              <div className="stall-cell">{stall.sn}</div>
              <div className="stall-cell">{stall.stallNo}</div>
              <div className="stall-cell">{stall.stallType}</div>
              <div className="stall-cell">{stall.dimensions}</div>
              <div className="stall-cell">{stall.area}</div>
              <div className="stall-cell">{Number(stall.rate).toLocaleString('en-IN')}</div>
              <div className="stall-cell">{stall.amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div className="section-header">Calculation Summary</div>

        <div className="calc-table">
          <div className="calc-row">
            <div className="calc-label">Total Basic Amount</div>
            <div className="calc-value">₹{totalBaseAmount.toLocaleString('en-IN')}</div>
          </div>
          {hasDiscount && discountAmount > 0 && (
            <div className="calc-row">
              <div className="calc-label">
                {discountType === 'percentage' 
                  ? `Discount (${discountValue}%)`
                  : `Discount (Fixed ₹${discountValue.toLocaleString('en-IN')})`
                }
              </div>
              <div className="calc-value">-₹{discountAmount.toLocaleString('en-IN')}</div>
            </div>
          )}
          <div className="calc-row">
            <div className="calc-label">{hasDiscount && discountAmount > 0 ? 'Amount after Discount' : 'Net Amount'}</div>
            <div className="calc-value">₹{amountAfterDiscount.toLocaleString('en-IN')}</div>
          </div>
          <div className="calc-row">
            <div className="calc-label">GST ({gstPercentage}%)</div>
            <div className="calc-value">₹{gstAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="calc-row total-row">
            <div className="calc-label">Total Amount</div>
            <div className="calc-value">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="details-section">
          <div className="bank-details">
            <div className="details-header">Bank Details</div>
            <div className="details-row">
              <div className="detail-label">Bank Name</div>
              <div className="detail-value">{booking.exhibitionId.bankName}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Account No.</div>
              <div className="detail-value">{booking.exhibitionId.bankAccount}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{booking.exhibitionId.bankAccountName}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Branch</div>
              <div className="detail-value">{booking.exhibitionId.bankBranch}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">IFSC CODE</div>
              <div className="detail-value">{booking.exhibitionId.bankIFSC}</div>
            </div>
          </div>

          <div className="company-details">
            <div className="details-header">Company Details</div>
            <div className="details-row">
              <div className="detail-label">CIN No.</div>
              <div className="detail-value">{booking.exhibitionId.companyCIN}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Pan No.</div>
              <div className="detail-value">{booking.exhibitionId.companyPAN}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">SAC CODE</div>
              <div className="detail-value">{booking.exhibitionId.companySAC}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">GST No.</div>
              <div className="detail-value">{booking.exhibitionId.companyGST}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">{booking.exhibitionId.companyEmail}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Website</div>
              <div className="detail-value">{booking.exhibitionId.companyWebsite}</div>
            </div>
            <div className="details-row">
              <div className="detail-label">Address</div>
              <div className="detail-value">{booking.exhibitionId.companyAddress}</div>
            </div>
          </div>
        </div>

        <div className="instruction-section">
          <div className="instruction-header">PI Instruction</div>
          <div 
            className="instruction-content"
            dangerouslySetInnerHTML={{ 
              __html: booking.exhibitionId.piInstructions || 'THIS INVOICE IS PROFORMA INVOICE DO NOT CLAIM ANY GOVERNMENT CREDITS ON THIS PROFORMA INVOICE. FINAL INVOICE WOULD BE RAISED AFTER 100% PAYMENT.' 
            }}
          />
        </div>

        <div className="instruction-section">
          <div className="instruction-header">Terms & Conditions</div>
          <div 
            className="instruction-content"
            dangerouslySetInnerHTML={{ 
              __html: booking.exhibitionId.termsAndConditions || 'All cheques / Drafts should be payable to "AAKAR EXHIBITION Private Limited". This bill is payable as per agreed terms. All delayed payments will be charged interest @ 18% p.a. All Complaints / Disputes, if any on this bill should reach us within 15 days on receipt of bill, failing which the bill becomes fully payable. Subject to Ahmedabad Jurisdiction.'
            }}
          />
        </div>

        <div className="signature-section">
          <div className="signature-text">Authorised Signature</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate; 