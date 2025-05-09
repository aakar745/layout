/**
 * PDF Generator Service
 * 
 * Handles the core PDF generation functionality using Puppeteer.
 * Transforms invoice data into HTML and then renders as PDF.
 */

import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import Settings from '../models/settings.model';

// Format helpers
const calculateArea = (width: number, height: number): number => {
  return width * height;
};

/**
 * Registers all Handlebars helpers needed for invoice templates
 */
const registerHandlebarsHelpers = () => {
  handlebars.registerHelper('formatCurrency', (value: number) => {
    if (value === null || value === undefined) return '0';
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  });
  
  handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
  
  handlebars.registerHelper('formatDate', (dateString: string | Date) => {
    if (!dateString) return '';
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error(`[ERROR] Invalid date value for formatDate: ${dateString}`);
        return '';
      }
      return date.toLocaleDateString('en-GB');
    } catch (e) {
      console.error(`[ERROR] Date formatting error:`, e);
      return '';
    }
  });
  
  handlebars.registerHelper('formatExhibitionName', (name: string, startDateString: string, endDateString: string) => {
    if (!startDateString || !endDateString) return name || 'Exhibition';
    
    try {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      
      // Group dates by month
      const datesByMonth: { [key: string]: string[] } = {};
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!datesByMonth[monthYear]) {
          datesByMonth[monthYear] = [];
        }
        datesByMonth[monthYear].push(currentDate.getDate().toString().padStart(2, '0'));
        
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate = nextDate;
      }
      
      // Format each month group
      const formattedDateGroups = Object.entries(datesByMonth).map(([monthYear, dates]) => {
        return `${dates.join(', ')} ${monthYear}`;
      });
      
      return `${name || 'Exhibition'} (${formattedDateGroups.join(' & ')})`;
    } catch (e) {
      console.error(`[ERROR] Exhibition name formatting error:`, e);
      return `${name || 'Exhibition'} (${startDateString} - ${endDateString})`;
    }
  });
  
  handlebars.registerHelper('formatTime', (dateString: string | Date) => {
    if (!dateString) return '';
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error(`[ERROR] Invalid date value for formatTime: ${dateString}`);
        return '';
      }
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      console.error(`[ERROR] Time formatting error:`, e);
      return '';
    }
  });
  
  handlebars.registerHelper('calculateArea', (width: number, height: number) => {
    if (typeof width !== 'number' || typeof height !== 'number') {
      return '0';
    }
    return (width * height).toFixed(2);
  });
};

/**
 * Helper function to embed the logo directly in the HTML
 */
