import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { IServiceCharge } from '../models/serviceCharge.model';
import { IExhibition } from '../models/exhibition.model';

export interface ReceiptData {
  serviceCharge: IServiceCharge;
  exhibition: IExhibition;
}

export class ServiceChargeReceiptService {
  private receiptDir: string;

  constructor() {
    this.receiptDir = path.join(__dirname, '../../receipts');
    this.ensureReceiptDirectory();
  }

  /**
   * Ensure the receipts directory exists
   */
  private ensureReceiptDirectory() {
    if (!fs.existsSync(this.receiptDir)) {
      fs.mkdirSync(this.receiptDir, { recursive: true });
      console.log('[Receipt Service] Created receipts directory:', this.receiptDir);
    }
  }

  /**
   * Generate receipt PDF for service charge
   * @param receiptData Service charge and exhibition data
   * @returns File path of generated PDF
   */
  async generateReceipt(receiptData: ReceiptData): Promise<string> {
    try {
      console.log('[Receipt Service] Generating receipt for:', receiptData.serviceCharge.receiptNumber);

      const html = this.generateReceiptHTML(receiptData);
      const fileName = `receipt-${receiptData.serviceCharge.receiptNumber}-${Date.now()}.pdf`;
      const filePath = path.join(this.receiptDir, fileName);

      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      // Set content and generate PDF
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();

      console.log('[Receipt Service] Receipt generated successfully:', filePath);
      return filePath;

    } catch (error) {
      console.error('[Receipt Service] Error generating receipt:', error);
      throw new Error(`Failed to generate receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate HTML template for receipt
   * @param receiptData Service charge and exhibition data
   * @returns HTML string
   */
  private generateReceiptHTML(receiptData: ReceiptData): string {
    const { serviceCharge, exhibition } = receiptData;
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Charge Receipt - ${serviceCharge.receiptNumber}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            
            .receipt-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
            }
            
            .header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #7C3AED;
                padding-bottom: 10px;
            }
            
            .header h1 {
                color: #7C3AED;
                font-size: 28px;
                margin-bottom: 5px;
            }
            
            .header h2 {
                color: #666;
                font-size: 18px;
                font-weight: normal;
            }
            
            .receipt-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            
            .receipt-left, .receipt-right {
                width: 48%;
            }
            
            .info-section {
                margin-bottom: 20px;
            }
            
            .info-section h3 {
                color: #7C3AED;
                font-size: 16px;
                margin-bottom: 10px;
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
            }
            
            .info-row.highlight {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            
            .label {
                font-weight: 600;
                color: #555;
            }
            
            .value {
                color: #333;
            }
            
            .payment-section {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 8px;
                margin: 30px 0;
                border: 1px solid #e9ecef;
            }
            
            .payment-section h3 {
                color: #7C3AED;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .amount-display {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                color: #28a745;
                margin: 15px 0;
                padding: 10px;
                background: #fff;
                border-radius: 5px;
                border: 2px solid #28a745;
            }
            
            .status-badge {
                display: inline-block;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .status-paid {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .status-pending {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
            }
            
            .company-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                
                .receipt-container {
                    padding: 0;
                    margin: 0;
                    max-width: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <!-- Header -->
            <div class="header">
                <h1>Service Charge Receipt</h1>
                <h2>${exhibition.name}</h2>
            </div>
            
            <!-- Receipt Information -->
            <div class="receipt-info">
                <div class="receipt-left">
                    <div class="info-section">
                        <h3>Receipt Details</h3>
                        <div class="info-row">
                            <span class="label">Receipt Number:</span>
                            <span class="value">${serviceCharge.receiptNumber}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Date & Time:</span>
                            <span class="value">${new Date(serviceCharge.createdAt).toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Payment Status:</span>
                            <span class="value">
                                <span class="status-badge status-${serviceCharge.paymentStatus}">
                                    ${serviceCharge.paymentStatus.toUpperCase()}
                                </span>
                            </span>
                        </div>
                        ${serviceCharge.paidAt ? `
                        <div class="info-row">
                            <span class="label">Payment Date:</span>
                            <span class="value">${new Date(serviceCharge.paidAt).toLocaleString()}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="info-section">
                        <h3>Exhibition Details</h3>
                        <div class="info-row">
                            <span class="label">Event:</span>
                            <span class="value">${exhibition.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Venue:</span>
                            <span class="value">${exhibition.venue}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Date:</span>
                            <span class="value">${new Date(exhibition.startDate).toLocaleDateString()} - ${new Date(exhibition.endDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="receipt-right">
                    <div class="info-section">
                        <h3>Vendor Information</h3>
                        <div class="info-row">
                            <span class="label">Name:</span>
                            <span class="value">${serviceCharge.vendorName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Fabricator Company:</span>
                            <span class="value">${serviceCharge.companyName}</span>
                        </div>
                        ${serviceCharge.exhibitorCompanyName ? `
                        <div class="info-row">
                            <span class="label">Exhibitor Company:</span>
                            <span class="value">${serviceCharge.exhibitorCompanyName}</span>
                        </div>
                        ` : ''}
                        <div class="info-row">
                            <span class="label">Email:</span>
                            <span class="value">${serviceCharge.vendorEmail || 'Not provided'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Phone:</span>
                            <span class="value">${serviceCharge.vendorPhone}</span>
                        </div>
                        ${serviceCharge.stallNumber ? `
                        <div class="info-row">
                            <span class="label">Stall Number:</span>
                            <span class="value">${serviceCharge.stallNumber}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${exhibition.companyName ? `
                    <div class="company-info">
                        <strong>${exhibition.companyName}</strong><br>
                        ${exhibition.companyAddress || ''}<br>
                        ${exhibition.companyEmail || ''}<br>
                        ${exhibition.companyContactNo || ''}
                        ${exhibition.companyGST ? `<br>GST: ${exhibition.companyGST}` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Service Details -->
            <div class="info-section">
                <h3>Service Details</h3>
                <div class="info-row">
                    <span class="label">Service Type:</span>
                    <span class="value">${serviceCharge.serviceType.charAt(0).toUpperCase() + serviceCharge.serviceType.slice(1)}</span>
                </div>
                ${serviceCharge.description ? `
                <div class="info-row">
                    <span class="label">Description:</span>
                    <span class="value">${serviceCharge.description}</span>
                </div>
                ` : ''}
            </div>
            
            <!-- Payment Section -->
            <div class="payment-section">
                <h3>Payment Information</h3>
                <div class="amount-display">
                    ₹${serviceCharge.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                
                ${serviceCharge.razorpayPaymentId ? `
                <div class="info-row">
                    <span class="label">Payment ID:</span>
                    <span class="value">${serviceCharge.razorpayPaymentId}</span>
                </div>
                ` : ''}
                
                ${serviceCharge.razorpayOrderId ? `
                <div class="info-row">
                    <span class="label">Order ID:</span>
                    <span class="value">${serviceCharge.razorpayOrderId}</span>
                </div>
                ` : ''}
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p>For any queries, please contact the exhibition organizer.</p>
                <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Get receipt file path by receipt number
   * @param receiptNumber Receipt number
   * @returns File path if exists, null otherwise
   */
  getReceiptPath(receiptNumber: string): string | null {
    try {
      const files = fs.readdirSync(this.receiptDir);
      const receiptFile = files.find(file => file.includes(receiptNumber) && file.endsWith('.pdf'));
      
      if (receiptFile) {
        return path.join(this.receiptDir, receiptFile);
      }
      
      return null;
    } catch (error) {
      console.error('[Receipt Service] Error finding receipt file:', error);
      return null;
    }
  }

  /**
   * Delete receipt file
   * @param filePath File path to delete
   */
  async deleteReceipt(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('[Receipt Service] Receipt deleted:', filePath);
      }
    } catch (error) {
      console.error('[Receipt Service] Error deleting receipt:', error);
    }
  }

  /**
   * Clean up old receipt files (older than 30 days)
   */
  async cleanupOldReceipts(): Promise<void> {
    try {
      const files = fs.readdirSync(this.receiptDir);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

      for (const file of files) {
        const filePath = path.join(this.receiptDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < thirtyDaysAgo) {
          await this.deleteReceipt(filePath);
        }
      }
      
      console.log('[Receipt Service] Old receipts cleanup completed');
    } catch (error) {
      console.error('[Receipt Service] Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const serviceChargeReceiptService = new ServiceChargeReceiptService(); 