export const embedLogo = async (html: string, exhibitionLogoPath: string | null, globalLogoPath: string | null, currentDir: string): Promise<string> => {
  try {
    // If no logo paths are available, return original HTML
    if (!exhibitionLogoPath && !globalLogoPath) {
      return html;
    }
    
    let processedHtml = html;
    
    // Process exhibition logo if available
    if (exhibitionLogoPath) {
      const fullExhibitionLogoPath = join(currentDir, 'uploads', exhibitionLogoPath);
      
      if (existsSync(fullExhibitionLogoPath)) {
        const logoBuffer = readFileSync(fullExhibitionLogoPath);
        const logoBase64 = logoBuffer.toString('base64');
        
        // Determine MIME type based on file extension
        const ext = exhibitionLogoPath.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml'
        };
        const mimeType = mimeTypes[ext] || 'image/png';
        
        // Create data URL
        const dataUrl = `data:${mimeType};base64,${logoBase64}`;
        
        // Replace exhibition logo URL
        const exhibitionLogoRegex = new RegExp(`src=["'].*?${exhibitionLogoPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        processedHtml = processedHtml.replace(exhibitionLogoRegex, `src="${dataUrl}"`);
      } else {
        console.error(`[ERROR] Exhibition logo file not found at: ${fullExhibitionLogoPath}`);
      }
    }
    
    // Process global logo if available
    if (globalLogoPath) {
      const fullGlobalLogoPath = join(currentDir, 'uploads', globalLogoPath);
      
      if (existsSync(fullGlobalLogoPath)) {
        const logoBuffer = readFileSync(fullGlobalLogoPath);
        const logoBase64 = logoBuffer.toString('base64');
        
        // Determine MIME type based on file extension
        const ext = globalLogoPath.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml'
        };
        const mimeType = mimeTypes[ext] || 'image/png';
        
        // Create data URL
        const dataUrl = `data:${mimeType};base64,${logoBase64}`;
        
        // Replace global logo URL
        const globalLogoRegex = new RegExp(`src=["'].*?${globalLogoPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        processedHtml = processedHtml.replace(globalLogoRegex, `src="${dataUrl}"`);
      } else {
        console.error(`[ERROR] Global logo file not found at: ${fullGlobalLogoPath}`);
      }
    }
    
    return processedHtml;
  } catch (error) {
    console.error('[ERROR] Failed to embed logo:', error);
    return html; // Return original HTML if embedding fails
  }
};

/**
 * Prepares the invoice data for template rendering
 */
export const prepareInvoiceData = async (invoice: any, isAdmin: boolean = false) => {
  const { bookingId } = invoice;
  
  if (!bookingId) {
    throw new Error('Invalid invoice data: Missing bookingId');
  }
  
  const exhibition = bookingId.exhibitionId;
  
  if (!exhibition) {
    throw new Error('Invalid invoice data: Missing exhibitionId');
  }
  
  // Get global settings to access logo
  const globalSettings = await Settings.findOne();
  const globalLogo = globalSettings?.logo || null;
  
  // Recalculate totals based on current stall dimensions
  const stalls = bookingId.stallIds.map((stall: any, index: number) => {
    try {
      const width = stall.dimensions?.width || 0;
      const height = stall.dimensions?.height || 0;
      const area = calculateArea(width, height);
      const rate = stall.ratePerSqm || 0;
      const amount = area * rate;
      
      return {
        index: index + 1,
        stallNo: stall.number || `Stall ${index + 1}`,
        stallType: stall.stallTypeId?.name || 'Standard',
        dimensions: `${width}x${height}m`,
        area: Number(area.toFixed(0)),
        rate: rate,
        amount: amount
      };
    } catch (e) {
      console.error(`[ERROR] Error processing stall at index ${index}:`, e);
      return {
        index: index + 1,
        stallNo: `Error (${index + 1})`,
        stallType: 'Error',
        dimensions: 'Error',
        area: 0,
        rate: 0,
        amount: 0
      };
    }
  });
  
  // Calculate new totals based on current stall dimensions
  const recalculatedTotalBaseAmount = stalls.reduce((sum: number, stall: { amount: number }) => sum + stall.amount, 0);
  
  // Check if a discount exists in the booking calculations
  const hasDiscount = bookingId.calculations.stalls?.[0]?.discount !== null && 
                      bookingId.calculations.stalls?.[0]?.discount !== undefined;
  
  // Get discount info from the first stall's discount - only if a discount exists
  const discountInfo = hasDiscount ? bookingId.calculations.stalls?.[0]?.discount : null;
  const discountType = discountInfo?.type || 'percentage';
  const discountValue = discountInfo?.value || 0;
  
  // Recalculate discount and after-discount amount based on discount type
  let recalculatedDiscountAmount = 0;
  if (hasDiscount) {
    if (discountType === 'percentage') {
      // For percentage discount
      recalculatedDiscountAmount = Math.round((recalculatedTotalBaseAmount * discountValue / 100) * 100) / 100;
    } else if (discountType === 'fixed') {
      // For fixed discount - use the original calculated amount or recalculate proportionally
      // Either use the total discount amount from booking calculations or the raw value
      recalculatedDiscountAmount = Math.min(discountValue, recalculatedTotalBaseAmount);
    }
  }
  const recalculatedAmountAfterDiscount = recalculatedTotalBaseAmount - recalculatedDiscountAmount;
  
  // Get GST info
  const gstTax = bookingId.calculations.taxes?.find((tax: any) => tax.name.includes('GST'));
  const gstPercentage = gstTax?.rate || 18;
  
  // Recalculate GST and total
  const recalculatedGstAmount = Math.round((recalculatedAmountAfterDiscount * gstPercentage / 100) * 100) / 100;
  const recalculatedTotalAmount = recalculatedAmountAfterDiscount + recalculatedGstAmount;
  
  // Use recalculated values
  const totalBaseAmount = recalculatedTotalBaseAmount;
  const totalDiscountAmount = recalculatedDiscountAmount;
  const amountAfterDiscount = recalculatedAmountAfterDiscount;
  const gstAmount = recalculatedGstAmount;
  const totalAmount = recalculatedTotalAmount;
  
  // Format dates
  const createdAt = new Date(bookingId.createdAt || Date.now());
  
  // Use filesystem paths for PDF generation instead of URLs
  // This is critical for PDF generation when server isn't running
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Define base URL with proper fallback, use file protocol for local access
  const currentDir = process.cwd();
  const baseUrl = isProduction 
    ? (process.env.BASE_URL || 'http://localhost:5000')
    // Use file:// protocol with absolute path for local testing
    : `file://${join(currentDir, '..')}`;
    
  // Resolve logo paths to absolute filesystem paths for local access
  let exhibitionLogoPath = null;
  let globalLogoPath = null;
  
  if (exhibition.headerLogo) {
    exhibitionLogoPath = exhibition.headerLogo;
  }
  
  if (globalLogo) {
    globalLogoPath = globalLogo;
  }
  
  return {
    baseUrl: baseUrl,
    globalLogo: globalLogoPath,
    exhibitionLogo: exhibitionLogoPath,
    currentDir: currentDir,
    useGlobalLogo: isAdmin,
    bookingId: {
      companyName: bookingId.companyName || 'N/A',
      customerName: bookingId.customerName || 'N/A',
      customerPhone: bookingId.customerPhone || 'N/A',
      customerEmail: bookingId.customerEmail || 'N/A',
      customerGSTIN: bookingId.customerGSTIN || 'N/A',
      customerAddress: bookingId.customerAddress || 'N/A'
    },
    invoice: {
      invoiceNumber: invoice.invoiceNumber || 'Draft',
      date: createdAt,
      time: createdAt
    },
    exhibition: {
      name: exhibition.name || 'Exhibition',
      venue: exhibition.venue || 'N/A',
      startDate: exhibition.startDate || '',
      endDate: exhibition.endDate || '',
      companyName: exhibition.companyName || 'Company Name',
      companyAddress: exhibition.companyAddress || 'N/A',
      companyEmail: exhibition.companyEmail || 'N/A',
      companyWebsite: exhibition.companyWebsite || 'N/A',
      headerLogo: exhibitionLogoPath,
      bankName: exhibition.bankName || 'N/A',
      bankAccount: exhibition.bankAccount || 'N/A',
      bankAccountName: exhibition.bankAccountName || exhibition.companyName || 'N/A',
      bankBranch: exhibition.bankBranch || 'N/A',
      bankIFSC: exhibition.bankIFSC || 'N/A',
      companyCIN: exhibition.companyCIN || 'N/A',
      companyPAN: exhibition.companyPAN || 'N/A',
      companySAC: exhibition.companySAC || 'N/A',
      companyGST: exhibition.companyGST || 'N/A'
    },
    stalls: stalls,
    calculations: {
      totalBaseAmount: totalBaseAmount,
      discountType: discountType,
      discountValue: discountValue,
      discountAmount: totalDiscountAmount,
      amountAfterDiscount: amountAfterDiscount,
      gstPercentage: gstPercentage,
      gstAmount: gstAmount,
      totalAmount: totalAmount
    },
    piInstructions: exhibition.piInstructions || 'THIS INVOICE IS PROFORMA INVOICE DO NOT CLAIM ANY GOVERNMENT CREDITS ON THIS PROFORMA INVOICE FINAL INVOICE WOULD BE RAISED AFTER 100% PAYMENT.',
    terms: exhibition.termsAndConditions || `All cheques / Drafts should be payable to "${exhibition.companyName || 'Company'}" This bill is payable as per agreed terms.`
  };
};

/**
 * Generates a PDF from invoice data using puppeteer
 */
export const generatePDF = async (invoice: any, isAdmin: boolean = false): Promise<Buffer> => {
  try {
    // Get all the data ready
    const data = await prepareInvoiceData(invoice, isAdmin);
    
    // Register Handlebars helpers
    registerHandlebarsHelpers();
    
    // Load and process template
    const currentDir = data.currentDir;
    const templatePath = join(currentDir, 'invoice-template.html');
    const styleSheetPath = join(currentDir, 'invoice-styles.css');
    
    if (!existsSync(templatePath)) {
      throw new Error(`Invoice template file not found at: ${templatePath}`);
    }
    
    if (!existsSync(styleSheetPath)) {
      throw new Error(`Invoice stylesheet file not found at: ${styleSheetPath}`);
    }
    
    let templateHtml = readFileSync(templatePath, 'utf8');
    const styleSheet = readFileSync(styleSheetPath, 'utf8');
    
    // Add stylesheet inline
    templateHtml = templateHtml.replace('</head>', `<style>${styleSheet}</style></head>`);
    
    // Compile the template
    const template = handlebars.compile(templateHtml);
    
    // Generate HTML from template
    const html = template(data);
    
    // Configure puppeteer options for better container compatibility
    const puppeteerOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      timeout: 90000,
      pipe: true // Use pipe instead of WebSocket for better stability in containers
    };
    
    // Use custom Chrome executable path if specified in environment
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (executablePath) {
      console.log(`[DEBUG] Using custom Chrome executable path: ${executablePath}`);
      puppeteerOptions.executablePath = executablePath;
    }
    
    // Launch browser with fallback options if needed
    let browser;
    try {
      browser = await puppeteer.launch(puppeteerOptions);
      console.log('[DEBUG] Puppeteer browser launched successfully');
    } catch (browserError) {
      console.error('[ERROR] Failed to launch puppeteer browser:', browserError);
      // Try with simpler configuration
      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox'],
        timeout: 90000
      });
      console.log('[DEBUG] Puppeteer browser launched with minimal configuration');
    }
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set viewport size to match A4
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 2,
      });
      
      // Embed logos in HTML
      const processedHtml = await embedLogo(html, data.exhibitionLogo, data.globalLogo, currentDir);
      
      // Wrap HTML with additional CSS for better rendering
      const wrappedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 0; background-color: white !important; color: black !important; }
            * { visibility: visible !important; opacity: 1 !important; }
            .proforma-invoice { visibility: visible !important; opacity: 1 !important; }
            
            /* Make sure images are displayed */
            img { display: block !important; visibility: visible !important; }
          </style>
        </head>
        <body>
          ${processedHtml}
        </body>
        </html>
      `;
      
      // Add event listeners for debugging
      page.on('console', msg => console.log('[PUPPETEER CONSOLE]', msg.text()));
      page.on('requestfailed', request => {
        console.error('[PUPPETEER REQUEST FAILED]', request.url(), request.failure()?.errorText);
      });
      
      // Set page content with fallback options
      try {
        await page.setContent(wrappedHtml, { 
          waitUntil: 'networkidle0',
          timeout: 30000
        });
      } catch (contentError) {
        console.error('[ERROR] Failed to set page content:', contentError);
        await page.setContent(wrappedHtml, { 
          waitUntil: 'load',
          timeout: 60000
        });
      }
      
      // Wait for rendering to complete
      await new Promise(r => setTimeout(r, 1000));
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '5mm',
          right: '5mm',
          bottom: '5mm',
          left: '5mm'
        },
        preferCSSPageSize: true,
        timeout: 60000,
        pageRanges: '1' // Only print the first page
      });
      
      return Buffer.from(pdfBuffer);
    } finally {
      // Ensure browser is closed to prevent memory leaks
      if (browser) {
        await browser.close();
      }
    }
  } catch (err) {
    console.error('[ERROR] PDF generation failed:', err);
    if (err instanceof Error) {
      console.error('[ERROR] Stack trace:', err.stack);
    }
    throw err;
  }
}; 